import { type Guest as PrismaGuest, type User } from '@prisma/client'

export enum States {
  pending = 'pending',
  accepted = 'accepted',
  declined = 'declined',
}

export interface Guest {
  event: number
  name: string[]
  slug: string
  isFamily: boolean
  state: States
  amount: number
  maxAmount: number
  host: {
    name: string
  }
  contacted: boolean
}

export enum GuestType {
  single,
  couple,
  family,
}

export type GuestWithHost = PrismaGuest & {
  host: User
}

export enum STATE {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
  accepting = 'accepting'
}

export enum TABS {
  assistance = 'assistance',
  contact = 'contact',
  housing = 'housing',
  commuting = 'commuting',
  gift = 'gift'
}
