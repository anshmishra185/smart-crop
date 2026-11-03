import {
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'

interface PhytosanitaryAuditModalProps {
  isOpen: boolean
  onClose: () => void
  location: string
}

export function PhytosanitaryAuditModal({
  isOpen,
  onClose,
  location,
}: PhytosanitaryAuditModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const dossierId = 'PMFBY-SURV-2026-98124'
  const auditDate = '02 Nov 2026'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:max-w-none print:p-4 text-slate-800 dark:text-slate-100">
        {/* Controls - Hidden during print */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-agri-darkBorder print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Official Phytosanitary Surveillance Audit & PMFBY Claim Dossier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Government Certified Plant Pathology Audit for Crop Loss Assessment & Insurance Claims
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" /> Print Audit Dossier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-agri-darkCard dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 pt-4 print:pt-0">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-forest-800 pb-4 dark:border-emerald-500">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-forest-800 dark:text-emerald-400" />
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  State Agricultural Phytosanitary Intelligence Unit
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directorate of Plant Protection, Quarantine & Storage • Department of Agriculture
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Audit Dossier ID: {dossierId} • Verification Date: {auditDate}
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">PMFBY Certified</span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">ICAR-NCIPM AUDIT</span>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <QrCode className="h-10 w-10 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
          </div>

          {/* Demographic & Farm Inspection Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-agri-darkCard border border-slate-200/80 dark:border-agri-darkBorder">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Surveillance Location</span>
              <p className="font-black text-slate-900 dark:text-white">{location} (Estate Parcellation)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Cultivated Area</span>
              <p className="font-black text-slate-900 dark:text-white">2,402 Cultivated Acres</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pathogen Incidence</span>
              <p className="font-black text-red-600 dark:text-red-400">380 Acres Affected (15.8%)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Insurance Claim State</span>
              <p className="font-black text-emerald-700 dark:text-emerald-400">Eligible (Threshold Exceeded)</p>
            </div>
          </div>

          {/* Pathology Diagnostic Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
              Verified Foliar Pathology Findings (AI Optical & Microscopic Lab Audit)
            </h4>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <span className="font-bold text-slate-900 dark:text-white block">Yellow / Stripe Rust</span>
                <span className="text-[10px] text-slate-400">Puccinia striiformis f. sp. tritici</span>
                <p className="mt-1 font-mono font-black text-red-600">184 Affected Acres • 94.2% AI Conf</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <span className="font-bold text-slate-900 dark:text-white block">Potato Late Blight</span>
                <span className="text-[10px] text-slate-400">Phytophthora infestans (Oomycete)</span>
                <p className="mt-1 font-mono font-black text-amber-600">96 Affected Acres • 91.8% AI Conf</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <span className="font-bold text-slate-900 dark:text-white block">Cotton Leaf Curl Virus</span>
                <span className="text-[10px] text-slate-400">Geminiviridae (Bemisia tabaci Vector)</span>
                <p className="mt-1 font-mono font-black text-red-600">100 Affected Acres • 89.4% AI Conf</p>
              </div>
            </div>
          </div>

          {/* Financial & Economic Loss Evaluation */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2">
            <h4 className="text-xs font-black uppercase text-emerald-900 dark:text-emerald-300">
              PMFBY Economic Loss Assessment & Prevented Damage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pre-Harvest Yield Loss</span>
                <p className="text-base font-black text-red-600 font-mono">-14.8% (3.4 q/acre average)</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Assessed Crop Value Loss</span>
                <p className="text-base font-black text-slate-900 dark:text-white font-mono">₹7,21,000</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase">Loss Prevented Via Spray</span>
                <p className="text-base font-black text-emerald-800 dark:text-emerald-300 font-mono">₹4,28,000 Saved</p>
              </div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="border-t border-slate-200 pt-4 dark:border-agri-darkBorder text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p>Certified in compliance with ICAR-NCIPM Phytosanitary Survey Standards.</p>
              <p>Valid for state crop damage compensation and PMFBY insurance claim settlement.</p>
            </div>
            <div className="flex gap-8 text-right">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Dr. Gurinder Singh, Ph.D.</p>
                <p>Chief Plant Pathologist (SAU)</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">PMFBY Official Assessor</p>
                <p>Digital Cryptographic Seal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
