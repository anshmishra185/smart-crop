import {
  FileText,
  Printer,
  QrCode,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

interface OperationsBriefingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OperationsBriefingModal({ isOpen, onClose }: OperationsBriefingModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

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
                Daily Farm Operations Briefing Log & Shift Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Executive Agriculture Intelligence & Parcel Field Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-agri-darkCard dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHIFT REPORT CONTAINER */}
        <div className="mt-4 print:mt-0 rounded-2xl border-2 border-emerald-900/30 p-6 bg-slate-50/50 dark:bg-agri-darkCard/50 print:bg-white print:border-2 print:border-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-emerald-800 pb-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white font-black text-xl shadow-xs print:bg-black">
                🚜
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-300 print:text-black">
                  Krishi Saarthi AI Operations Command • Punjab Agro-Hub
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white print:text-black">
                  DAILY FARM OPERATIONS SUMMARY & SHIFT LOG
                </h1>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 print:text-slate-700">
                  Certified Precision Agronomy & Automated Work Order Register
                </p>
              </div>
            </div>

            {/* QR Verification Code */}
            <div className="mt-3 sm:mt-0 flex flex-col items-center">
              <div className="h-16 w-16 rounded-xl border border-slate-300 bg-white p-1 shadow-2xs flex items-center justify-center">
                <QrCode className="h-14 w-14 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                LOG ID: OPS-2026-1102
              </span>
            </div>
          </div>

          {/* Demographics Matrix */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-black">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Farm Parcel Estate</span>
              <p className="font-extrabold text-slate-900 dark:text-white print:text-black">
                Sardar Harpreet Singh
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Acreage</span>
              <p className="font-mono font-black text-slate-900 dark:text-white print:text-black">
                31.2 Acres (4 Sectors)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Canopy Average NDVI</span>
              <p className="font-mono font-black text-emerald-600 print:text-black">
                0.78 (Vigorous Canopy)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Report Date</span>
              <p className="font-bold text-slate-900 dark:text-white print:text-black">
                02 November 2026
              </p>
            </div>
          </div>

          {/* Sector-by-Sector Status Table */}
          <div className="mt-5 overflow-x-auto">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black mb-2">
              Cadastral Sector Telemetry Status
            </h4>
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b-2 border-emerald-800 bg-emerald-100/60 text-slate-900 dark:bg-emerald-950 dark:text-emerald-200 print:bg-slate-200 print:text-black">
                  <th className="p-2.5 font-black uppercase text-[10px]">Sector</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Crop & Variety</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Area</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Moisture (VWC)</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">NDVI Vigor</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Active Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-agri-darkBorder print:divide-slate-300">
                <tr>
                  <td className="p-2 font-mono font-black">Sector A1</td>
                  <td className="p-2 font-bold">Basmati Rice (Pusa 1121)</td>
                  <td className="p-2">8.5 Ac</td>
                  <td className="p-2 font-mono text-blue-600">42%</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">0.84</td>
                  <td className="p-2 font-bold text-emerald-700">Drip Valve #1 Active</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono font-black">Sector B2</td>
                  <td className="p-2 font-bold">Wheat (HD-3086)</td>
                  <td className="p-2">12.0 Ac</td>
                  <td className="p-2 font-mono text-amber-600">34%</td>
                  <td className="p-2 font-mono font-bold text-amber-600">0.62</td>
                  <td className="p-2 font-bold text-amber-700">Fungicide Spray Dispatched</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono font-black">Sector C1</td>
                  <td className="p-2 font-bold">Bt Cotton (RCH-659)</td>
                  <td className="p-2">6.5 Ac</td>
                  <td className="p-2 font-mono text-emerald-600">38%</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">0.79</td>
                  <td className="p-2 font-bold text-slate-600">Square Stage Monitoring</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono font-black">Sector D3</td>
                  <td className="p-2 font-bold">Mustard (Pusa 25)</td>
                  <td className="p-2">4.2 Ac</td>
                  <td className="p-2 font-mono text-slate-600">30%</td>
                  <td className="p-2 font-mono font-bold text-teal-600">0.71</td>
                  <td className="p-2 font-bold text-slate-600">Pod Formation Standby</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Active Work Orders */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-black">
            <h5 className="font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
              Dispatched Autonomous Work Orders
            </h5>
            <div className="mt-2 space-y-1.5">
              <p>• <strong>WO #104 (Urgent):</strong> Foliar application of Mancozeb 75% WP on Sector B2 before 11:00 AM.</p>
              <p>• <strong>WO #105 (High):</strong> Pulse Drip Valve #3 for 45 minutes to restore root zone VWC to 40%.</p>
              <p>• <strong>WO #106 (Routine):</strong> Visual scouting of lower leaf canopy for whitefly / aphid nymphs on Sector C1.</p>
            </div>
          </div>

          {/* Punjab Govt Scheme & PAU Compliance Validation */}
          <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs dark:border-amber-500/20 dark:bg-amber-950/20 print:border-black print:bg-white">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 print:text-black">
              <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 print:text-black" />
              <h5 className="font-black uppercase tracking-wider">
                Punjab Govt Scheme DBT &amp; PAU Adherence Certification
              </h5>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5 print:text-black" />
                <span>
                  <strong>DSR ₹1,500/Ac DBT:</strong> Satellite remote sensing survey passed (Sector A1 - ₹12,750 verified).
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5 print:text-black" />
                <span>
                  <strong>APEDA Basmati Export:</strong> Zero detectable Tricyclazole / Buprofezin (EU-MRL compliant).
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5 print:text-black" />
                <span>
                  <strong>Zero Stubble CRM:</strong> In-situ Super Seeder work order logged (GoP Portal: agrimachinerypb.com).
                </span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-6 flex items-end justify-between border-t border-slate-300 pt-4 text-xs dark:border-agri-darkBorder print:border-black">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">IoT Fleet & Telemetry Health</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 print:text-black">
                All 4 Field Sensor Nodes Synchronized (RSSI: -74 dBm)
              </p>
              <p className="text-[10px] text-slate-500">Autonomous Sentinel Drone Scan: Verified</p>
            </div>

            <div className="text-right">
              <div className="h-8 font-serif italic text-sm text-emerald-800 dark:text-emerald-400 font-bold print:text-black">
                Krishi Saarthi AI Sentinel
              </div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-700 dark:text-slate-300 text-[11px] print:text-black">
                Chief Farm Operations Lead
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
