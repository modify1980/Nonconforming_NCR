import { useState, useEffect } from 'react';
import { NCRReport } from './types';
import { INITIAL_REPORTS } from './data/initialData';
import Dashboard from './components/Dashboard';
import RecordsList from './components/RecordsList';
import ReportForm from './components/ReportForm';
import PrintSheet from './components/PrintSheet';
import { AnimatePresence, motion } from 'motion/react';
import { BarChart2, ClipboardList, FileSpreadsheet, FlaskConical, PlusCircle, ShieldCheck, Lock, Unlock, Key, LogOut, ShieldAlert, UserCheck } from 'lucide-react';

export default function App() {
  // Load initially from localStorage, fall back to INITIAL_REPORTS
  const [reports, setReports] = useState<NCRReport[]>(() => {
    const saved = localStorage.getItem('ncr_reports_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved reports:", e);
      }
    }
    return INITIAL_REPORTS;
  });

  // Admin Mode states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('ncr_is_admin') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: 'create' | 'edit' | 'delete'; data?: any } | null>(null);

  // Save reports to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ncr_reports_data', JSON.stringify(reports));
  }, [reports]);

  // View state management: 'dashboard' | 'list' | 'report' | 'print'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'report' | 'print'>('dashboard');
  
  // Handle report edit / print target
  const [editingReport, setEditingReport] = useState<NCRReport | null>(null);
  const [viewingReport, setViewingReport] = useState<NCRReport | null>(null);

  // Success Notification state
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('ncr_is_admin');
    triggerToast('ออกจากระบบผู้ดูแลระบบแล้ว');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '1234') {
      setIsAdmin(true);
      sessionStorage.setItem('ncr_is_admin', 'true');
      setShowAuthModal(false);
      setAdminPassword('');
      setAuthError('');
      triggerToast('เข้าสู่ระบบผู้ดูแลระบบสำเร็จ!');

      // Execute pending action if any
      if (pendingAction) {
        if (pendingAction.type === 'create') {
          setEditingReport(null);
          setActiveTab('report');
        } else if (pendingAction.type === 'edit') {
          setEditingReport(pendingAction.data);
          setActiveTab('report');
        } else if (pendingAction.type === 'delete') {
          const id = pendingAction.data;
          setReports(prev => prev.filter(r => r.id !== id));
          triggerToast(`ลบรายงานสำเร็จ! เลขที่ ${id}`);
        }
        setPendingAction(null);
      }
    } else {
      setAuthError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Create / Update reports handler
  const handleSaveReport = (savedReport: NCRReport) => {
    // Double check admin authorization
    if (!isAdmin) {
      setPendingAction({ type: 'create' });
      setShowAuthModal(true);
      return;
    }

    const exists = reports.some(r => r.id === savedReport.id);
    if (exists) {
      setReports(prev => prev.map(r => r.id === savedReport.id ? savedReport : r));
      triggerToast(`อัปเดตรายงานสำเร็จ! เลขที่ ${savedReport.id}`);
    } else {
      setReports(prev => [savedReport, ...prev]);
      triggerToast(`เพิ่มรายงานสำเร็จ! เลขที่ ${savedReport.id}`);
    }
    
    // Reset edit state and return to list
    setEditingReport(null);
    setActiveTab('list');
  };

  // Delete report handler
  const handleDeleteReport = (id: string) => {
    if (!isAdmin) {
      setPendingAction({ type: 'delete', data: id });
      setShowAuthModal(true);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== id));
    triggerToast(`ลบรายงานสำเร็จ! เลขที่ ${id}`);
  };

  // Setup editing triggers
  const handleEditReport = (report: NCRReport) => {
    if (!isAdmin) {
      setPendingAction({ type: 'edit', data: report });
      setShowAuthModal(true);
      return;
    }
    setEditingReport(report);
    setActiveTab('report');
  };

  // Setup viewing triggers
  const handleViewReport = (report: NCRReport) => {
    setViewingReport(report);
    setActiveTab('print');
  };

  const handleCreateNewReport = () => {
    if (!isAdmin) {
      setPendingAction({ type: 'create' });
      setShowAuthModal(true);
      return;
    }
    setEditingReport(null);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 leading-normal antialiased pb-12 print:pb-0 print:bg-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2.5 text-xs font-semibold tracking-wide"
          >
            <span className="p-1 bg-emerald-500 rounded-full text-xs text-white">✓</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BRANDING BAR (Hidden when printing) */}
      <header className="bg-gradient-to-r from-[#0d2040] via-[#10244c] to-[#08152c] text-white shadow-md border-b border-[#1b3664] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5.5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            
            {/* Header info matching sample banner */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#1d355d]/80 border border-sky-500/30 flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-7 h-7 text-sky-400" />
              </div>
              <div className="space-y-1">
                <div>
                  <span className="inline-block bg-[#d91d1d] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wide shadow-sm">
                    รพร.สมเด็จพระยุพราชเดชอุดม
                  </span>
                </div>
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight font-sans text-white leading-tight">
                  Nonconforming Event Report (NCR) ห้องปฏิบัติการทางการแพทย์เทคนิคการแพทย์
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  แบบฟอร์มบันทึกงานสิ่งที่ไม่เป็นไปตามข้อกำหนด : รพร.เดชอุดม ISO 15189:2022
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-2.5 items-center w-full md:w-auto justify-between md:justify-end">
              <div className="text-left md:text-right hidden sm:block">
                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 block uppercase">CURRENT ENVIRONMENT</span>
                <span className="text-xs font-bold text-sky-400">กลุ่มงานเทคนิคการแพทย์ รพร.เดชอุดม</span>
              </div>
              
              {/* Admin Mode Toggle / Badge */}
              {isAdmin ? (
                <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ผู้ดูแลระบบ</span>
                  <button 
                    onClick={handleLogout}
                    title="ออกจากระบบผู้ดูแลระบบ"
                    className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPendingAction(null);
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>เข้าสู่ระบบ Admin</span>
                </button>
              )}

              <button
                onClick={handleCreateNewReport}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-sky-500/10 active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                กรอกรายงานใหม่
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* TOP NAVIGATION TABS (Hidden when printing) */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-none">
            
            {/* Tab: Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              แดชบอร์ดสรุปผล
            </button>

            {/* Tab: All Records */}
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'list'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              รายการรายงานทั้งหมด ({reports.length})
            </button>

            {/* Tab: Report Form */}
            <button
              onClick={handleCreateNewReport}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'report' && !editingReport
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              กรอกใบงาน NCR ใหม่
            </button>

            {/* Tab: Report Form (Editing) */}
            {editingReport && activeTab === 'report' && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-sm whitespace-nowrap"
              >
                <span>📝 กำลังแก้ไข : {editingReport.id}</span>
              </button>
            )}

            {/* Tab: Print View */}
            {viewingReport && activeTab === 'print' && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white shadow-sm whitespace-nowrap"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>ดูใบรายงานแบบ Excel : {viewingReport.id}</span>
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* MAIN VIEWPORT BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab === 'print' ? `print-${viewingReport?.id}` : activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="print:p-0"
          >
            {activeTab === 'dashboard' && (
              <Dashboard reports={reports} />
            )}

            {activeTab === 'list' && (
              <RecordsList
                reports={reports}
                onViewReport={handleViewReport}
                onEditReport={handleEditReport}
                onDeleteReport={handleDeleteReport}
              />
            )}

            {activeTab === 'report' && (
              <ReportForm
                existingReport={editingReport}
                reports={reports}
                onSave={handleSaveReport}
                onCancel={() => {
                  setEditingReport(null);
                  setActiveTab('list');
                }}
              />
            )}

            {activeTab === 'print' && viewingReport && (
              <PrintSheet
                report={viewingReport}
                onBack={() => {
                  setViewingReport(null);
                  setActiveTab('list');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Admin Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAuthModal(false);
                setPendingAction(null);
                setAdminPassword('');
                setAuthError('');
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-sm w-full relative z-10 overflow-hidden"
            >
              {/* Header Icon Decoration */}
              <div className="mx-auto w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-4 border border-sky-100">
                <Key className="w-6 h-6" />
              </div>

              <div className="text-center mb-5">
                <h3 className="text-base font-bold text-slate-800">ยืนยันรหัสผ่านผู้ดูแลระบบ</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {pendingAction 
                    ? `คุณจำเป็นต้องใส่รหัสผ่านผู้ดูแลระบบเพื่อดำเนินการนี้`
                    : 'กรุณากรอกรหัสผ่านผู้ดูแลระบบเพื่อเข้าใช้สิทธิ์แก้ไขข้อมูล'}
                </p>
                {pendingAction && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
                    {pendingAction.type === 'create' && '➕ การสร้างรายงานใหม่'}
                    {pendingAction.type === 'edit' && '📝 การแก้ไขรายงาน'}
                    {pendingAction.type === 'delete' && '❌ การลบรายงาน'}
                  </span>
                )}
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    รหัสผ่านเข้าใช้งาน (Admin Password)
                  </label>
                  <input
                    type="password"
                    autoFocus
                    required
                    placeholder="กรอกรหัสผ่าน 4 หลัก..."
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                  {authError && (
                    <p className="text-[10px] font-bold text-rose-600 text-center flex items-center justify-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {authError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setPendingAction(null);
                      setAdminPassword('');
                      setAuthError('');
                    }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer text-center"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
