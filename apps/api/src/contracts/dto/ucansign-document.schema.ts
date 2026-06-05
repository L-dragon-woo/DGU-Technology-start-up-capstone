import { z } from 'zod';

/**
 * Vendor responses share an envelope `{ msg, result, code }` with `code === 0`
 * on success. Reference: docs/specs/ucansign-api-reference.md §2
 *
 * Envelope and result are validated in two separate passes to keep zod's
 * generic mapped-type inference simple.
 */
const UCanSignEnvelopeShapeSchema = z.object({
  msg: z.string(),
  code: z.number(),
  result: z.unknown(),
});

export function parseUCanSignEnvelope<T extends z.ZodTypeAny>(
  data: unknown,
  resultSchema: T,
):
  | { ok: true; msg: string; code: number; result: z.infer<T> }
  | { ok: false; error: string } {
  const envelope = UCanSignEnvelopeShapeSchema.safeParse(data);
  if (!envelope.success) {
    return { ok: false, error: `envelope: ${envelope.error.message}` };
  }
  const result = resultSchema.safeParse(envelope.data.result);
  if (!result.success) {
    return { ok: false, error: `result: ${result.error.message}` };
  }
  return {
    ok: true,
    msg: envelope.data.msg,
    code: envelope.data.code,
    result: result.data,
  };
}

export const UCanSignTokenResultSchema = z.object({
  accessToken: z.string(),
});
export type UCanSignTokenResult = z.infer<typeof UCanSignTokenResultSchema>;

export const UCanSignUserSchema = z
  .object({
    userId: z.union([z.string(), z.number()]).transform(String),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    status: z.string(),
    senderName: z.string().optional(),
    companyName: z.string().optional(),
    companyRegistrationNumber: z.string().optional(),
    linkedService: z.string().optional(),
  })
  .passthrough();
export type UCanSignUser = z.infer<typeof UCanSignUserSchema>;

export const UCanSignPointBalanceSchema = z.object({
  balance: z.number(),
});
export type UCanSignPointBalance = z.infer<typeof UCanSignPointBalanceSchema>;

export const UCanSignParticipantInputSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  signingOrder: z.number().int().positive(),
  signingMethodType: z.enum(['email', 'kakao', 'none']).default('email'),
  authentications: z
    .array(z.enum(['password', 'mobile_identification', 'mobile_otp']))
    .default([]),
});
export type UCanSignParticipantInput = z.infer<
  typeof UCanSignParticipantInputSchema
>;

export const UCanSignDocumentCreatedSchema = z
  .object({
    documentId: z.string(),
    documentName: z.string().optional(),
    status: z.string().optional(),
  })
  .passthrough();
export type UCanSignDocumentCreated = z.infer<
  typeof UCanSignDocumentCreatedSchema
>;

export const UCanSignDocumentParticipantSchema = z
  .object({
    participantId: z.union([z.string(), z.number()]).transform(String),
    name: z.string(),
    email: z.string().email().optional(),
    status: z.string(),
    signingOrder: z.number().int(),
    signedAt: z.string().optional(),
  })
  .passthrough();

export const UCanSignDocumentDetailSchema = z
  .object({
    documentId: z.string(),
    documentName: z.string(),
    status: z.string(),
    customValue: z.string().optional(),
    customValue1: z.string().optional(),
    customValue2: z.string().optional(),
    customValue3: z.string().optional(),
    customValue4: z.string().optional(),
    customValue5: z.string().optional(),
    participants: z.array(UCanSignDocumentParticipantSchema).default([]),
  })
  .passthrough();
export type UCanSignDocumentDetail = z.infer<
  typeof UCanSignDocumentDetailSchema
>;

/** Vendor-hosted download URL with vendor-stated 3-minute expiry. */
export const UCanSignDocumentFileSchema = z
  .object({
    url: z.string().url(),
    expiresAt: z.string().optional(),
  })
  .passthrough();
export type UCanSignDocumentFile = z.infer<typeof UCanSignDocumentFileSchema>;

export const UCanSignCancelResultSchema = z
  .object({
    canceled: z.boolean().optional(),
  })
  .passthrough();
export type UCanSignCancelResult = z.infer<typeof UCanSignCancelResultSchema>;
