import { z } from "zod"

export const participantListItemSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    phone: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const participantsResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        participants: z.array(participantListItemSchema),
        total: z.number(),
        message: z.string()
    })
})

export type ParticipantListItem = z.infer<typeof participantListItemSchema>
export type ParticipantsResponse = z.infer<typeof participantsResponseSchema>

export interface SorteoResult {
    winner: ParticipantListItem
    timestamp: string
    participants: ParticipantListItem[]
}