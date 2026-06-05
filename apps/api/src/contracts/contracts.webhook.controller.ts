import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { ContractsService } from './contracts.service';
import { UCanSignWebhookSchema } from './dto/ucansign-webhook.schema';

/**
 * Vendor webhook receiver.
 * Reference: docs/specs/ucansign-api-reference.md §2.8 + §5.5 + §8.3
 *
 * Verification policy:
 *  1. If UCANSIGN_WEBHOOK_SECRET is configured: verify HMAC-SHA256 over the
 *     raw JSON body using the header named by UCANSIGN_WEBHOOK_SIGNATURE_HEADER
 *     (default `x-ucansign-signature`).
 *  2. If no secret is configured: skip header verification and rely on
 *     customValue5 (rootmatching contractId) matching an existing record
 *     (§8.3 fallback). Suitable for dev / test mode where vendor has not
 *     yet provisioned a signing secret.
 *
 * NOTE: this endpoint is intentionally NOT guarded by BetterAuthGuard —
 * vendor calls it with no session cookie. The HMAC + customValue match is
 * the security boundary.
 */
@Controller('webhooks/ucansign')
export class ContractsWebhookController {
  private readonly logger = new Logger(ContractsWebhookController.name);

  constructor(
    private readonly contracts: ContractsService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @HttpCode(200)
  handle(
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Body() rawBody: unknown,
  ): { matched: boolean; contractId?: string } {
    const secret = this.config.get<string>('UCANSIGN_WEBHOOK_SECRET');
    if (secret) {
      this.verifySignature(headers, rawBody, secret);
    }

    const parsed = UCanSignWebhookSchema.safeParse(rawBody);
    if (!parsed.success) {
      this.logger.warn(
        `Unparseable UCanSign webhook payload: ${parsed.error.message}`,
      );
      return { matched: false };
    }

    this.logger.log(
      `Webhook eventType=${parsed.data.eventType} documentId=${parsed.data.documentId}`,
    );
    return this.contracts.handleWebhook(parsed.data);
  }

  private verifySignature(
    headers: Record<string, string | string[] | undefined>,
    rawBody: unknown,
    secret: string,
  ): void {
    const headerName =
      this.config.get<string>('UCANSIGN_WEBHOOK_SIGNATURE_HEADER') ??
      'x-ucansign-signature';

    const headerValue = headers[headerName.toLowerCase()];
    const providedHex = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;
    if (!providedHex) {
      throw new UnauthorizedException(
        `Missing webhook signature header: ${headerName}`,
      );
    }

    const computedHex = createHmac('sha256', secret)
      .update(JSON.stringify(rawBody))
      .digest('hex');

    const providedBuf = Buffer.from(providedHex, 'hex');
    const computedBuf = Buffer.from(computedHex, 'hex');

    if (
      providedBuf.length !== computedBuf.length ||
      !timingSafeEqual(providedBuf, computedBuf)
    ) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
