import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { z } from 'zod';
import {
  parseUCanSignEnvelope,
  UCanSignCancelResultSchema,
  UCanSignDocumentCreatedSchema,
  UCanSignDocumentDetailSchema,
  UCanSignDocumentFileSchema,
  type UCanSignParticipantInput,
  UCanSignPointBalanceSchema,
  UCanSignUserSchema,
} from './dto/ucansign-document.schema';
import { UCanSignAuthService } from './ucansign-auth.service';

/**
 * HTTP wrapper for the UCanSign vendor API.
 * Reference: docs/specs/ucansign-api-reference.md §2
 *
 * Responsibilities:
 *  - Inject `Authorization: Bearer <accessToken>` via {@link UCanSignAuthService}
 *  - Inject `x-ucansign-test: true` header when UCANSIGN_TEST_MODE=true
 *  - Validate every vendor response with a zod schema (envelope + result)
 *  - On 401, force-refresh token and retry the request ONCE
 *
 * NOTE: this client deliberately stays vendor-shaped. The
 * ContractGateway abstraction (mock vs real) will be added in STEP 2.
 */
const REQUEST_TIMEOUT_MS = 15_000;

interface TemplateBasedDocumentInput {
  templateId: string;
  documentName: string;
  folderId?: string;
  configExpireMinute?: number;
  processType?: 'PROCEDURE';
  isSequential?: boolean;
  isSendMessage?: boolean;
  participants: UCanSignParticipantInput[];
  customValue?: string;
  customValue1?: string;
  customValue2?: string;
  customValue3?: string;
  customValue4?: string;
  customValue5?: string;
}

@Injectable()
export class UCanSignClient {
  private readonly logger = new Logger(UCanSignClient.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly auth: UCanSignAuthService,
  ) {}

  private get baseUrl(): string {
    return (
      this.config.get<string>('UCANSIGN_BASE_URL') ??
      'https://app.ucansign.com/openapi'
    );
  }

  private get testMode(): boolean {
    return this.config.get<string>('UCANSIGN_TEST_MODE') === 'true';
  }

  /**
   * Send an authorized request and parse the response with the given result schema.
   * Retries ONCE after a 401 by forcing a token refresh.
   */
  private async request<T extends z.ZodTypeAny>(
    config: AxiosRequestConfig,
    resultSchema: T,
  ): Promise<z.infer<T>> {
    const send = async (): Promise<z.infer<T>> => {
      const token = await this.auth.getAccessToken();
      const response = await firstValueFrom(
        this.http.request({
          ...config,
          headers: {
            'Content-Type': 'application/json',
            ...(config.headers ?? {}),
            Authorization: `Bearer ${token}`,
            ...(this.testMode ? { 'x-ucansign-test': 'true' } : {}),
          },
          timeout: REQUEST_TIMEOUT_MS,
        }),
      );

      const parsed = parseUCanSignEnvelope(response.data, resultSchema);
      if (!parsed.ok) {
        throw new BadGatewayException(
          `UCanSign response invalid: ${parsed.error}`,
        );
      }
      if (parsed.code !== 0) {
        throw new BadGatewayException(
          `UCanSign API error: ${parsed.msg} (code=${parsed.code})`,
        );
      }
      return parsed.result;
    };

    try {
      return await send();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          this.logger.warn(
            'UCanSign returned 401; forcing token refresh + 1 retry',
          );
          await this.auth.forceRefresh();
          return send();
        }
        if (
          error.code === 'ECONNABORTED' ||
          error.code === 'ENOTFOUND' ||
          error.code === 'ETIMEDOUT'
        ) {
          throw new ServiceUnavailableException(
            `UCanSign network error: ${error.code}`,
          );
        }
      }
      throw error;
    }
  }

  async getUser() {
    return this.request(
      { method: 'GET', url: `${this.baseUrl}/user` },
      UCanSignUserSchema,
    );
  }

  async getPointBalance() {
    return this.request(
      { method: 'GET', url: `${this.baseUrl}/point/balance` },
      UCanSignPointBalanceSchema,
    );
  }

  async createDocumentFromTemplate(input: TemplateBasedDocumentInput) {
    const { templateId, ...body } = input;
    return this.request(
      {
        method: 'POST',
        url: `${this.baseUrl}/templates/${templateId}`,
        data: body,
      },
      UCanSignDocumentCreatedSchema,
    );
  }

  async getDocument(documentId: string) {
    return this.request(
      { method: 'GET', url: `${this.baseUrl}/documents/${documentId}` },
      UCanSignDocumentDetailSchema,
    );
  }

  async getDocumentFile(documentId: string) {
    return this.request(
      { method: 'GET', url: `${this.baseUrl}/documents/${documentId}/file` },
      UCanSignDocumentFileSchema,
    );
  }

  async getAuditTrail(documentId: string) {
    return this.request(
      {
        method: 'GET',
        url: `${this.baseUrl}/documents/${documentId}/audit-trail`,
      },
      UCanSignDocumentFileSchema,
    );
  }

  async cancelDocument(documentId: string, reason?: string) {
    return this.request(
      {
        method: 'POST',
        url: `${this.baseUrl}/documents/${documentId}/request/cancellation`,
        data: reason ? { reason } : {},
      },
      UCanSignCancelResultSchema,
    );
  }
}
