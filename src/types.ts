export interface ActionPlan {
  id: string;
  action: string;
  responsible: string;
  dueDate: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'เสร็จสิ้น';
}

export interface Signature {
  role: string;
  level: 'ผู้รายงาน' | 'หัวหน้าหน่วย' | 'Quality Manager';
  name: string;
  date: string;
  signed: boolean;
}

export interface NCRReport {
  id: string; // e.g. NCR-2026-0001
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reporter: string;
  sections: string[]; // e.g. ["เคมีคลินิก", "โลหิตวิทยา"]
  process: 'Pre-Analytical' | 'Analytical' | 'Post-Analytical' | '';
  
  // Step 2
  eventTypes: string[]; // e.g. ["Specimen Problem", "TAT Delay"]
  description: string;

  // Step 3
  immediateCorrections: string[];
  immediateDetail: string;

  // Step 4
  patientImpact: 'ไม่มี' | 'อาจมี' | 'มี' | '';
  patientCount: number;
  specimenCount: number;
  recallResult: 'ใช่' | 'ไม่ใช่' | '';
  notifyPhysician: 'ใช่' | 'ไม่ใช่' | '';
  
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | '';
  occurrence: 'Rare' | 'Occasional' | 'Frequent' | '';
  detectability: 'Easy' | 'Moderate' | 'Difficult' | '';
  riskScore: number; // calculated S * O * D
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' | '';

  // Step 5
  analysisMethods: string[]; // e.g. ["5 Why", "Fishbone Diagram"]
  rootCause: string;
  contributingFactors: string[]; // e.g. ["Human", "Machine"]

  // Step 6
  decision: 'Correction Only' | 'เปิด CAPA' | '';
  capaId: string; // e.g. CAPA-2026-0001
  decisionReason: string;
  actionPlans: ActionPlan[];

  // Step 7
  effectiveness: 'Effective' | 'Not Effective' | 'Continue Monitoring' | '';
  effectivenessDetail: string;
  
  signatures: {
    reporter: { name: string; date: string; signed: boolean };
    sectionHead: { name: string; date: string; signed: boolean };
    qm: { name: string; date: string; signed: boolean };
  };

  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'reporter' | 'sectionHead' | 'qm';
  department?: string;
}
