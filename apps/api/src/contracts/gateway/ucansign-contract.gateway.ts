import { Injectable } from '@nestjs/common';
import { UCanSignClient } from '../ucansign.client';
import type {
  ContractGateway,
  CreateGatewayDocumentInput,
  GatewayDocumentCreated,
  GatewayDocumentFile,
} from './contract-gateway.interface';

@Injectable()
export class UCanSignContractGateway implements ContractGateway {
  constructor(private readonly client: UCanSignClient) {}

  async createDocument(
    input: CreateGatewayDocumentInput,
  ): Promise<GatewayDocumentCreated> {
    const result = await this.client.createDocumentFromTemplate({
      templateId: input.templateId,
      documentName: input.documentName,
      processType: 'PROCEDURE',
      isSequential: input.isSequential ?? true,
      isSendMessage: input.isSendMessage ?? true,
      configExpireMinute: input.expiryMinutes,
      participants: input.participants.map((p) => ({
        name: p.name,
        email: p.email,
        phone: p.phone,
        signingOrder: p.signingOrder,
        signingMethodType: p.signingMethodType,
        authentications: p.authType ? [p.authType] : [],
      })),
      customValue: input.customValues.customValue,
      customValue1: input.customValues.customValue1,
      customValue2: input.customValues.customValue2,
      customValue3: input.customValues.customValue3,
      customValue4: input.customValues.customValue4,
      customValue5: input.customValues.customValue5,
    });
    return { documentId: result.documentId };
  }

  async cancelDocument(documentId: string, reason?: string): Promise<void> {
    await this.client.cancelDocument(documentId, reason);
  }

  async getDocumentFile(documentId: string): Promise<GatewayDocumentFile> {
    const file = await this.client.getDocumentFile(documentId);
    return { url: file.url, expiresAt: file.expiresAt };
  }

  async getAuditTrail(documentId: string): Promise<GatewayDocumentFile> {
    const file = await this.client.getAuditTrail(documentId);
    return { url: file.url, expiresAt: file.expiresAt };
  }
}
