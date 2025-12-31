import { DockingJob, JobStatus } from './types';

export const MOCK_JOBS: DockingJob[] = [
  {
    id: 'job-101',
    filename: 'ligand_receptor_complex_4a.pdbqt',
    uploadDate: '2023-10-25 14:30',
    status: JobStatus.VERIFIED,
    moleculeName: 'Inhibitor-4A',
    stats: {
      dockingScore: -9.4,
      bindingEfficiency: 0.45,
      molecularWeight: 420.5,
      hBondDonors: 3,
      hBondAcceptors: 5
    },
    txHash: '5U3b...9k2a',
    reportSummary: 'High affinity binding observed in the active site. Key interactions with ASP-124 and HIS-55 verified.'
  },
  {
    id: 'job-102',
    filename: 'variant_b_docking.out',
    uploadDate: '2023-10-26 09:15',
    status: JobStatus.COMPLETED,
    moleculeName: 'Variant-B',
    stats: {
      dockingScore: -7.2,
      bindingEfficiency: 0.32,
      molecularWeight: 380.2,
      hBondDonors: 2,
      hBondAcceptors: 4
    },
    reportSummary: 'Moderate binding affinity. Steric clashes detected near the hydrophobic pocket.'
  },
  {
    id: 'job-103',
    filename: 'screen_batch_003.sdf',
    uploadDate: '2023-10-26 11:45',
    status: JobStatus.PROCESSING,
    moleculeName: 'Batch-003',
  }
];

export const SOLANA_EXPLORER_URL = 'https://explorer.solana.com/tx/';
