export const CONTRACT_GATEWAY = Symbol('CONTRACT_GATEWAY');

export interface GatewayParticipant {
  name: string;
  email?: string;
  phone?: string;
  signingOrder: number;
  signingMethodType: 'email' | 'kakao' | 'none';
  authType?: 'password' | 'mobile_identification' | 'mobile_otp';
}

export interface GatewayCustomValues {
  customValue?: string;
  customValue1?: string;
  customValue2?: string;
  customValue3?: string;
  customValue4?: string;
  customValue5?: string;
}

export interface CreateGatewayDocumentInput {
  templateId: string;
  documentName: string;
  participants: GatewayParticipant[];
  customValues: GatewayCustomValues;
  expiryMinutes?: number;
  isSequential?: boolean;
  isSendMessage?: boolean;
}

export interface GatewayDocumentCreated {
  documentId: string;
}

export interface GatewayDocumentFile {
  url: string;
  expiresAt?: string;
}

/**
 * Vendor-neutral contract gateway.
 *
 * The interface is intentionally vendor-shaped (template-based document
 * creation, customValue mapping) because rootmatching's domain model is
 * built around the UCanSign workflow. Alternative vendors will require a
 * thin adapter inside their gateway implementation.
 */
export interface ContractGateway {
  createDocument(
    input: CreateGatewayDocumentInput,
  ): Promise<GatewayDocumentCreated>;
  cancelDocument(documentId: string, reason?: string): Promise<void>;
  getDocumentFile(documentId: string): Promise<GatewayDocumentFile>;
  getAuditTrail(documentId: string): Promise<GatewayDocumentFile>;
}
