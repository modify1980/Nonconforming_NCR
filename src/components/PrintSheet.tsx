import { NCRReport } from '../types';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrintSheetProps {
  report: NCRReport;
  onBack: () => void;
}

export default function PrintSheet({ report, onBack }: PrintSheetProps) {
  const handlePrint = () => {
    window.print();
  };

  // Helper to render checkmark symbol or empty square
  const renderCheck = (checked: boolean) => {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 border border-slate-800 mr-2 text-xs font-bold bg-white text-slate-900 select-none">
        {checked ? '✓' : ' '}
      </span>
    );
  };

  // Risk values mapping
  const severityValue = report.severity === 'Low' ? 1 : report.severity === 'Medium' ? 2 : report.severity === 'High' ? 3 : report.severity === 'Critical' ? 4 : 0;
  const occurrenceValue = report.occurrence === 'Rare' ? 1 : report.occurrence === 'Occasional' ? 2 : report.occurrence === 'Frequent' ? 3 : 0;
  const detectabilityValue = report.detectability === 'Easy' ? 1 : report.detectability === 'Moderate' ? 2 : report.detectability === 'Difficult' ? 3 : 0;

  return (
    <div className="bg-slate-50 min-h-screen py-6 px-4 print:p-0 print:bg-white print:min-h-0">
      {/* Print Controls (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้ารายการ
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer text-sm font-semibold"
        >
          <Printer className="w-4 h-4" />
          พิมพ์รายงาน / บันทึก PDF (Print)
        </button>
      </div>

      {/* Main Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-lg p-6 font-sans text-xs text-slate-900 print:shadow-none print:border-none print:p-0 print:max-w-full print:text-[10px] leading-relaxed">
        
        {/* TOP HEADER BLOCK */}
        <div className="grid grid-cols-12 border border-slate-800 p-2 items-center mb-1 bg-white">
          <div className="col-span-3 flex flex-col items-center border-r border-slate-800 py-2 pr-2">
            {/* Mock Logo */}
            <div className="flex items-center gap-1.5 font-bold text-sky-800 text-base leading-none">
              <span className="p-1 bg-sky-100 rounded-lg text-lg">🧪</span>
              <div className="text-center">
                <p className="text-[9px] tracking-wide text-slate-500 font-bold">รพร.เดชอุดม</p>
                <p className="text-[10px] text-slate-800">เทคนิคการแพทย์</p>
              </div>
            </div>
          </div>
          <div className="col-span-6 text-center px-2">
            <h1 className="font-bold text-sm tracking-tight">NONCONFORMING EVENT REPORT (NCR)</h1>
            <h2 className="font-bold text-[10px] sm:text-xs mt-0.5 leading-tight">แบบฟอร์มบันทึกงานที่ไม่เป็นไปตามข้อกำหนดในห้องปฏิบัติการเทคนิคการแพทย์ รพร.เดชอุดม</h2>
            <p className="text-[9px] text-slate-600 font-semibold mt-0.5">ISO 15189:2022</p>
          </div>
          <div className="col-span-3 text-right text-[10px] pl-2 border-l border-slate-800 h-full flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-x-1 text-[9px] text-slate-600 text-left">
              <span>Revision :</span> <span className="font-medium text-right">00</span>
              <span>Effective Date :</span> <span className="font-medium text-right">25/06/2026</span>
              <span>Page :</span> <span className="font-medium text-right">1 of 1</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ข้อมูลทั่วไป (General Information) */}
        <div className="border border-slate-800 mb-1">
          <div className="bg-slate-800 text-white font-bold px-2 py-1 flex justify-between items-center text-[11px] print:text-[9px]">
            <span>1. ข้อมูลทั่วไป (General Information)</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{report.id}</span>
          </div>
          <div className="grid grid-cols-4 border-b border-slate-800 p-1.5 gap-2 items-center">
            <div>
              <span className="font-bold">NCR No. : </span>
              <span className="font-semibold text-sky-800 underline decoration-slate-300">{report.id}</span>
            </div>
            <div>
              <span className="font-bold">วันที่ (Date) : </span>
              <span>{report.date}</span>
            </div>
            <div>
              <span className="font-bold">เวลา (Time) : </span>
              <span>{report.time || '—'}</span>
            </div>
            <div>
              <span className="font-bold">ผู้รายงาน (Reported by) : </span>
              <span className="font-semibold">{report.reporter}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-12">
            {/* Section/Department Checkbox List */}
            <div className="col-span-8 p-1.5 border-r border-slate-800">
              <p className="font-bold mb-1 text-slate-700">หน่วยงาน (Section / Department) :</p>
              <div className="grid grid-cols-3 gap-y-1">
                <label className="flex items-center">{renderCheck(report.sections.includes('เคมีคลินิก'))} เคมีคลินิก</label>
                <label className="flex items-center">{renderCheck(report.sections.includes('โลหิตวิทยา'))} โลหิตวิทยา</label>
                <label className="flex items-center">{renderCheck(report.sections.includes('จุลชีววิทยา'))} จุลชีววิทยา</label>
                <label className="flex items-center">{renderCheck(report.sections.includes('ธนาคารเลือด'))} ธนาคารเลือด</label>
                <label className="flex items-center">{renderCheck(report.sections.includes('ภูมิคุ้มกันวิทยา'))} ภูมิคุ้มกันวิทยา</label>
                <label className="flex items-center">{renderCheck(report.sections.includes('กล้องจุลทรรศน์'))} จุลทรรศน์คลินิก</label>
              </div>
            </div>
            {/* Process */}
            <div className="col-span-4 p-1.5 flex flex-col justify-start">
              <p className="font-bold mb-1 text-slate-700">กระบวนการ (Process) :</p>
              <div className="flex flex-col gap-1">
                <label className="flex items-center">{renderCheck(report.process === 'Pre-Analytical')} Pre-Analytical</label>
                <label className="flex items-center">{renderCheck(report.process === 'Analytical')} Analytical</label>
                <label className="flex items-center">{renderCheck(report.process === 'Post-Analytical')} Post-Analytical</label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3: ประเภท และ รายละเอียด */}
        <div className="grid grid-cols-12 border border-slate-800 mb-1">
          {/* Section 2 (Event Types) */}
          <div className="col-span-6 border-r border-slate-800">
            <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
              2. ประเภทเหตุการณ์ (Type of Nonconforming Event)
            </div>
            <div className="p-1.5 grid grid-cols-2 gap-y-1">
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Specimen Problem'))} Specimen Problem</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Wrong Report'))} Wrong Report</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Patient Identification'))} Patient ID Error</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('TAT Delay'))} TAT Delay</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('QC / IQC Failure'))} QC/IQC Failure</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Critical Value'))} Critical Value</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('EQA / PT Failure'))} EQA/PT Failure</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('LIS / IT Error'))} LIS/IT Error</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Instrument Failure'))} Instrument Fail</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Complaint'))} Complaint</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Reagent Problem'))} Reagent Problem</label>
              <label className="flex items-center">{renderCheck(report.eventTypes.includes('Safety Incident'))} Safety Incident</label>
            </div>
          </div>
          {/* Section 3 (Description) */}
          <div className="col-span-6 bg-amber-50/10">
            <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
              3. รายละเอียดเหตุการณ์ (Description of Event)
            </div>
            <div className="p-2 h-full text-slate-800 italic leading-relaxed whitespace-pre-wrap">
              {report.description || '— ไม่ระบุรายละเอียด —'}
            </div>
          </div>
        </div>

        {/* SECTION 4 & 5: ดำเนินการทันที และ ประเมินผลกระทบ */}
        <div className="grid grid-cols-12 border border-slate-800 mb-1">
          {/* Section 4 (Immediate Correction) */}
          <div className="col-span-6 border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
                4. การดำเนินการทันที (Immediate Correction / Containment)
              </div>
              <div className="p-1.5 grid grid-cols-2 gap-y-0.5">
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Stop Reporting'))} Stop Reporting</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Corrected Report'))} Corrected Report</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Stop Testing'))} Stop Testing</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Use Backup Instrument'))} Use Backup</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Reject Specimen'))} Reject Specimen</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Notify Physician'))} Notify Physician</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Re-run QC'))} Re-run QC</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Notify Supervisor'))} Notify Supervisor</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Recalibration'))} Recalibration</label>
                <label className="flex items-center">{renderCheck(report.immediateCorrections.includes('Other'))} Other</label>
              </div>
            </div>
            <div className="p-2 border-t border-slate-300 bg-slate-50 text-[11px]">
              <span className="font-bold block text-slate-700 mb-0.5">รายละเอียดการดำเนินการ:</span>
              <p className="italic text-slate-800 whitespace-pre-wrap">{report.immediateDetail || '— ดำเนินการทันทีตามระบบที่ระบุไว้ข้างต้น —'}</p>
            </div>
          </div>
          {/* Section 5 (Impact Assessment) */}
          <div className="col-span-6 bg-slate-50/30 flex flex-col justify-between">
            <div>
              <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
                5. การประเมินผลกระทบ (Impact Assessment)
              </div>
              <div className="p-2 grid grid-cols-1 gap-2 border-b border-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold">ผลกระทบผู้ป่วย (Patient Impact) :</span>
                  <div className="flex gap-2">
                    <label className="flex items-center">{renderCheck(report.patientImpact === 'ไม่มี')} ไม่มี</label>
                    <label className="flex items-center">{renderCheck(report.patientImpact === 'อาจมี')} อาจมี</label>
                    <label className="flex items-center">{renderCheck(report.patientImpact === 'มี')} มี</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="border border-slate-300 rounded p-1 bg-white">
                    <span className="text-[9px] text-slate-500 font-medium">จำนวนผู้ป่วยได้รับผลกระทบ</span>
                    <p className="text-sm font-bold text-sky-800">{report.patientCount} ราย</p>
                  </div>
                  <div className="border border-slate-300 rounded p-1 bg-white">
                    <span className="text-[9px] text-slate-500 font-medium">จำนวนสิ่งส่งตรวจที่เกี่ยวข้อง</span>
                    <p className="text-sm font-bold text-sky-800">{report.specimenCount} ตัวอย่าง</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 grid grid-cols-1 gap-1 bg-slate-100/60">
              <div className="flex justify-between items-center">
                <span>ต้องเรียกคืนรายงานผล (Recall Report) :</span>
                <span className="font-bold text-slate-800">{report.recallResult || 'ไม่ใช่'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ต้องรายงานผลแก้ไขด่วนให้กับแพทย์ :</span>
                <span className="font-bold text-slate-800">{report.notifyPhysician || 'ไม่ใช่'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6 & 7: ความเสี่ยง และ การวิเคราะห์สาเหตุ */}
        <div className="grid grid-cols-12 border border-slate-800 mb-1">
          {/* Section 6 (Risk Assessment) */}
          <div className="col-span-5 border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
                6. การประเมินความเสี่ยง (Risk Assessment)
              </div>
              <div className="p-2 space-y-1.5">
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Severity (S) :</span>
                  <span className="font-bold text-slate-800">{report.severity || '—'} ({severityValue})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Occurrence (O) :</span>
                  <span className="font-bold text-slate-800">{report.occurrence || '—'} ({occurrenceValue})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Detectability (D) :</span>
                  <span className="font-bold text-slate-800">{report.detectability || '—'} ({detectabilityValue})</span>
                </div>
              </div>
            </div>

            {/* Risk Calculation Box */}
            <div className="p-2 border-t border-slate-300 bg-slate-100 flex items-center justify-around">
              <div className="text-center">
                <div className="font-bold text-[10px] text-slate-600">คะแนนความเสี่ยง</div>
                <div className="text-xl font-extrabold text-slate-800 leading-none">{report.riskScore || '—'}</div>
                <div className="text-[8px] text-slate-500 mt-0.5">S({severityValue}) × O({occurrenceValue}) × D({detectabilityValue})</div>
              </div>
              <div className="w-px h-10 bg-slate-300"></div>
              <div className="text-center">
                <div className="font-bold text-[10px] text-slate-600">Risk Level</div>
                <div className={`px-2.5 py-1 rounded text-xs font-bold mt-0.5 ${
                  report.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  report.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  report.riskLevel === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                  report.riskLevel === 'Extreme' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {report.riskLevel || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 (Root Cause Analysis) */}
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
                7. การวิเคราะห์สาเหตุ (Root Cause Analysis)
              </div>
              
              <div className="p-1.5 border-b border-slate-300">
                <p className="font-bold text-[9px] text-slate-600 mb-0.5">วิธีการวิเคราะห์ :</p>
                <div className="flex gap-x-3 gap-y-1 flex-wrap">
                  <label className="flex items-center">{renderCheck(report.analysisMethods.includes('5 Why'))} 5 Why</label>
                  <label className="flex items-center">{renderCheck(report.analysisMethods.includes('Fishbone Diagram'))} Fishbone</label>
                  <label className="flex items-center">{renderCheck(report.analysisMethods.includes('Process Analysis'))} Process Analysis</label>
                  <label className="flex items-center">{renderCheck(report.analysisMethods.includes('FMEA Review'))} FMEA</label>
                  <label className="flex items-center">{renderCheck(report.analysisMethods.includes('Other'))} อื่นๆ</label>
                </div>
              </div>

              <div className="p-2 h-20 text-slate-800 italic leading-relaxed whitespace-pre-wrap">
                <span className="font-bold text-[9px] text-slate-500 block not-italic">สาเหตุที่แท้จริง (Root Cause):</span>
                {report.rootCause || '— ยังไม่ได้ระบุผลการวิเคราะห์สาเหตุราก —'}
              </div>
            </div>

            <div className="p-1.5 border-t border-slate-300 bg-slate-50">
              <p className="font-bold text-[9px] text-slate-600 mb-0.5">ปัจจัยที่เกี่ยวข้อง (Contributing Factors) :</p>
              <div className="grid grid-cols-4 gap-y-0.5">
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Human'))} Human</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Machine'))} Machine</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Method'))} Method</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Material'))} Material</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Measurement'))} Measure</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Environment'))} Env</label>
                <label className="flex items-center">{renderCheck(report.contributingFactors.includes('Management'))} Manage</label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8 & 9: การตัดสินใจ และ แผนปฏิบัติการ CAPA */}
        <div className="grid grid-cols-12 border border-slate-800 mb-1">
          {/* Section 8 (Decision) */}
          <div className="col-span-4 border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
                8. การตัดสินใจ (Decision)
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                <label className="flex items-center font-semibold">
                  {renderCheck(report.decision === 'Correction Only')} Correction Only
                </label>
                <label className="flex items-center font-semibold">
                  {renderCheck(report.decision === 'เปิด CAPA')} เปิด CAPA (Open CAPA)
                </label>
                
                {report.decision === 'เปิด CAPA' && report.capaId && (
                  <div className="mt-1.5 bg-emerald-50 border border-emerald-300 rounded p-1.5">
                    <span className="font-bold text-[9px] text-emerald-800 block">CAPA No. :</span>
                    <span className="text-xs font-bold text-emerald-900">{report.capaId}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2 border-t border-slate-300 bg-slate-50 text-[10px]">
              <span className="font-bold text-slate-500 block">เหตุผลประกอบ:</span>
              <p className="italic text-slate-700 whitespace-pre-wrap">{report.decisionReason || '— ไม่ได้ระบุเหตุผลประกอบ —'}</p>
            </div>
          </div>

          {/* Section 9 (Action Plans Table) */}
          <div className="col-span-8 flex flex-col justify-start bg-white">
            <div className="bg-slate-700 text-white font-bold px-2 py-0.5 text-[10px]">
              9. แผนป้องกันและแก้ไขระยะยาว (Corrective / Preventive Action Plan)
            </div>
            <div className="p-1 max-h-48 overflow-auto">
              <table className="w-full text-left border-collapse text-[9px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 font-bold">
                    <th className="p-1 w-1/2">Action (มาตรการปฏิบัติการ)</th>
                    <th className="p-1">ผู้รับผิดชอบ</th>
                    <th className="p-1 text-center">กำหนดเสร็จ</th>
                    <th className="p-1 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {report.actionPlans && report.actionPlans.length > 0 ? (
                    report.actionPlans.map((plan) => (
                      <tr key={plan.id} className="border-b border-slate-200">
                        <td className="p-1 text-slate-800 leading-tight whitespace-pre-wrap">{plan.action}</td>
                        <td className="p-1 font-medium">{plan.responsible || '—'}</td>
                        <td className="p-1 text-center text-slate-500">{plan.dueDate || '—'}</td>
                        <td className="p-1 text-center">
                          <span className={`px-1 rounded-[3px] text-[8px] font-bold ${
                            plan.status === 'เสร็จสิ้น' ? 'bg-emerald-100 text-emerald-800' :
                            plan.status === 'กำลังดำเนินการ' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-slate-400 italic">
                        ไม่มีการเปิดแผนปฏิบัติการระยะยาว (Correction Only)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 10: ปิดเรื่องและการติดตามผล */}
        <div className="border border-slate-800 mb-1.5 bg-slate-50/10">
          <div className="bg-slate-800 text-white font-bold px-2 py-0.5 text-[11px] print:text-[9px]">
            10. การติดตามประสิทธิผลและการปิดเรื่อง (Effectiveness Check & Closure)
          </div>
          <div className="grid grid-cols-12 p-2 gap-4">
            <div className="col-span-5 border-r border-slate-300 pr-4 flex flex-col justify-start">
              <span className="font-bold text-slate-700 block mb-1">ผลการติดตามประสิทธิผล :</span>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center font-semibold text-emerald-800">
                  {renderCheck(report.effectiveness === 'Effective')} Effective (มีประสิทธิผล สมควรปิดเรื่อง)
                </label>
                <label className="flex items-center font-semibold text-rose-800">
                  {renderCheck(report.effectiveness === 'Not Effective')} Not Effective (ไม่มีประสิทธิผล / ทบทวนแผนใหม่)
                </label>
                <label className="flex items-center font-semibold text-sky-800">
                  {renderCheck(report.effectiveness === 'Continue Monitoring')} Continue Monitoring (เฝ้าระวังต่อเนื่อง)
                </label>
              </div>
            </div>
            <div className="col-span-7 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">รายละเอียดผลการติดตาม (Details of Monitoring):</span>
                <p className="italic text-slate-800 whitespace-pre-wrap">{report.effectivenessDetail || '— ยังไม่ได้กรอกผลการติดตามประสิทธิผล —'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="grid grid-cols-3 border border-slate-800 bg-slate-50 p-2 gap-4 text-center">
          {/* Sign 1 */}
          <div className="flex flex-col justify-between border-r border-slate-300 pr-2">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold">ผู้รายงาน (Reported by)</span>
              <div className="h-8 flex items-center justify-center font-serif text-sky-800 text-sm font-semibold select-none italic mt-1 border-b border-slate-300 border-dashed mx-4">
                {report.signatures.reporter.signed ? report.signatures.reporter.name.split(' ')[0] : '—'}
              </div>
            </div>
            <div className="text-[9px] text-slate-600 mt-1">
              <p>ลงนาม : <span className="font-semibold text-slate-800">{report.signatures.reporter.signed ? report.signatures.reporter.name : '—'}</span></p>
              <p>วันที่ : <span>{report.signatures.reporter.signed ? report.signatures.reporter.date : '—'}</span></p>
            </div>
          </div>

          {/* Sign 2 */}
          <div className="flex flex-col justify-between border-r border-slate-300 px-2">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold">หัวหน้าหน่วย (Section Head)</span>
              <div className="h-8 flex items-center justify-center font-serif text-sky-800 text-sm font-semibold select-none italic mt-1 border-b border-slate-300 border-dashed mx-4">
                {report.signatures.sectionHead.signed ? report.signatures.sectionHead.name.split(' ')[0] : '—'}
              </div>
            </div>
            <div className="text-[9px] text-slate-600 mt-1">
              <p>ลงนาม : <span className="font-semibold text-slate-800">{report.signatures.sectionHead.signed ? report.signatures.sectionHead.name : '—'}</span></p>
              <p>วันที่ : <span>{report.signatures.sectionHead.signed ? report.signatures.sectionHead.date : '—'}</span></p>
            </div>
          </div>

          {/* Sign 3 */}
          <div className="flex flex-col justify-between pl-2">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold">Quality Manager (QM)</span>
              <div className="h-8 flex items-center justify-center font-serif text-sky-800 text-sm font-semibold select-none italic mt-1 border-b border-slate-300 border-dashed mx-4">
                {report.signatures.qm.signed ? report.signatures.qm.name.split(' ')[0] : '—'}
              </div>
            </div>
            <div className="text-[9px] text-slate-600 mt-1">
              <p>ลงนาม : <span className="font-semibold text-slate-800">{report.signatures.qm.signed ? report.signatures.qm.name : '—'}</span></p>
              <p>วันที่ : <span>{report.signatures.qm.signed ? report.signatures.qm.date : '—'}</span></p>
            </div>
          </div>
        </div>

        {/* Regulatory Note */}
        <div className="mt-3 text-[9px] text-slate-500 flex justify-between items-center italic">
          <span>* โปรดรายงานเหตุการณ์ทันทีที่พบ และดำเนินการสอดคล้องกับคู่มือคุณภาพและ SOP ที่เกี่ยวข้อง</span>
          <span>Rev.00</span>
        </div>
      </div>
    </div>
  );
}
