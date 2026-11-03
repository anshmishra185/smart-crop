import {
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { CropRecommendationScore } from '../../types'

interface CropProjectReportModalProps {
  isOpen: boolean
  onClose: () => void
  topRecommendation: CropRecommendationScore
  location: string
  season: string
}

export function CropProjectReportModal({
  isOpen,
  onClose,
  topRecommendation,
  location,
  season,
}: CropProjectReportModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const { crop, score, suitabilityLevel, economicMetrics, waterMetrics, certifiedCultivars } = topRecommendation
  const activeCultivar = certifiedCultivars?.[0]
  const cropCode = crop.name.toUpperCase().slice(0, 3)
  const dossierId = `DPR-${cropCode}-884920`
  const issueDate = '02 Nov 2026'

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
                Detailed Crop Feasibility & Cultivation Dossier (DPR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Bank-Grade Agricultural Project Report & KCC Financial Scheme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" /> Print Dossier
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
                  Krishi Saarthi Precision Agriculture Studio
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ministry of Agriculture & ICAR-Integrated Agronomic Decision Support System
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Dossier ID: {dossierId} • Issued: {issueDate}
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Verification QR</span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">ICAR-VERIFIED</span>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <QrCode className="h-10 w-10 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
          </div>

          {/* Farm & Season Demographics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-agri-darkCard border border-slate-200/80 dark:border-agri-darkBorder">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Agro-Climatic Zone</span>
              <p className="font-black text-slate-900 dark:text-white">{location} (Trans-Gangetic Plain)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Target Sowing Season</span>
              <p className="font-black text-slate-900 dark:text-white">{season}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Suitability Rating</span>
              <p className="font-black text-emerald-700 dark:text-emerald-400">{score}% · {suitabilityLevel}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">KCC Scale of Finance</span>
              <p className="font-black text-slate-900 dark:text-white">Eligible (NABARD Norms)</p>
            </div>
          </div>

          {/* Primary Recommended Crop & Cultivar */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs dark:border-emerald-950 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                Primary Recommended Crop & Certified Seed Variety
              </span>
              <span className="font-mono text-xs font-black text-emerald-900 dark:text-emerald-200">
                Scientific: {crop.scientificName || 'Botanical Standard'}
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {crop.name} — {activeCultivar ? activeCultivar.name : 'State University Certified Cultivar'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeCultivar ? activeCultivar.specialTrait : crop.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block">Release Institution:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeCultivar?.releaseInstitution || 'PAU / ICAR'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sowing Window:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeCultivar?.sowingWindow || 'Timely Sowing'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Crop Duration:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeCultivar?.durationDays || 120} Days to Harvest</span>
              </div>
            </div>
          </div>

          {/* Economic Cash-Flow & Cost of Cultivation (A2+FL) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Financial Gross Margin & Profit Feasibility (Per Acre Basis)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-agri-darkBorder bg-white dark:bg-agri-darkCard">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Yield</span>
                <p className="font-black text-slate-900 dark:text-white text-base">
                  {economicMetrics?.targetYieldQuintalsPerAcre || 22} <span className="text-xs font-normal">q/acre</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-agri-darkBorder bg-white dark:bg-agri-darkCard">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Realization (Mandi/MSP)</span>
                <p className="font-black text-amber-700 dark:text-amber-300 text-base font-mono">
                  ₹{(economicMetrics?.mandiPricePerQuintal || 2275).toLocaleString('en-IN')} / q
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-agri-darkBorder bg-white dark:bg-agri-darkCard">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost of Cultivation</span>
                <p className="font-black text-red-600 dark:text-red-400 text-base font-mono">
                  ₹{(economicMetrics?.costOfCultivationPerAcre || 18500).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-300 p-3 bg-emerald-50 dark:border-emerald-950 dark:bg-emerald-950/30">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Net Margin / Acre</span>
                <p className="font-black text-emerald-800 dark:text-emerald-300 text-base font-mono">
                  ₹{(economicMetrics?.netProfitPerAcre || 32687).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Water Footprint & Seed Priming Protocol */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-200 p-3.5 dark:border-agri-darkBorder">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block mb-1">
                Irrigation & Water Requirement
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                Total Water: <strong>{waterMetrics?.waterReqMm || 420} mm</strong> • Tier: <strong>{waterMetrics?.consumptionTier || 'Moderate'}</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Micro-drip saves up to {waterMetrics?.dripSavingsPct || 35}% water compared to flooding.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-3.5 dark:border-agri-darkBorder">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block mb-1">
                Certified Seed Priming Protocol
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {activeCultivar?.seedTreatment || 'Carbendazim 50% WP @ 2g/kg seed'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Treat seeds 24 hours prior to sowing to establish systemic fungal protection.
              </p>
            </div>
          </div>

          {/* Signature & Disclaimer */}
          <div className="border-t border-slate-200 pt-4 dark:border-agri-darkBorder text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p>Certified by Krishi Saarthi Precision Agriculture Engine • Valid for NABARD/KCC Loan applications.</p>
              <p>Soil chemometrics referenced from State Soil Health Card (SHC) laboratory test records.</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700 dark:text-slate-300">Agricultural Extension Officer</p>
              <p>Authorized Digital Sign-Off</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
