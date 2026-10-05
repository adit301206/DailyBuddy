export type CommitmentFrequency = 'DAILY' | 'WEEKLY';

export interface Commitment {
  id: number;
  name: string;
  category: number | null;
  category_name?: string | null;
  frequency: CommitmentFrequency;
  target_time: string | null;
  active: boolean;
  created_at: string;
}

export interface CommitmentLog {
  id: number;
  commitment: number;
  commitment_name?: string;
  date: string;
  completed: boolean;
  completed_at?: string | null;
}

export interface CreateCommitmentInput {
  name: string;
  category?: number | null;
  frequency: CommitmentFrequency;
  target_time?: string | null;
  active?: boolean;
}

export interface UpdateCommitmentInput {
  name?: string;
  category?: number | null;
  frequency?: CommitmentFrequency;
  target_time?: string | null;
  active?: boolean;
}
