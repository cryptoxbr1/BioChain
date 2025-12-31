export enum JobStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

export interface MoleculeStats {
  dockingScore: number; // kcal/mol
  bindingEfficiency: number;
  molecularWeight: number;
  hBondDonors: number;
  hBondAcceptors: number;
}

export interface DockingJob {
  id: string;
  filename: string;
  uploadDate: string;
  status: JobStatus;
  moleculeName: string;
  stats?: MoleculeStats;
  reportSummary?: string;
  txHash?: string; // Solana transaction hash
}

export type ViewState = 'DASHBOARD' | 'UPLOAD' | 'REPORT';
