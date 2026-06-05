import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * POST /contracts request body schema.
 * Reference: docs/specs/ucansign-api-reference.md §4.3
 *
 * NOTE (STEP 1): kept inline here rather than in `packages/shared` because
 * STEP 1 is API-internal. When STEP 2 wires this to the web frontend,
 * hoist the schema to `packages/shared/src/schemas/contract.ts`.
 */
export const CreateContractParticipantSchema = z.object({
  role: z.enum(['client', 'factory']),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  signingOrder: z.number().int().positive(),
  signingMethodType: z.enum(['email', 'kakao', 'none']).default('email'),
  authType: z
    .enum(['password', 'mobile_identification', 'mobile_otp'])
    .optional(),
});

export const CreateContractSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
  title: z.string().min(1).max(200),
  participants: z.array(CreateContractParticipantSchema).min(2).max(5),
  quoteRequestId: z.string().optional(),
  acceptedQuoteId: z.string().optional(),
  clientCompanyId: z.string().optional(),
  factoryCompanyId: z.string().optional(),
  expiryMinutes: z.number().int().positive().optional(),
});

export type CreateContractInput = z.infer<typeof CreateContractSchema>;

export class CreateContractDto extends createZodDto(CreateContractSchema) {}

export const CancelContractSchema = z.object({
  reason: z.string().max(500).optional(),
});

export class CancelContractDto extends createZodDto(CancelContractSchema) {}
