import { useState, useEffect } from 'react';
import { NCRReport, ActionPlan } from '../types';
import { INITIAL_STAFF } from '../data/initialData';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';

interface ReportFormProps {
  existingReport?: NCRReport | null;
  reports: NCRReport[];
  onSave: (report: NCRReport) => void;
  onCancel: () => void;
}

export default function ReportForm({ existingReport, reports, onSave, onCancel }: ReportFormProps) {
  // Current active step index (0-based)
  const [activeStep, setActiveStep] = useState(0);

  // Custom states for Other Section and Custom Reporter editing
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [isCustomReporter, setIsCustomReporter] = useState(false);

  // Default standard sections
  const defaultSections = ['เคมีคลินิก', 'โลหิตวิทยา', 'จุลชีววิทยา', 'ธนาคารเลือด', 'ภูมิคุ้มกันวิทยา', 'กล้องจุลทรรศน์'];

  // Initial form values from existingReport or standard defaults
  const [formData, setFormData] = useState<Omit<NCRReport, 'id' | 'createdAt' | 'updatedAt' | 'capaId' | 'riskScore' | 'riskLevel'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    reporter: '',
    sections: [],
    process: 'Analytical',
    eventTypes: [],
    description: '',
    immediateCorrections: [],
    immediateDetail: '',
    patientImpact: 'อาจมี',
    patientCount: 0,
    specimenCount: 0,
    recallResult: 'ไม่ใช่',
    notifyPhysician: 'ไม่ใช่',
    severity: '',
    occurrence: '',
    detectability: '',
    analysisMethods: [],
    rootCause: '',
    contributingFactors: [],
    decision: 'เปิด CAPA',
    decisionReason: '',
    actionPlans: [],
    effectiveness: 'Effective',
    effectivenessDetail: '',
    signatures: {
      reporter: { name: '', date: new Date().toISOString().split('T')[0], signed: false },
      sectionHead: { name: '', date: new Date().toISOString().split('T')[0], signed: false },
      qm: { name: '', date: new Date().toISOString().split('T')[0], signed: false }
    }
  });

  // Unique generated IDs
  const [ncrId, setNcrId] = useState('');
  const [capaId, setCapaId] = useState('');

  // Inline Validation alerts
  const [validationError, setValidationError] = useState('');

  // Populate data if editing
  useEffect(() => {
    if (existingReport) {
      setNcrId(existingReport.id);
      setCapaId(existingReport.capaId);

      // Determine if custom reporter
      const reporters = INITIAL_STAFF.filter(s => s.role === 'reporter');
      const isPredefined = reporters.some(r => r.name === existingReport.reporter);
      setIsCustomReporter(!isPredefined && existingReport.reporter !== '');

      // Determine if custom section exists
      const foundCustom = existingReport.sections.find(sec => !defaultSections.includes(sec));
      if (foundCustom) {
        setCustomSectionInput(foundCustom);
      } else {
        setCustomSectionInput('');
      }

      setFormData({
        date: existingReport.date,
        time: existingReport.time,
        reporter: existingReport.reporter,
        sections: existingReport.sections,
        process: existingReport.process,
        eventTypes: existingReport.eventTypes,
        description: existingReport.description,
        immediateCorrections: existingReport.immediateCorrections,
        immediateDetail: existingReport.immediateDetail,
        patientImpact: existingReport.patientImpact,
        patientCount: existingReport.patientCount,
        specimenCount: existingReport.specimenCount,
        recallResult: existingReport.recallResult,
        notifyPhysician: existingReport.notifyPhysician,
        severity: existingReport.severity,
        occurrence: existingReport.occurrence,
        detectability: existingReport.detectability,
        analysisMethods: existingReport.analysisMethods,
        rootCause: existingReport.rootCause,
        contributingFactors: existingReport.contributingFactors,
        decision: existingReport.decision,
        decisionReason: existingReport.decisionReason,
        actionPlans: [...existingReport.actionPlans],
        effectiveness: existingReport.effectiveness,
        effectivenessDetail: existingReport.effectivenessDetail,
        signatures: { ...existingReport.signatures }
      });
    } else {
      // Find the next sequence number automatically based on existing reports
      let nextNum = 1;
      if (reports && reports.length > 0) {
        const numbers = reports.map(r => {
          const match = r.id.match(/NCR-\d{4}-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        const maxNum = Math.max(...numbers, 0);
        nextNum = maxNum + 1;
      }
      const currentYear = new Date().getFullYear();
      const formattedSeq = String(nextNum).padStart(4, '0');
      setNcrId(`NCR-${currentYear}-${formattedSeq}`);
      setCapaId(`CAPA-${currentYear}-${formattedSeq}`);
      setIsCustomReporter(false);
      setCustomSectionInput('');
    }
  }, [existingReport]);

  // Handle generic state updates
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setValidationError('');
  };

  const updateSignature = (role: 'reporter' | 'sectionHead' | 'qm', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [role]: { ...prev.signatures[role], [field]: value }
      }
    }));
  };

  // Checkbox multi-select helpers
  const toggleCheckbox = (listKey: 'sections' | 'eventTypes' | 'immediateCorrections' | 'analysisMethods' | 'contributingFactors', value: string) => {
    const list = formData[listKey] as string[];
    const newList = list.includes(value) 
      ? list.filter(item => item !== value)
      : [...list, value];
    updateField(listKey, newList);
  };

  const hasCustomSection = formData.sections.some(sec => !defaultSections.includes(sec));

  const toggleCustomSection = () => {
    if (hasCustomSection) {
      const newList = formData.sections.filter(sec => defaultSections.includes(sec));
      updateField('sections', newList);
    } else {
      const valToAdd = customSectionInput.trim() || 'อื่นๆ';
      updateField('sections', [...formData.sections, valToAdd]);
    }
  };

  const handleCustomSectionChange = (val: string) => {
    setCustomSectionInput(val);
    const cleanedVal = val.trim() || 'อื่นๆ';
    const baseSections = formData.sections.filter(sec => defaultSections.includes(sec));
    updateField('sections', [...baseSections, cleanedVal]);
  };

  // Dynamic Risk calculations
  const severityValue = formData.severity === 'Low' ? 1 : formData.severity === 'Medium' ? 2 : formData.severity === 'High' ? 3 : formData.severity === 'Critical' ? 4 : 0;
  const occurrenceValue = formData.occurrence === 'Rare' ? 1 : formData.occurrence === 'Occasional' ? 2 : formData.occurrence === 'Frequent' ? 3 : 0;
  const detectabilityValue = formData.detectability === 'Easy' ? 1 : formData.detectability === 'Moderate' ? 2 : formData.detectability === 'Difficult' ? 3 : 0;

  const riskScore = severityValue * occurrenceValue * detectabilityValue;

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' | '' = '';
  if (riskScore > 0) {
    if (riskScore <= 3) riskLevel = 'Low';
    else if (riskScore <= 6) riskLevel = 'Moderate';
    else if (riskScore <= 9) riskLevel = 'High';
    else riskLevel = 'Extreme';
  }

  // Force Opening CAPA if Risk level is High or Extreme
  useEffect(() => {
    if (riskLevel === 'High' || riskLevel === 'Extreme') {
      if (formData.decision !== 'เปิด CAPA') {
        updateField('decision', 'เปิด CAPA');
      }
    }
  }, [riskLevel]);

  // Action Plan manager
  const addActionPlanRow = () => {
    const newPlan: ActionPlan = {
      id: Math.random().toString(36).substr(2, 9),
      action: '',
      responsible: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'รอดำเนินการ'
    };
    updateField('actionPlans', [...formData.actionPlans, newPlan]);
  };

  const removeActionPlanRow = (id: string) => {
    const filtered = formData.actionPlans.filter(p => p.id !== id);
    updateField('actionPlans', filtered);
  };

  const updateActionPlanRow = (id: string, key: keyof ActionPlan, value: any) => {
    const updated = formData.actionPlans.map(p => {
      if (p.id === id) {
        return { ...p, [key]: value };
      }
      return p;
    });
    updateField('actionPlans', updated);
  };

  // Step validation before proceeding
  const validateStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      if (!formData.date) { setValidationError('กรุณาเลือกวันที่บันทึกรายงาน'); return false; }
      if (!formData.reporter) { setValidationError('กรุณาเลือกหรือป้อนชื่อผู้รายงาน'); return false; }
      if (formData.sections.length === 0) { setValidationError('กรุณาเลือกหน่วยงาน / แผนกอย่างน้อย 1 แผนก'); return false; }
    }
    if (stepIndex === 1) {
      if (formData.eventTypes.length === 0) { setValidationError('กรุณาเลือกประเภทเหตุการณ์ที่เกิดขึ้นอย่างน้อย 1 อย่าง'); return false; }
      if (!formData.description.trim()) { setValidationError('กรุณากรอกรายละเอียดเหตุการณ์ที่เกิดขี้น'); return false; }
    }
    if (stepIndex === 4) {
      if (!formData.rootCause.trim()) { setValidationError('กรุณากรอกผลวิเคราะห์หาสาเหตุราก (Root Cause)'); return false; }
    }
    if (stepIndex === 5) {
      if (formData.decision === 'เปิด CAPA' && formData.actionPlans.some(p => !p.action.trim())) {
        setValidationError('กรุณากรอกมาตรการในแผนงานแก้ไข (Action Plan) ให้ครบถ้วน');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveStep(prev => prev - 1);
    setValidationError('');
  };

  const handleSubmit = () => {
    if (!validateStep(activeStep)) return;
    
    // Save signature author names if they marked 'signed'
    const finalReport: NCRReport = {
      ...formData,
      id: ncrId,
      capaId: formData.decision === 'เปิด CAPA' ? capaId : '',
      riskScore,
      riskLevel,
      createdAt: existingReport ? existingReport.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(finalReport);
  };

  // Prep staff lists
  const reporters = INITIAL_STAFF.filter(s => s.role === 'reporter');
  const sectionHeads = INITIAL_STAFF.filter(s => s.role === 'sectionHead');
  const qmStaff = INITIAL_STAFF.filter(s => s.role === 'qm');

  const stepsList = [
    '1. ข้อมูลทั่วไป',
    '2. ประเภท & รายละเอียด',
    '3. การแก้ไขทันที',
    '4. การประเมินความเสี่ยง',
    '5. สาเหตุ (Root Cause)',
    '6. มาตรการ CAPA',
    '7. ปิดเรื่อง & ลงนาม'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[550px]">
      
      {/* Sidebar Progress Steps */}
      <div className="md:w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-4 flex-shrink-0">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider">NCR FORM WIZARD</span>
          <h3 className="font-extrabold text-slate-800 text-sm">ขั้นตอนการบันทึกรายงาน</h3>
        </div>
        
        <div className="space-y-2 pt-2">
          {stepsList.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <button
                key={step}
                onClick={() => {
                  // Allow clicking backward or validated forward
                  if (idx < activeStep) {
                    setActiveStep(idx);
                    setValidationError('');
                  } else if (idx > activeStep) {
                    // Check if everything in-between is validated
                    let valid = true;
                    for (let s = activeStep; s < idx; s++) {
                      if (!validateStep(s)) {
                        valid = false;
                        setActiveStep(s);
                        break;
                      }
                    }
                    if (valid) {
                      setActiveStep(idx);
                      setValidationError('');
                    }
                  }
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent ? 'bg-sky-50 text-sky-800 border-l-4 border-sky-600 pl-3' :
                  isDone ? 'text-emerald-700 hover:bg-slate-100/50' :
                  'text-slate-400 hover:bg-slate-100/30'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-sky-600 text-white' :
                  isDone ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span>{step}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200/80">
          <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
            ห้องปฏิบัติการทางการแพทย์ ISO 15189:2022
          </p>
        </div>
      </div>

      {/* Main Form Content panel */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        
        <div>
          {/* Top Wizard Info Header */}
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">กลุ่มงานเทคนิคการแพทย์ รพร.เดชอุดม</span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">
                {existingReport ? '📝 แก้ไขรายงาน NCR' : '➕ บันทึกเหตุการณ์ NCR ใหม่'}
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-sky-50 border border-sky-100 text-sky-800 font-bold text-xs rounded-xl">
                {ncrId}
              </span>
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-800 text-xs font-medium animate-shake">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: ทั่วไป */}
          {activeStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">วันที่รายงาน <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">เวลาเกิดเหตุ</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600">ผู้รายงานเหตุการณ์ <span className="text-rose-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIsCustom = !isCustomReporter;
                        setIsCustomReporter(nextIsCustom);
                        if (nextIsCustom) {
                          updateField('reporter', formData.reporter || '');
                        } else {
                          updateField('reporter', '');
                        }
                      }}
                      className="text-[10px] font-semibold text-sky-600 hover:text-sky-700 underline cursor-pointer"
                    >
                      {isCustomReporter ? "เลือกจากรายชื่อเจ้าหน้าที่" : "✍️ พิมพ์ชื่อระบุเอง"}
                    </button>
                  </div>
                  {isCustomReporter ? (
                    <input
                      type="text"
                      value={formData.reporter}
                      onChange={(e) => {
                        updateField('reporter', e.target.value);
                        updateSignature('reporter', 'name', e.target.value);
                      }}
                      placeholder="พิมพ์ชื่อ-นามสกุล และตำแหน่ง (เช่น น.ส.ใจดี รักงาน (MT))"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 font-sans"
                    />
                  ) : (
                    <select
                      value={formData.reporter}
                      onChange={(e) => {
                        updateField('reporter', e.target.value);
                        updateSignature('reporter', 'name', e.target.value);
                      }}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 font-sans"
                    >
                      <option value="">— เลือกชื่อเจ้าหน้าที่ —</option>
                      {reporters.map(rep => (
                        <option key={rep.id} value={rep.name}>{rep.name} ({rep.department})</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Lab Section/Department Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">หน่วยงาน (Section / Department) <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {defaultSections.map((sec) => {
                    const checked = formData.sections.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleCheckbox('sections', sec)}
                        className={`p-3 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                          checked 
                            ? 'bg-sky-50/50 border-sky-400 text-sky-800' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'}`}>
                            {checked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="truncate">{sec}</span>
                        </div>
                      </button>
                    );
                  })}
                  {/* "อื่นๆ" Option */}
                  <button
                    type="button"
                    onClick={toggleCustomSection}
                    className={`p-3 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                      hasCustomSection 
                        ? 'bg-sky-50/50 border-sky-400 text-sky-800' 
                        : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${hasCustomSection ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {hasCustomSection && <Check className="w-3 h-3" />}
                      </div>
                      <span>อื่นๆ (โปรดระบุ)</span>
                    </div>
                  </button>
                </div>

                {/* Inline Custom Section Text Input */}
                {hasCustomSection && (
                  <div className="mt-2.5 max-w-sm">
                    <input
                      type="text"
                      value={customSectionInput}
                      onChange={(e) => handleCustomSectionChange(e.target.value)}
                      placeholder="ระบุชื่อหน่วยงาน/แผนกอื่นๆ เช่น พยาธิวิทยา, คลังยา..."
                      className="w-full px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 font-sans"
                    />
                  </div>
                )}
              </div>

              {/* Process Radios */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">ขั้นตอนกระบวนการ (Process Stage) <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    { val: 'Pre-Analytical', label: 'Pre-Analytical (ก่อนวิเคราะห์/สิ่งส่งตรวจ)' },
                    { val: 'Analytical', label: 'Analytical (ระหว่างทดสอบวิเคราะห์)' },
                    { val: 'Post-Analytical', label: 'Post-Analytical (หลังรายงาน/แปลผล)' }
                  ].map((proc) => {
                    const active = formData.process === proc.val;
                    return (
                      <button
                        key={proc.val}
                        type="button"
                        onClick={() => updateField('process', proc.val)}
                        className={`p-3 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                          active 
                            ? 'bg-sky-50 border-sky-400 text-sky-800' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-sky-600 bg-sky-600' : 'border-slate-300 bg-white'}`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{proc.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ประเภทและรายละเอียด */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* Event Type Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">ประเภทเหตุการณ์ที่เกิดขึ้น <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Specimen Problem', 'Wrong Report', 'Patient Identification', 
                    'TAT Delay', 'QC / IQC Failure', 'Critical Value', 
                    'EQA / PT Failure', 'LIS / IT Error', 'Instrument Failure', 
                    'Complaint', 'Reagent Problem', 'Safety Incident'
                  ].map((type) => {
                    const checked = formData.eventTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleCheckbox('eventTypes', type)}
                        className={`p-2.5 text-xs font-semibold rounded-lg text-left border transition-all cursor-pointer ${
                          checked 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                            {checked && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{type}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">รายละเอียดเหตุการณ์ที่เกิดขี้น (Event Description) <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="อธิบายพฤติกรรม อาการ หรือปัญหาที่ตรวจพบ เช่น ตรวจพบระดับ QC Glucose สูงเกินพารามิเตอร์ปกติ หรือ สิ่งส่งตรวจป้ายชื่อคนไข้หลุดลอก..."
                  rows={6}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-sans"
                />
              </div>
            </div>
          )}

          {/* STEP 3: แก้ไขทันที */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Immediate Corrections checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block font-sans">การดำเนินการแก้ไขทันที (Immediate Correction / Containment)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Stop Reporting', 'Corrected Report', 'Stop Testing', 
                    'Use Backup Instrument', 'Reject Specimen', 'Notify Physician', 
                    'Re-run QC', 'Notify Supervisor', 'Recalibration', 'Other'
                  ].map((corr) => {
                    const checked = formData.immediateCorrections.includes(corr);
                    return (
                      <button
                        key={corr}
                        type="button"
                        onClick={() => toggleCheckbox('immediateCorrections', corr)}
                        className={`p-2.5 text-xs font-semibold rounded-lg text-left border transition-all cursor-pointer ${
                          checked 
                            ? 'bg-amber-50/50 border-amber-300 text-amber-800' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'}`}>
                            {checked && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span>{corr}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Immediate Detail Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">รายละเอียดผลของการแก้ไขทันทีเพิ่มเติม (Correction Details)</label>
                <textarea
                  value={formData.immediateDetail}
                  onChange={(e) => updateField('immediateDetail', e.target.value)}
                  placeholder="ระบุสิ่งที่ทำทันทีหลังจากพบเหตุการณ์ เช่น ได้คีย์ผลเข้าระบบ LIS สำรอง หรือลบรีพอร์ตฉบับก่อนหน้าแล้วออกรายงานผลแก้ไขด่วนฉบับสมบูรณ์..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 font-sans"
                />
              </div>
            </div>
          )}

          {/* STEP 4: การประเมินความเสี่ยง */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Impact Info */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">ข้อมูลความรุนแรงและผลกระทบผู้ป่วย</h4>
                  
                  {/* Patient Impact Radios */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">ผลกระทบผู้ป่วย (Patient Impact) :</span>
                    <div className="flex gap-1.5">
                      {['ไม่มี', 'อาจมี', 'มี'].map((imp) => (
                        <button
                          key={imp}
                          type="button"
                          onClick={() => updateField('patientImpact', imp)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                            formData.patientImpact === imp 
                              ? 'bg-sky-600 text-white border-sky-600' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {imp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patients and Specimen counts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">จำนวนผู้ป่วยที่เกี่ยวข้อง (ราย)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.patientCount}
                        onChange={(e) => updateField('patientCount', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">จำนวนสิ่งส่งตรวจ / ชิ้นงาน</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.specimenCount}
                        onChange={(e) => updateField('specimenCount', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* Radios for Recall & Physicians */}
                  <div className="space-y-2 pt-1 border-t border-slate-200/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">ต้องเรียกคืนรายงานผล (Recall Report) หรือไม่?</span>
                      <div className="flex gap-1.5">
                        {['ใช่', 'ไม่ใช่'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => updateField('recallResult', ans)}
                            className={`px-2.5 py-0.5 text-[11px] font-bold rounded border cursor-pointer ${
                              formData.recallResult === ans ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">ต้องแจ้งเตือนรายงานผลด่วนให้แพทย์ทราบหรือไม่?</span>
                      <div className="flex gap-1.5">
                        {['ใช่', 'ไม่ใช่'].map(ans => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => updateField('notifyPhysician', ans)}
                            className={`px-2.5 py-0.5 text-[11px] font-bold rounded border cursor-pointer ${
                              formData.notifyPhysician === ans ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Risk Grid Selector */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">Risk Assessment Grid</h4>
                  
                  {/* Dropdowns */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500">Severity (S) — ความรุนแรง</label>
                      <select
                        value={formData.severity}
                        onChange={(e) => updateField('severity', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-sans focus:outline-none focus:border-sky-500"
                      >
                        <option value="">— เลือกระดับความรุนแรง —</option>
                        <option value="Low">Low (1) — เล็กน้อย ไม่มีผลลัพธ์คลาดเคลื่อน</option>
                        <option value="Medium">Medium (2) — ปานกลาง คลาดเคลื่อนแก้ทัน</option>
                        <option value="High">High (3) — รุนแรง ผลตรวจคนไข้เกือบสลับ</option>
                        <option value="Critical">Critical (4) — วิกฤต ผลกระทบคนไข้ทันที</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500">Occurrence (O) — โอกาสเกิดซ้ำ</label>
                      <select
                        value={formData.occurrence}
                        onChange={(e) => updateField('occurrence', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-sans focus:outline-none focus:border-sky-500"
                      >
                        <option value="">— เลือกโอกาสเกิดซ้ำ —</option>
                        <option value="Rare">Rare (1) — แทบไม่เคยเกิด (นานทีปีครั้ง)</option>
                        <option value="Occasional">Occasional (2) — เกิดเป็นบางครั้ง (รายเดือน)</option>
                        <option value="Frequent">Frequent (3) — เกิดบ่อยครั้งมาก (รายสัปดาห์)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500">Detectability (D) — โอกาสตรวจพบ</label>
                      <select
                        value={formData.detectability}
                        onChange={(e) => updateField('detectability', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-sans focus:outline-none focus:border-sky-500"
                      >
                        <option value="">— เลือกโอกาสตรวจพบ —</option>
                        <option value="Easy">Easy (1) — ตรวจพบได้ง่ายก่อนออกรายงาน</option>
                        <option value="Moderate">Moderate (2) — ตรวจพบค่อนข้างยาก ต้องตรวจสอบเชิงลึก</option>
                        <option value="Difficult">Difficult (3) — ตรวจพบยากมาก อาจส่งผลหลุดรอด</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculations card display */}
                  {riskScore > 0 ? (
                    <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                      riskLevel === 'Low' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                      riskLevel === 'Moderate' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      riskLevel === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                      'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">คะแนนประเมินความเสี่ยง</span>
                        <h3 className="text-2xl font-extrabold leading-none mt-1">{riskScore} คะแนน</h3>
                        <p className="text-[9px] mt-1 font-medium">คำนวณ : Severity ({severityValue}) × Occurrence ({occurrenceValue}) × Detect ({detectabilityValue})</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Risk Level</span>
                        <span className={`inline-block px-3 py-1 text-sm font-extrabold rounded-full mt-1 ${
                          riskLevel === 'Low' ? 'bg-emerald-600 text-white' :
                          riskLevel === 'Moderate' ? 'bg-amber-600 text-white' :
                          riskLevel === 'High' ? 'bg-orange-600 text-white' :
                          'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {riskLevel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500 italic">
                      กรุณาเลือก Severity, Occurrence และ Detectability ด้านบนเพื่อประเมินระดับความเสี่ยง
                    </div>
                  )}

                  {/* CAPA rule warning */}
                  {(riskLevel === 'High' || riskLevel === 'Extreme') && (
                    <div className="p-3 bg-rose-100 text-rose-800 rounded-xl border border-rose-200 text-[10px] font-semibold flex gap-2 leading-relaxed">
                      <span>⚠️</span>
                      <p>
                        เนื่องจากระดับความเสี่ยงได้รับการประเมินในเกณฑ์ <strong>High / Extreme</strong> ระบบจะบังคับเปลี่ยนประเภทการดำเนินการให้เป็น <strong>เปิด CAPA (Open CAPA)</strong> เพื่อทำมาตรการระยะยาวโดยอัตโนมัติ
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* STEP 5: วิเคราะห์สาเหตุ */}
          {activeStep === 4 && (
            <div className="space-y-6">
              
              {/* Analysis Method Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">วิธีการวิเคราะห์หาสาเหตุราก (Root Cause Analysis Method)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {['5 Why', 'Fishbone Diagram', 'Process Analysis', 'FMEA Review', 'Other'].map((method) => {
                    const checked = formData.analysisMethods.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => toggleCheckbox('analysisMethods', method)}
                        className={`p-2.5 text-xs font-semibold rounded-lg text-center border transition-all cursor-pointer ${
                          checked 
                            ? 'bg-sky-50 border-sky-400 text-sky-800' 
                            : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Root Cause Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">วิเคราะห์สาเหตุที่แท้จริง (Root Cause Result) <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.rootCause}
                  onChange={(e) => updateField('rootCause', e.target.value)}
                  placeholder="อธิบายสรุปสาเหตุที่แท้จริงที่เกิดขึ้น เช่น เกิดความบกพร่องของ Reagent Lot ใหม่เนื่องจากอุณหภูมิขนส่งไม่ได้เกณฑ์ หรือเกิด Human Error เนื่องจากขาดการตรวจทานบาร์โค้ดสลับซ้ำ..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 font-sans"
                />
              </div>

              {/* Contributing Factors checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block font-sans">ปัจจัยอื่นๆ ที่เกี่ยวข้อง (Contributing Factors)</label>
                <div className="flex gap-2 flex-wrap">
                  {['Human', 'Machine', 'Method', 'Material', 'Measurement', 'Environment', 'Management'].map((factor) => {
                    const checked = formData.contributingFactors.includes(factor);
                    return (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => toggleCheckbox('contributingFactors', factor)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                          checked 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {factor}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 6: มาตรการ CAPA */}
          {activeStep === 5 && (
            <div className="space-y-6">
              
              {/* Decision Type Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">การตัดสินใจมาตรการดำเนินงาน (Decision)</h4>
                    <p className="text-xs text-slate-500 mt-1">เลือกระหว่างแก้ปัญหาระยะสั้นเฉพาะหน้า หรือเปิดใบงาน CAPA ระยะยาว</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={riskLevel === 'High' || riskLevel === 'Extreme'}
                      onClick={() => updateField('decision', 'Correction Only')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        formData.decision === 'Correction Only' 
                          ? 'bg-sky-600 text-white border-sky-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'
                      }`}
                    >
                      Correction Only
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('decision', 'เปิด CAPA')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        formData.decision === 'เปิด CAPA' 
                          ? 'bg-sky-600 text-white border-sky-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      เปิด CAPA (Open CAPA)
                    </button>
                  </div>
                </div>

                {formData.decision === 'เปิด CAPA' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">CAPA ID</label>
                      <input
                        type="text"
                        readOnly
                        value={capaId}
                        className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase">เหตุผลประกอบการตัดสินใจ (Decision Reason)</label>
                      <input
                        type="text"
                        value={formData.decisionReason}
                        onChange={(e) => updateField('decisionReason', e.target.value)}
                        placeholder="ระบุเหตุผลเบื้องต้นที่เปิดหรือไม่เปิดแผนงานนี้..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Action Plans Grid Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                      {formData.decision === 'เปิด CAPA' ? 'แผนการป้องกันและแก้ไขระยะยาว (CAPA Action Plan)' : 'มาตรการแก้ไขชั่วคราว'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">กำหนดแผนมาตรการ ผู้รับผิดชอบ และกรอบกำหนดเสร็จงาน</p>
                  </div>
                  <button
                    type="button"
                    onClick={addActionPlanRow}
                    className="flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มแผนมาตรการ
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                        <th className="p-3 w-1/2">มาตรการ (Action Description)</th>
                        <th className="p-3">ผู้รับผิดชอบ</th>
                        <th className="p-3 text-center">กำหนดเสร็จ</th>
                        <th className="p-3 text-center">สถานะ</th>
                        <th className="p-3 text-right w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.actionPlans.length > 0 ? (
                        formData.actionPlans.map((plan) => (
                          <tr key={plan.id} className="border-b border-slate-100 hover:bg-slate-50/20">
                            
                            {/* Action Description */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={plan.action}
                                onChange={(e) => updateActionPlanRow(plan.id, 'action', e.target.value)}
                                placeholder="เช่น อบรมการระบุตัวตนผู้ป่วย, สัญญาณเตือน LIS ล่ม..."
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </td>

                            {/* Responsible */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={plan.responsible}
                                onChange={(e) => updateActionPlanRow(plan.id, 'responsible', e.target.value)}
                                placeholder="ชื่อหรือตำแหน่ง"
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                              />
                            </td>

                            {/* Due Date */}
                            <td className="p-2">
                              <input
                                type="date"
                                value={plan.dueDate}
                                onChange={(e) => updateActionPlanRow(plan.id, 'dueDate', e.target.value)}
                                className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                              />
                            </td>

                            {/* Status select */}
                            <td className="p-2 text-center">
                              <select
                                value={plan.status}
                                onChange={(e) => updateActionPlanRow(plan.id, 'status', e.target.value as any)}
                                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                              >
                                <option value="รอดำเนินการ">รอดำเนินการ</option>
                                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                              </select>
                            </td>

                            {/* Remove action */}
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => removeActionPlanRow(plan.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400 italic font-medium">
                            ยังไม่มีแผนงาน กรุณากดปุ่ม "เพิ่มแผนมาตรการ" ด้านขวาบนเพื่อระบุแนวทางป้องกันแก้ไข
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* STEP 7: ปิดเรื่องและลายเซ็น */}
          {activeStep === 6 && (
            <div className="space-y-6">
              
              {/* Effectiveness Checks */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                
                <div className="md:col-span-4 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">10. ผลการติดตามประสิทธิผล</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { val: 'Effective', label: '✓ Effective (มีประสิทธิผล)' },
                      { val: 'Not Effective', label: '✗ Not Effective (ไม่มี)' },
                      { val: 'Continue Monitoring', label: '⏰ Continue Monitoring (เฝ้าสถิติ)' }
                    ].map(item => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => updateField('effectiveness', item.val)}
                        className={`p-2.5 text-xs font-bold rounded-lg border text-left cursor-pointer transition-all ${
                          formData.effectiveness === item.val 
                            ? 'bg-sky-600 text-white border-sky-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-8 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-600">รายละเอียดประสิทธิผลที่ได้ (Monitoring Remarks)</label>
                    <textarea
                      value={formData.effectivenessDetail}
                      onChange={(e) => updateField('effectivenessDetail', e.target.value)}
                      placeholder="ระบุความคืบหน้าของผลลัพธ์ เช่น ได้ทดสอบติดตามต่อเนื่อง 30 วันหลังปฏิบัติการ ผลลัพธ์ไม่พบสลับป้ายซ้ำ หรือผ่านค่าเกณฑ์ IQC ต่อเนื่องเป็นอย่างดี..."
                      rows={3}
                      className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-sans mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Signatures approvals cards */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">ลายมือชื่ออนุมัติเอกสาร (Signatures Validation)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Reporter */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">ผู้รายงานเหตุ (Reported by)</span>
                      <div className="font-semibold text-xs text-sky-800 truncate">
                        {formData.reporter || '— ยังไม่ได้เลือกในขั้นตอนแรก —'}
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">วันลงนาม :</span>
                        <input
                          type="date"
                          value={formData.signatures.reporter.date}
                          onChange={(e) => updateSignature('reporter', 'date', e.target.value)}
                          className="px-2 py-0.5 border border-slate-200 rounded text-[11px] max-w-[120px] text-right"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!formData.reporter}
                          checked={formData.signatures.reporter.signed}
                          onChange={(e) => updateSignature('reporter', 'signed', e.target.checked)}
                          className="w-4 h-4 accent-sky-600 cursor-pointer"
                        />
                        <span>ลงนามเสร็จสิ้น (Sign Author)</span>
                      </label>
                    </div>
                  </div>

                  {/* Card 2: Section Head */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">หัวหน้าหน่วย (Section Head)</span>
                      <select
                        value={formData.signatures.sectionHead.name}
                        onChange={(e) => updateSignature('sectionHead', 'name', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-sans"
                      >
                        <option value="">— เลือกหัวหน้าแผนก —</option>
                        {sectionHeads.map(sh => (
                          <option key={sh.id} value={sh.name}>{sh.name} ({sh.department})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">วันลงนาม :</span>
                        <input
                          type="date"
                          value={formData.signatures.sectionHead.date}
                          onChange={(e) => updateSignature('sectionHead', 'date', e.target.value)}
                          className="px-2 py-0.5 border border-slate-200 rounded text-[11px] max-w-[120px] text-right"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!formData.signatures.sectionHead.name}
                          checked={formData.signatures.sectionHead.signed}
                          onChange={(e) => updateSignature('sectionHead', 'signed', e.target.checked)}
                          className="w-4 h-4 accent-sky-600 cursor-pointer"
                        />
                        <span>ลงนามอนุมัติ (Sign Head)</span>
                      </label>
                    </div>
                  </div>

                  {/* Card 3: Quality Manager */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">Quality Manager (QM)</span>
                      <select
                        value={formData.signatures.qm.name}
                        onChange={(e) => updateSignature('qm', 'name', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-sans"
                      >
                        <option value="">— เลือกผู้จัดการคุณภาพ —</option>
                        {qmStaff.map(qm => (
                          <option key={qm.id} value={qm.name}>{qm.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">วันลงนาม :</span>
                        <input
                          type="date"
                          value={formData.signatures.qm.date}
                          onChange={(e) => updateSignature('qm', 'date', e.target.value)}
                          className="px-2 py-0.5 border border-slate-200 rounded text-[11px] max-w-[120px] text-right"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!formData.signatures.qm.name}
                          checked={formData.signatures.qm.signed}
                          onChange={(e) => updateSignature('qm', 'signed', e.target.checked)}
                          className="w-4 h-4 accent-sky-600 cursor-pointer"
                        />
                        <span>ลงนามปิดประเด็น (QM Sign)</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Form Wizard Bottom Button controls */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-10">
          <div>
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold cursor-pointer transition-colors"
            >
              ยกเลิก
            </button>
          </div>

          <div className="flex gap-2">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            )}

            {activeStep < stepsList.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-800 hover:bg-sky-950 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                ถัดไป
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                บันทึกใบรายงาน <Check className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
