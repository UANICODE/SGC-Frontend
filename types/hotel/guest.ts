// types/hotel/guest.ts

import type { DocumentType } from "./common";

export interface Guest {
  id: string;
  fullName: string;
  documentType: DocumentType | null;
  documentNumber: string | null;
  nationality: string | null;
  age: number | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
}

export interface CreateGuestInput {
  fullName: string;
  documentType?: DocumentType;
  documentNumber?: string;
  nationality?: string;
  age?: number;
  birthDate?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export type UpdateGuestInput = CreateGuestInput;