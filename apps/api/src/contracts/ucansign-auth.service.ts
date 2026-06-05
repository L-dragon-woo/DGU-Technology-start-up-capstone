import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  parseUCanSignEnvelope,
  UCanSignTokenResultSchema,
} from './dto/ucansign-document.schema';

/**
 * UCanSign access token cache + refresh service.
 *
 * Reference: docs/specs/ucansign-api-reference.md §1.1 + §8.4
 * Vendor accessToken lifetime: 30 minutes. We refresh 5 minutes before expiry
 * to avoid mid-request 401s, and dedupe concurrent refresh requests.
 *
 * NOTE (Phase 6): in-memory cache is fine for single-instance dev. For
 * horizontal scale, swap to Redis via @nestjs/cache-manager (see spec §8.4).
 */
const SAFETY_MARGIN_MS = 5 * 60_000; // refresh 5min before expiry
const TOKEN_LIFETIME_MS = 30 * 60_000; // vendor-stated 30min lifetime
const TOKEN_REFRESH_TIMEOUT_MS = 10_000;

@Injectable()
export class UCanSignAuthService {
  private readonly logger = new Logger(UCanSignAuthService.name);
  private cached: { value: string; expiresAt: number } | null = null;
  private inflight: Promise<string> | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.cached && this.cached.expiresAt - Date.now() > SAFETY_MARGIN_MS) {
      return this.cached.value;
    }
    if (this.inflight) {
      return this.inflight;
    }
    this.inflight = this.refresh().finally(() => {
      this.inflight = null;
    });
    return this.inflight;
  }

  /**
   * Force-refresh the token (e.g., after a 401 from a downstream vendor call).
   * Bypasses the cache check.
   */
  async forceRefresh(): Promise<string> {
    this.cached = null;
    return this.getAccessToken();
  }

  private async refresh(): Promise<string> {
    const apiKey = this.config.get<string>('UCANSIGN_API_KEY');
    const baseUrl =
      this.config.get<string>('UCANSIGN_BASE_URL') ??
      'https://app.ucansign.com/openapi';

    if (!apiKey) {
      throw new UnauthorizedException('UCANSIGN_API_KEY is not configured');
    }

    const start = Date.now();
    const response = await firstValueFrom(
      this.http.post(
        `${baseUrl}/user/token`,
        { apiKey },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: TOKEN_REFRESH_TIMEOUT_MS,
        },
      ),
    );

    const parsed = parseUCanSignEnvelope(
      response.data,
      UCanSignTokenResultSchema,
    );
    if (!parsed.ok) {
      throw new UnauthorizedException(
        `UCanSign token response invalid: ${parsed.error}`,
      );
    }
    if (parsed.code !== 0) {
      throw new UnauthorizedException(
        `UCanSign token refresh failed: ${parsed.msg} (code=${parsed.code})`,
      );
    }

    const accessToken = parsed.result.accessToken;
    const expiresAt = Date.now() + TOKEN_LIFETIME_MS;
    this.cached = { value: accessToken, expiresAt };
    this.logger.debug(
      `Refreshed access token in ${Date.now() - start}ms (expires ${new Date(expiresAt).toISOString()})`,
    );
    return accessToken;
  }
}
