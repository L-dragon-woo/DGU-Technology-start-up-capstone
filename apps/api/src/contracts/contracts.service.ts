import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { CreateContractInput } from './dto/create-contract.dto';
import type { UCanSignWebhookPayload } from './dto/ucansign-webhook.schema';
import {
  CONTRACT_GATEWAY,
  type ContractGateway,
} from './gateway/contract-gateway.interface';

/**
 * ContractsService — orchestration between rootmatching state and the
 * UCanSign vendor.
 *
 * Reference: docs/specs/ucansign-api-reference.md §4.4
 *
 * STATE STRATEGY (STEP 1):
 *  - In-memory Map for development. This is intentional — STEP 6 of the
 *    integration plan introduces Prisma `Contract` + `ContractParticipant`
 *    models and replaces this Map with PrismaService.
 *  - DO NOT add Prisma calls here yet; it would conflict with the planned
 *    migration order.
 *
 * STATUS TRANSITIONS:
 *   draft → pending → in_progress → completed
 *                         │
 *                         └──→ cancelled
 */
export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ContractParticipantStatus = 'need_signing' | 'completed';

export interface ContractParticipantRecord {
  id: string;
  role: 'client' | 'factory';
  name: string;
  email?: string;
  phone?: string;
  signingOrder: number;
  signingMethodType: 'email' | 'kakao' | 'none';
  authType?: 'password' | 'mobile_identification' | 'mobile_otp';
  ucansignParticipantId?: string;
  status: ContractParticipantStatus;
  signedAt?: string;
}

export interface ContractRecord {
  id: string;
  ownerUserId: string;
  title: string;
  status: ContractStatus;
  ucansignDocumentId?: string;
  ucansignTemplateId: string;
  ucansignFolderId?: string;
  quoteRequestId?: string;
  acceptedQuoteId?: string;
  clientCompanyId?: string;
  factoryCompanyId?: string;
  participants: ContractParticipantRecord[];
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

interface CancelContractOptions {
  reason?: string;
}

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);

  private readonly contracts = new Map<string, ContractRecord>();
  private readonly byDocumentId = new Map<string, string>();

  constructor(
    @Inject(CONTRACT_GATEWAY) private readonly gateway: ContractGateway,
    private readonly config: ConfigService,
  ) {}

  async create(
    userId: string,
    input: CreateContractInput,
  ): Promise<ContractRecord> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const participants: ContractParticipantRecord[] = input.participants.map(
      (p) => ({
        id: randomUUID(),
        role: p.role,
        name: p.name,
        email: p.email,
        phone: p.phone,
        signingOrder: p.signingOrder,
        signingMethodType: p.signingMethodType,
        authType: p.authType,
        status: 'need_signing',
      }),
    );

    const defaultExpiryMinutes = Number(
      this.config.get<string>('UCANSIGN_DEFAULT_EXPIRY_MINUTES') ?? '20160',
    );

    const document = await this.gateway.createDocument({
      templateId: input.templateId,
      documentName: input.title,
      isSequential: true,
      isSendMessage: true,
      expiryMinutes: input.expiryMinutes ?? defaultExpiryMinutes,
      participants: participants.map((p) => ({
        name: p.name,
        email: p.email,
        phone: p.phone,
        signingOrder: p.signingOrder,
        signingMethodType: p.signingMethodType,
        authType: p.authType,
      })),
      customValues: {
        customValue: input.quoteRequestId,
        customValue1: input.acceptedQuoteId,
        customValue2: input.clientCompanyId,
        customValue3: input.factoryCompanyId,
        customValue5: id,
      },
    });

    const record: ContractRecord = {
      id,
      ownerUserId: userId,
      title: input.title,
      status: 'pending',
      ucansignDocumentId: document.documentId,
      ucansignTemplateId: input.templateId,
      quoteRequestId: input.quoteRequestId,
      acceptedQuoteId: input.acceptedQuoteId,
      clientCompanyId: input.clientCompanyId,
      factoryCompanyId: input.factoryCompanyId,
      participants,
      createdAt: now,
      updatedAt: now,
      sentAt: now,
    };

    this.contracts.set(id, record);
    this.byDocumentId.set(document.documentId, id);
    this.logger.log(
      `Contract ${id} created (documentId=${document.documentId}, participants=${participants.length})`,
    );
    return record;
  }

  list(userId: string): ContractRecord[] {
    return Array.from(this.contracts.values())
      .filter((c) => c.ownerUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  get(userId: string, id: string): ContractRecord {
    const record = this.contracts.get(id);
    if (!record) {
      throw new NotFoundException(`Contract ${id} not found`);
    }
    if (record.ownerUserId !== userId) {
      throw new ForbiddenException();
    }
    return record;
  }

  async cancel(
    userId: string,
    id: string,
    options: CancelContractOptions = {},
  ): Promise<ContractRecord> {
    const record = this.get(userId, id);
    if (record.status === 'completed' || record.status === 'cancelled') {
      return record;
    }
    if (!record.ucansignDocumentId) {
      throw new NotFoundException(
        'Vendor document not yet provisioned for this contract',
      );
    }

    await this.gateway.cancelDocument(
      record.ucansignDocumentId,
      options.reason,
    );

    const now = new Date().toISOString();
    const updated: ContractRecord = {
      ...record,
      status: 'cancelled',
      cancelledAt: now,
      cancelledReason: options.reason,
      updatedAt: now,
    };
    this.contracts.set(id, updated);
    this.logger.log(`Contract ${id} cancelled`);
    return updated;
  }

  /**
   * Returns a vendor-hosted PDF download URL.
   * NOTE: the URL expires in 3 minutes per vendor spec (§2.2). The caller
   * should either use it immediately or persist the PDF binary (Phase 3+).
   */
  async getPdfUrl(userId: string, id: string): Promise<{ url: string }> {
    const record = this.get(userId, id);
    if (!record.ucansignDocumentId) {
      throw new NotFoundException(
        'Vendor document not yet provisioned for this contract',
      );
    }
    const file = await this.gateway.getDocumentFile(record.ucansignDocumentId);
    return { url: file.url };
  }

  handleWebhook(payload: UCanSignWebhookPayload): {
    matched: boolean;
    contractId?: string;
  } {
    // Prefer the rootmatching internal id stored in customValue5; fall back
    // to the documentId lookup map.
    const internalId =
      payload.customValue5 ?? this.byDocumentId.get(payload.documentId);

    if (!internalId) {
      this.logger.warn(
        `Webhook for unknown documentId=${payload.documentId} (eventType=${payload.eventType})`,
      );
      return { matched: false };
    }

    const record = this.contracts.get(internalId);
    if (!record) {
      this.logger.warn(
        `Webhook customValue5=${internalId} but no contract record found`,
      );
      return { matched: false };
    }

    const now = new Date().toISOString();
    let next: ContractRecord = { ...record, updatedAt: now };

    switch (payload.eventType) {
      case 'sign_creating':
        next = {
          ...next,
          status: next.status === 'draft' ? 'pending' : next.status,
        };
        break;

      case 'signing_canceled':
        next = {
          ...next,
          status: 'cancelled',
          cancelledAt: now,
          cancelledReason: payload.cancelReason ?? next.cancelledReason,
        };
        break;

      case 'signing_completed':
        next = {
          ...next,
          status: 'in_progress',
          participants: next.participants.map((p) =>
            p.signingOrder === payload.participantSigningOrder
              ? {
                  ...p,
                  status: 'completed',
                  signedAt: now,
                  ucansignParticipantId: payload.participantId,
                }
              : p,
          ),
        };
        break;

      case 'signing_completed_all':
        next = {
          ...next,
          status: 'completed',
          completedAt: now,
          participants: next.participants.map((p) =>
            p.status === 'need_signing'
              ? { ...p, status: 'completed', signedAt: now }
              : p,
          ),
        };
        // TODO (Phase 4): emit escrow trigger event here.
        break;
    }

    this.contracts.set(internalId, next);
    this.logger.log(
      `Webhook ${payload.eventType} applied to contract ${internalId}`,
    );
    return { matched: true, contractId: internalId };
  }
}
