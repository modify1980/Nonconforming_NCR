import { NCRReport } from '../types';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, TrendingUp } from 'lucide-react';

interface DashboardProps {
  reports: NCRReport[];
}

export default function Dashboard({ reports }: DashboardProps) {
  // 1. Calculations
  const totalNCRs = reports.length;
  
  const openCapas = reports.filter(r => 
    r.decision === 'เปิด CAPA' && 
    (r.actionPlans.length === 0 || r.actionPlans.some(p => p.status !== 'เสร็จสิ้น'))
  ).length;

  const highOrExtremeRisk = reports.filter(r => 
    r.riskLevel === 'High' || r.riskLevel === 'Extreme'
  ).length;

  const effectiveClosures = reports.filter(r => 
    r.effectiveness === 'Effective'
  ).length;

  // 2. Section counts
  const sections = ['เคมีคลินิก', 'โลหิตวิทยา', 'จุลชีววิทยา', 'ธนาคารเลือด', 'ภูมิคุ้มกันวิทยา', 'กล้องจุลทรรศน์'];
  const sectionCounts = sections.reduce((acc, sec) => {
    acc[sec] = reports.filter(r => r.sections.includes(sec)).length;
    return acc;
  }, {} as Record<string, number>);

  const maxSectionCount = Math.max(...Object.values(sectionCounts), 1);

  // 3. Process counts
  const processes = ['Pre-Analytical', 'Analytical', 'Post-Analytical'];
  const processCounts = processes.reduce((acc, proc) => {
    acc[proc] = reports.filter(r => r.process === proc).length;
    return acc;
  }, {} as Record<string, number>);

  const totalProcessAssigned = Object.values(processCounts).reduce((sum, c) => sum + c, 0) || 1;

  // 4. Risk Level counts
  const riskLevels = ['Low', 'Moderate', 'High', 'Extreme'];
  const riskColors = {
    Low: 'bg-emerald-500',
    Moderate: 'bg-amber-500',
    High: 'bg-orange-500',
    Extreme: 'bg-rose-500'
  };
  const riskCounts = riskLevels.reduce((acc, lvl) => {
    acc[lvl] = reports.filter(r => r.riskLevel === lvl).length;
    return acc;
  }, {} as Record<string, number>);

  // 5. Event Type counts
  const eventTypes = [
    'Specimen Problem', 'Wrong Report', 'Patient Identification', 
    'TAT Delay', 'QC / IQC Failure', 'Critical Value', 
    'EQA / PT Failure', 'LIS / IT Error', 'Instrument Failure', 
    'Complaint', 'Reagent Problem', 'Safety Incident'
  ];
  const eventCounts = eventTypes.reduce((acc, type) => {
    acc[type] = reports.filter(r => r.eventTypes.includes(type)).length;
    return acc;
  }, {} as Record<string, number>);

  const sortedEventCounts = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxEventCount = Math.max(...sortedEventCounts.map(e => e[1]), 1);

  return (
    <div className="space-y-6">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">รายงาน NCR ทั้งหมด</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{totalNCRs}</h3>
            <p className="text-[11px] text-slate-500 font-medium">ฉบับบันทึกในห้องแล็บ</p>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Open CAPAs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ใบงานเปิด CAPA ค้าง</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{openCapas}</h3>
            <p className="text-[11px] text-amber-600 font-medium">รอปิดแผนแก้ไข/ป้องกัน</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: High/Extreme Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ความเสี่ยงสูง - วิกฤต</p>
            <h3 className="text-3xl font-extrabold text-rose-600">{highOrExtremeRisk}</h3>
            <p className="text-[11px] text-rose-500 font-medium">เหตุการณ์ระดับเฝ้าระวังด่วน</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Effective Closures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">มีประสิทธิผล (Effective)</p>
            <h3 className="text-3xl font-extrabold text-emerald-600">{effectiveClosures}</h3>
            <p className="text-[11px] text-emerald-500 font-medium">ติดตามผลแล้วใช้งานได้ผลจริง</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Section Counts (Bar Chart) & Risk Distribution */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Bar Chart of Incidents by Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-slate-800 text-base">สถิติรายงานแยกตามหน่วยงาน (Section)</h4>
                <p className="text-xs text-slate-500">จำนวนเคสที่บันทึกแยกตามแผนกแล็บ</p>
              </div>
            </div>

            {/* Custom Bar Chart (SVG & Divs) */}
            <div className="space-y-4 pt-2">
              {sections.map(sec => {
                const count = sectionCounts[sec] || 0;
                const percentage = (count / maxSectionCount) * 100;
                return (
                  <div key={sec} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{sec}</span>
                      <span className="text-slate-900 font-bold">{count} รายการ</span>
                    </div>
                    <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                      <div
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                        className={`h-full transition-all duration-500 rounded-full flex items-center justify-end pr-2 font-mono text-[10px] font-bold text-white ${
                          count > 0 ? 'bg-sky-600' : 'bg-slate-300'
                        }`}
                      >
                        {count > 0 && `${Math.round(percentage)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Process Stages Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm">
            <h4 className="font-bold text-slate-800 text-base mb-4">การจำแนกตามกระบวนการ (Process Stages)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {processes.map(proc => {
                const count = processCounts[proc] || 0;
                const pct = Math.round((count / totalProcessAssigned) * 100);
                return (
                  <div key={proc} className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase">{proc}</span>
                      <h5 className="text-2xl font-extrabold text-slate-800 mt-1">{count} <span className="text-xs font-medium text-slate-500">เคส</span></h5>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${
                            proc === 'Pre-Analytical' ? 'bg-indigo-500' :
                            proc === 'Analytical' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1.5 block font-bold text-right">{pct}% ของสิ่งส่งตรวจทั้งหมด</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Event Types & Risk Levels */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 1: Top Event Types */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-base mb-1">ประเภทเหตุการณ์ยอดนิยม</h4>
              <p className="text-xs text-slate-500 mb-4">หัวข้อปัญหาที่พบบ่อยที่สุด 6 อันดับแรก</p>
              
              <div className="space-y-3.5">
                {sortedEventCounts.map(([type, count]) => {
                  const percentage = (count / maxEventCount) * 100;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span className="truncate max-w-[200px]">{type}</span>
                        <span className="font-bold text-slate-900">{count} เคส</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="h-full bg-teal-500 rounded-full"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Risk Levels Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/85 shadow-sm">
            <h4 className="font-bold text-slate-800 text-base mb-1">การประเมินระดับความเสี่ยง</h4>
            <p className="text-xs text-slate-500 mb-4">จำแนกตามคะแนนความเสี่ยงวิกฤต (S x O x D)</p>

            <div className="space-y-3">
              {riskLevels.map(lvl => {
                const count = riskCounts[lvl] || 0;
                const total = totalNCRs || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={lvl} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-3 h-3 rounded-full ${riskColors[lvl as keyof typeof riskColors]}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{lvl} Risk</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full rounded-full ${riskColors[lvl as keyof typeof riskColors]}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer box */}
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl mt-4 flex gap-2.5 items-start">
              <span className="text-base">ℹ️</span>
              <p className="text-[10px] leading-relaxed text-indigo-700 font-medium">
                ระดับความเสี่ยงคำนวณตามมาตรฐาน ISO 15189:2022 หากระดับความเสี่ยงเป็น <strong>High</strong> หรือ <strong>Extreme</strong> จะต้องบังคับกรอกแผนปฏิบัติการแก้ไข (CAPA) ในแบบฟอร์มบันทึกทันที
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
