import { z } from 'zod';

/**
 * UCanSign webhook payload schema (4 event types).
 * Reference: docs/specs/ucansign-api-reference.md §2.8
 *
 * customValue / customValue1-5 carry rootmatching internal IDs set at
 * document creation time (see ContractsService.create()).
 *  - customValue  = quoteRequestId
 *  - customValue1 = acceptedQuoteId
 *  - customValue2 = clientCompanyId
 *  - customValue3 = factoryCompanyId
 *  - customValue4 = tenantId (reserved)
 *  - customValue5 = rootmatching Contract.id (PRIMARY mapping key)
 */

const customValueFields = {
  customValue: z.string().optional(),
  customValue1: z.string().optional(),
  customValue2: z.string().optional(),
  customValue3: z.string().optional(),
  customValue4: z.string().optional(),
  customValue5: z.string().optional(),
} as const;

const baseEventFields = {
  documentId: z.string(),
  documentName: z.string().optional(),
  folderId: z.string().optional(),
  occurredAt: z.string().optional(),
  ...customValueFields,
} as const;

export const UCanSignWebhookSchema = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('sign_creating'),
    ...baseEventFields,
  }),
  z.object({
    eventType: z.literal('signing_canceled'),
    ...baseEventFields,
    cancelReason: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('signing_completed'),
    ...baseEventFields,
    participantId: z.union([z.string(), z.number()]).transform(String),
    participantName: z.string().optional(),
    participantSigningOrder: z.number().int(),
  }),
  z.object({
    eventType: z.literal('signing_completed_all'),
    ...baseEventFields,
    participantId: z
      .union([z.string(), z.number()])
      .transform(String)
      .optional(),
    participantName: z.string().optional(),
    participantSigningOrder: z.number().int().optional(),
  }),
]);

export type UCanSignWebhookPayload = z.infer<typeof UCanSignWebhookSchema>;
export type UCanSignWebhookEventType = UCanSignWebhookPayload['eventType'];
