import { NCRReport, Staff } from '../types';

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'นาย อนุชา นาสิงห์คาน (MT)', role: 'reporter', department: 'เคมีคลินิก' },
  { id: '2', name: 'น.ส.สิราภา ดอนประสิทธิ์ (MT)', role: 'reporter', department: 'โลหิตวิทยา' },
  { id: '3', name: 'น.ส.ชลลดา สุขใส (MT)', role: 'reporter', department: 'จุลชีววิทยา' },
  { id: '4', name: 'นายเกียรติศักดิ์ พูนศิลป์ (MT)', role: 'reporter', department: 'ธนาคารเลือด' },
  { id: '5', name: 'นายสมชาย รัตน์', role: 'sectionHead', department: 'เคมีคลินิก' },
  { id: '6', name: 'น.ส.อรัญญา พงษ์ไพโรจน์', role: 'sectionHead', department: 'โลหิตวิทยา' },
  { id: '7', name: 'นายอนันต์ มีชัย', role: 'sectionHead', department: 'จุลชีววิทยา' },
  { id: '8', name: 'น.ส.กนกวรรณ สุขใจ', role: 'qm' },
  { id: '9', name: 'นายสิรวิชญ์ เมธาพาณิชย์', role: 'qm' }
];

export const INITIAL_REPORTS: NCRReport[] = [
  {
    id: 'NCR-2026-0001',
    date: '2026-06-25',
    time: '08:15',
    reporter: 'น.ส.สมหญิง ใจดี (MT)',
    sections: ['เคมีคลินิก'],
    process: 'Analytical',
    eventTypes: ['QC / IQC Failure'],
    description: 'ระหว่างการตรวจสอบ Internal Quality Control ประจำวัน เวลา 08.15 น. พบว่า QC Glucose Level 2 มีค่ามากกว่า +3SD จำนวน 2 ครั้งติดต่อกัน ระบบเครื่องวิเคราะห์ Alinity c แจ้งเตือน Out of Control จึงหยุดการรายงานผลผู้ป่วยทันที และแจ้งหัวหน้าหน่วยงานเพื่อดำเนินการตรวจสอบ',
    immediateCorrections: ['Stop Reporting', 'Stop Testing', 'Re-run QC', 'Notify Supervisor'],
    immediateDetail: 'หยุดการรายงานผลผู้ป่วยทั้งหมด ทำการตรวจ QC ซ้ำ เปลี่ยน Reagent Lot ใหม่ และทำการ Calibration เครื่องวิเคราะห์ใหม่ก่อนเริ่มตรวจวิเคราะห์รอบถัดไป',
    patientImpact: 'อาจมี',
    patientCount: 12,
    specimenCount: 12,
    recallResult: 'ไม่ใช่',
    notifyPhysician: 'ไม่ใช่',
    severity: 'High',
    occurrence: 'Occasional',
    detectability: 'Easy',
    riskScore: 6, // Severity 3 * Occurrence 2 * Detectability 1 (since it's Easy) -> Wait, let's map: S=3, O=2, D=1 => Score 6 (Moderate)
    riskLevel: 'Moderate',
    analysisMethods: ['5 Why', 'Fishbone Diagram'],
    rootCause: 'พบว่า Reagent Lot ใหม่มีค่า Calibration Drift ทำให้ QC Level 2 ไม่ผ่านเกณฑ์ หลังจากเปลี่ยน Reagent Lot และทำ Calibration ใหม่ ค่า QC กลับเข้าสู่เกณฑ์ปกติ',
    contributingFactors: ['Machine', 'Material', 'Method'],
    decision: 'เปิด CAPA',
    capaId: 'CAPA-2026-001',
    decisionReason: 'เป็นเหตุการณ์ที่มีผลกระทบต่อกระบวนการตรวจวิเคราะห์และอาจกระทบผลตรวจผู้ป่วย หากเกิดซ้ำจำเป็นต้องดำเนินการแก้ไขที่สาเหตุราก',
    actionPlans: [
      { id: '1', action: 'เปลี่ยน Reagent Lot และทำ Validation', responsible: 'หัวหน้าเคมีคลินิก', dueDate: '2026-06-25', status: 'เสร็จสิ้น' },
      { id: '2', action: 'ทำ Calibration เครื่อง Alinity c ใหม่', responsible: 'น.ส.สมหญิง ใจดี (MT)', dueDate: '2026-06-25', status: 'เสร็จสิ้น' },
      { id: '3', action: 'ทบทวน SOP Lot Verification และเพิ่มความถี่ QC', responsible: 'Quality Manager', dueDate: '2026-06-30', status: 'กำลังดำเนินการ' },
      { id: '4', action: 'อบรมเจ้าหน้าที่เรื่องการแก้ไข QC Out of Control', responsible: 'Technical Manager', dueDate: '2026-07-05', status: 'รอดำเนินการ' }
    ],
    effectiveness: 'Effective',
    effectivenessDetail: 'ติดตามผล QC ต่อเนื่อง 30 วัน ไม่พบค่า QC Fail ซ้ำ ค่า Mean และ SD อยู่ในเกณฑ์ที่กำหนดอย่างดี ไม่พบการแจ้งเตือนผิดปกติ',
    signatures: {
      reporter: { name: 'น.ส.สมหญิง ใจดี (MT)', date: '2026-06-25', signed: true },
      sectionHead: { name: 'นายสมชาย รัตน์', date: '2026-06-25', signed: true },
      qm: { name: 'น.ส.กนกวรรณ สุขใจ', date: '2026-06-25', signed: true }
    },
    createdAt: '2026-06-25T08:30:00Z',
    updatedAt: '2026-06-25T11:00:00Z'
  },
  {
    id: 'NCR-2026-0002',
    date: '2026-06-23',
    time: '14:20',
    reporter: 'นายธนพล มั่งมี (MT)',
    sections: ['โลหิตวิทยา'],
    process: 'Pre-Analytical',
    eventTypes: ['Patient Identification', 'Specimen Problem'],
    description: 'พบสิ่งส่งตรวจด่วน CBC จากตึกกุมารเวชกรรม ติดป้ายชื่อสลับกันระหว่างผู้ป่วย 2 รายในใบสั่งตรวจเดียวกัน แต่ติดสติกเกอร์บาร์โค้ดสลับตึกและชื่อคนไข้ เจ้าหน้าที่ตรวจพบก่อนรายงานผล จึงระงับการออกรายงานและขอให้พยาบาลเจาะสิ่งส่งตรวจใหม่เพื่อความถูกต้อง',
    immediateCorrections: ['Stop Reporting', 'Reject Specimen', 'Notify Physician', 'Notify Supervisor'],
    immediateDetail: 'ระงับสิ่งส่งตรวจและประสานงานพยาบาลประจำตึกกุมารเวชกรรมทันที แจ้งเหตุสลับหลอดเลือด ขอให้เจาะเลือดและติดป้ายชื่อใหม่เพื่อความปลอดภัยสูงสุด',
    patientImpact: 'มี',
    patientCount: 2,
    specimenCount: 2,
    recallResult: 'ไม่ใช่',
    notifyPhysician: 'ใช่',
    severity: 'Critical',
    occurrence: 'Rare',
    detectability: 'Easy',
    riskScore: 4, // S=4, O=1, D=1 => Score 4 (Moderate)
    riskLevel: 'Moderate',
    analysisMethods: ['Process Analysis'],
    rootCause: 'พยาบาลผู้รับคำสั่งตรวจระบุข้อมูลคนไข้ 2 รายพร้อมกัน และจัดเตรียมหลอดเลือดพร้อมกันบนโต๊ะทำงานเดียว ทำให้เกิดความคลาดเคลื่อนในการแปะบาร์โค้ดสติกเกอร์',
    contributingFactors: ['Human', 'Method'],
    decision: 'เปิด CAPA',
    capaId: 'CAPA-2026-002',
    decisionReason: 'ความคลาดเคลื่อนในการระบุตัวตนผู้ป่วย (Patient Identification) ถือเป็นความเสี่ยงทางห้องปฏิบัติการระดับวิกฤต ต้องมีการควบคุมและตักเตือนพยาบาลตึก',
    actionPlans: [
      { id: '1', action: 'ประสานงานแจ้งหัวหน้าตึกพยาบาลกุมารเวชกรรม', responsible: 'น.ส.อรัญญา พงษ์ไพโรจน์', dueDate: '2026-06-23', status: 'เสร็จสิ้น' },
      { id: '2', action: 'จัดทำระบบสองขั้นตอนตรวจสอบตัวตนก่อนสแกนรับ', responsible: 'นายธนพล มั่งมี (MT)', dueDate: '2026-06-26', status: 'เสร็จสิ้น' },
      { id: '3', action: 'ประชุมร่วมพยาบาลตึกเพื่อทบทวนแนวทาง Patient Identification', responsible: 'Quality Manager', dueDate: '2026-07-10', status: 'รอดำเนินการ' }
    ],
    effectiveness: 'Continue Monitoring',
    effectivenessDetail: 'อยู่ระหว่างเฝ้าระวังอัตราสลับหลอดเลือดในตึกพยาบาลกุมารเวชกรรมอย่างน้อย 3 เดือน',
    signatures: {
      reporter: { name: 'นายธนพล มั่งมี (MT)', date: '2026-06-23', signed: true },
      sectionHead: { name: 'น.ส.อรัญญา พงษ์ไพโรจน์', date: '2026-06-23', signed: true },
      qm: { name: 'นายสิรวิชญ์ เมธาพาณิชย์', date: '2026-06-24', signed: true }
    },
    createdAt: '2026-06-23T14:45:00Z',
    updatedAt: '2026-06-24T09:15:00Z'
  },
  {
    id: 'NCR-2026-0003',
    date: '2026-06-20',
    time: '11:10',
    reporter: 'น.ส.ชลลดา สุขใส (MT)',
    sections: ['จุลชีววิทยา'],
    process: 'Post-Analytical',
    eventTypes: ['TAT Delay'],
    description: 'พบการรายงานผลเพาะเชื้อเลือด (Blood Culture) เกินระยะเวลาที่กำหนด (Turnaround Time) เกิน 24 ชั่วโมง เนื่องจากระบบ LIS ล่ม ไม่สามารถเชื่อมต่อส่งถ่ายข้อมูลระหว่างเครื่องอ่านวิเคราะห์กับฐานข้อมูลกลางได้',
    immediateCorrections: ['Stop Reporting', 'Notify Supervisor', 'Other'],
    immediateDetail: 'ติดต่อแผนกไอทีทันทีเพื่อรีเซ็ตเซิร์ฟเวอร์ฐานข้อมูล LIS และทำการคีย์ผลแบบ Manual ชั่วคราวเพื่อส่งผลตรวจให้ตึกผู้ป่วย',
    patientImpact: 'อาจมี',
    patientCount: 5,
    specimenCount: 5,
    recallResult: 'ไม่ใช่',
    notifyPhysician: 'ใช่',
    severity: 'Medium',
    occurrence: 'Rare',
    detectability: 'Difficult',
    riskScore: 6, // S=2, O=1, D=3 => Score 6 (Moderate)
    riskLevel: 'Moderate',
    analysisMethods: ['Process Analysis', 'FMEA Review'],
    rootCause: 'ฐานข้อมูลของระบบ LIS มีพื้นที่ไม่เพียงพอสำหรับการรับทรานแซกชัน เนื่องจากไม่มีการล้าง Log แฟ้มประวัติระบบมาเป็นเวลานาน ทำให้ระบบเกิดคอขวดและหยุดการสื่อสาร',
    contributingFactors: ['Machine', 'Environment'],
    decision: 'Correction Only',
    capaId: '',
    decisionReason: 'ปัญหาได้รับการแก้ไขโดยแผนกไอทีทันที และได้ตั้งรอบการเคลียร์ Log ไฟล์อัตโนมัติแล้ว จึงไม่ต้องเปิด CAPA ระยะยาว',
    actionPlans: [],
    effectiveness: 'Effective',
    effectivenessDetail: 'ตรวจสอบผลลัพธ์ของระบบหลังไอทีดำเนินการ ไม่พบปัญหา LIS ค้างส่งผลติดต่อกัน 7 วัน',
    signatures: {
      reporter: { name: 'น.ส.ชลลดา สุขใส (MT)', date: '2026-06-20', signed: true },
      sectionHead: { name: 'นายอนันต์ มีชัย', date: '2026-06-20', signed: true },
      qm: { name: 'น.ส.กนกวรรณ สุขใจ', date: '2026-06-21', signed: true }
    },
    createdAt: '2026-06-20T11:40:00Z',
    updatedAt: '2026-06-21T08:30:00Z'
  }
];
