import { useState } from 'react';
import { NCRReport } from '../types';
import { Download, Edit2, Eye, FileSpreadsheet, Search, Trash2 } from 'lucide-react';

interface RecordsListProps {
  reports: NCRReport[];
  onViewReport: (report: NCRReport) => void;
  onEditReport: (report: NCRReport) => void;
  onDeleteReport: (id: string) => void;
}

export default function RecordsList({ reports, onViewReport, onEditReport, onDeleteReport }: RecordsListProps) {
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterProcess, setFilterProcess] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterDecision, setFilterDecision] = useState('');

  // Dropdown Lists
  const sections = ['เคมีคลินิก', 'โลหิตวิทยา', 'จุลชีววิทยา', 'ธนาคารเลือด', 'ภูมิคุ้มกันวิทยา', 'กล้องจุลทรรศน์'];
  const processes = ['Pre-Analytical', 'Analytical', 'Post-Analytical'];
  const riskLevels = ['Low', 'Moderate', 'High', 'Extreme'];

  // Filtered Reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rootCause.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection = filterSection ? r.sections.includes(filterSection) : true;
    const matchesProcess = filterProcess ? r.process === filterProcess : true;
    const matchesRisk = filterRisk ? r.riskLevel === filterRisk : true;
    const matchesDecision = filterDecision ? r.decision === filterDecision : true;

    return matchesSearch && matchesSection && matchesProcess && matchesRisk && matchesDecision;
  });

  // Export to CSV helper
  const exportToCSV = () => {
    if (reports.length === 0) return;
    
    const headers = [
      'NCR ID', 'Date', 'Time', 'Reporter', 'Sections', 'Process Stage', 
      'Event Types', 'Description', 'Immediate Corrections', 'Immediate Detail', 
      'Patient Impact', 'Patient Count', 'Specimen Count', 'Recall Report', 'Notify Physician', 
      'Risk Score', 'Risk Level', 'Root Cause', 'CAPA Decision', 'CAPA ID', 'Effectiveness'
    ];

    const rows = reports.map(r => [
      r.id,
      r.date,
      r.time,
      `"${r.reporter.replace(/"/g, '""')}"`,
      `"${r.sections.join(', ')}"`,
      r.process,
      `"${r.eventTypes.join(', ')}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${r.immediateCorrections.join(', ')}"`,
      `"${r.immediateDetail.replace(/"/g, '""')}"`,
      r.patientImpact,
      r.patientCount,
      r.specimenCount,
      r.recallResult,
      r.notifyPhysician,
      r.riskScore,
      r.riskLevel,
      `"${r.rootCause.replace(/"/g, '""')}"`,
      r.decision,
      r.capaId || 'N/A',
      r.effectiveness || 'N/A'
    ]);

    const csvContent = [
      '\uFEFF' + headers.join(','), // Add BOM for excel Thai characters support
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NCR_Reports_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตามเลข NCR, รายละเอียด, ผู้รายงาน, หรือสาเหตุ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
            />
          </div>

          {/* Export and Action button */}
          <button
            onClick={exportToCSV}
            disabled={reports.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            ส่งออกไฟล์ CSV (Excel)
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Filter Section */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">หน่วยงาน (Section)</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-sans"
            >
              <option value="">ทั้งหมด (All)</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Filter Process */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ขั้นตอนกระบวนการ</label>
            <select
              value={filterProcess}
              onChange={(e) => setFilterProcess(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-sans"
            >
              <option value="">ทั้งหมด (All)</option>
              {processes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Filter Risk */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ระดับความเสี่ยง</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-sans"
            >
              <option value="">ทั้งหมด (All)</option>
              {riskLevels.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Filter Decision */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">การดำเนินมาตรการ</label>
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-sans"
            >
              <option value="">ทั้งหมด (All)</option>
              <option value="เปิด CAPA">เปิด CAPA เท่านั้น</option>
              <option value="Correction Only">แก้ไขเฉพาะหน้า (Correction Only)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs">
                <th className="p-4 w-28">เลขที่ NCR</th>
                <th className="p-4 w-32">วันที่รายงาน</th>
                <th className="p-4 w-40">หน่วยงาน / แผนก</th>
                <th className="p-4">รายละเอียดปัญหา</th>
                <th className="p-4 w-28 text-center">ระดับความเสี่ยง</th>
                <th className="p-4 w-32 text-center">มาตรการแก้ไข</th>
                <th className="p-4 w-28 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                    
                    {/* NCR ID */}
                    <td className="p-4 font-bold text-sky-800 text-sm">
                      {report.id}
                    </td>

                    {/* Date / Reporter */}
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{report.date}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{report.time || '—'} · {report.reporter.split(' ')[0]}</div>
                    </td>

                    {/* Section */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {report.sections.map(sec => (
                          <span key={sec} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-medium text-[10px]">
                            {sec}
                          </span>
                        ))}
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">{report.process}</div>
                    </td>

                    {/* Problem Description */}
                    <td className="p-4 max-w-xs md:max-w-md">
                      <p className="line-clamp-2 leading-relaxed text-slate-600 font-medium">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.eventTypes.map(type => (
                          <span key={type} className="text-[9px] text-indigo-600 bg-indigo-50 px-1 border border-indigo-100 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        report.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        report.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        report.riskLevel === 'High' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {report.riskLevel}
                      </span>
                    </td>

                    {/* Decision / Status */}
                    <td className="p-4 text-center">
                      {report.decision === 'เปิด CAPA' ? (
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded font-bold text-[9px]">
                            เปิด CAPA ({report.capaId})
                          </span>
                          <div className="text-[8px] text-slate-400">
                            {report.actionPlans.filter(p => p.status === 'เสร็จสิ้น').length} / {report.actionPlans.length} แผนเสร็จสิ้น
                          </div>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-semibold text-[9px]">
                          Correction Only
                        </span>
                      )}
                    </td>

                    {/* Actions Panel */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        {/* Eye Print Sheet Icon */}
                        <button
                          onClick={() => onViewReport(report)}
                          title="ดูแบบฟอร์ม / สั่งพิมพ์"
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Icon */}
                        <button
                          onClick={() => onEditReport(report)}
                          title="แก้ไขรายงานนี้"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Icon */}
                        <button
                          onClick={() => {
                            if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบใบรายงาน ${report.id}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          title="ลบรายงานนี้"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic font-medium">
                    ไม่พบข้อมูลรายงาน NCR ที่สอดคล้องกับการค้นหาหรือตัวกรอง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
