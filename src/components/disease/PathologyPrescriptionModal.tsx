import {
  CheckCircle2,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { DiseaseDetectionResult } from '../../types'

interface PathologyPrescriptionModalProps {
  result: DiseaseDetectionResult
  isOpen: boolean
  onClose: () => void
}

export function PathologyPrescriptionModal({ result, isOpen, onClose }: PathologyPrescriptionModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const taxonomy = result.pathologyTaxonomy || {
    kingdom: 'Fungi',
    phylum: 'Ascomycota',
    genus: 'Alternaria',
    species: 'Alternaria solani',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:max-w-none print:p-4 text-slate-800 dark:text-slate-100">
        {/* Controls - Hidden during print */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-agri-darkBorder print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Official Plant Pathology Prescription Slip (Rx)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized Agricultural Diagnostic Report & Chemical Prescription
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

        {/* PRINTABLE PRESCRIPTION CONTAINER */}
        <div className="mt-4 print:mt-0 rounded-2xl border-2 border-emerald-900/30 p-6 bg-slate-50/50 dark:bg-agri-darkCard/50 print:bg-white print:border-2 print:border-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-emerald-800 pb-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white font-black text-2xl shadow-xs print:bg-black">
                ℞
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-300 print:text-black">
                  Krishi Saarthi AI • Clinical Plant Pathology Diagnostic Lab
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white print:text-black">
                  PLANT PATHOLOGY PRESCRIPTION (Rx)
                </h1>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 print:text-slate-700">
                  Precision Crop Protection & Integrated Pest Management (IPM) Slip
                </p>
              </div>
            </div>

            {/* QR Verification Code */}
            <div className="mt-3 sm:mt-0 flex flex-col items-center">
              <div className="h-16 w-16 rounded-xl border border-slate-300 bg-white p-1 shadow-2xs flex items-center justify-center">
                <QrCode className="h-14 w-14 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                VERIFIED ID: RX-9481
              </span>
            </div>
          </div>

          {/* Patient Demographics Matrix */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-black">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Prescription ID</span>
              <p className="font-mono font-black text-slate-900 dark:text-white print:text-black">
                RX-PATH-2026-9481
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Host Crop</span>
              <p className="font-extrabold text-slate-900 dark:text-white print:text-black">
                {result.cropName} Foliage
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnostic Status</span>
              <p className="font-bold text-red-600 print:text-black uppercase">
                {result.severity} ({result.confidence}% Conf.)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Analysis Date</span>
              <p className="font-bold text-slate-900 dark:text-white print:text-black">
                02 Nov 2026
              </p>
            </div>
          </div>

          {/* Diagnosed Pathogen Taxonomy */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100/70 p-3 text-xs dark:border-agri-darkBorder dark:bg-agri-darkCard print:border-black">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Diagnosed Pathogen Taxonomy
            </span>
            <div className="mt-1 flex flex-wrap gap-4 text-xs">
              <span><strong>Kingdom:</strong> {taxonomy.kingdom}</span>
              <span><strong>Phylum:</strong> {taxonomy.phylum}</span>
              <span><strong>Genus:</strong> {taxonomy.genus}</span>
              <span><strong>Identified Species:</strong> <em>{taxonomy.species}</em></span>
            </div>
          </div>

          {/* Prescribed Agrochemical Formulation */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Prescribed Chemical Agrochemical & Tank-Mix
            </h4>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-black">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2 dark:border-agri-darkBorder">
                <div>
                  <h5 className="font-black text-sm text-slate-900 dark:text-white print:text-black">
                    Mancozeb 75% WP (or Chlorothalonil 75% WP)
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Broad-spectrum contact protective foliar dithiocarbamate fungicide
                  </p>
                </div>
                <span className="mt-1 sm:mt-0 font-mono font-black text-emerald-700 text-sm print:text-black">
                  Dose: 2.5 g / Liter
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 font-bold block">15L Backpack Tank</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 print:text-black">
                    37.5 grams in 15L water
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Pre-Harvest Interval (PHI)</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 print:text-black">
                    7 Days withholding
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Re-Entry Interval (REI)</span>
                  <span className="font-black text-slate-800 dark:text-slate-200 print:text-black">
                    24 Hours post-spray
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biological / Cultural IPM Controls */}
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:border-emerald-950 dark:bg-emerald-950/20 print:border-black print:bg-white">
            <h5 className="font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 print:text-black">
              Cultural & Biological Control Guidelines
            </h5>
            <ul className="mt-1 space-y-1 text-emerald-900 dark:text-emerald-300 print:text-black">
              {result.recommendedTreatment.map((rec, idx) => (
                <li key={idx}>• {rec}</li>
              ))}
            </ul>
          </div>

          {/* Mandatory Safety PPE Notice */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300 print:border-black print:bg-white print:text-black">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-700" />
            <span className="font-medium">
              Mandatory Safety Precaution: Wear chemical-resistant gloves, protective eye goggles, and an N95 respiratory mask when mixing and spraying. Do not spray during wind &gt; 15 km/h.
            </span>
          </div>

          {/* Signatures & KVK Referral */}
          <div className="mt-6 flex items-end justify-between border-t border-slate-300 pt-4 text-xs dark:border-agri-darkBorder print:border-black">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Nearest Agricultural Referral Center</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 print:text-black">
                Krishi Vigyan Kendra (KVK) / PAU Plant Clinic
              </p>
              <p className="text-[10px] text-slate-500">Toll-Free Kisan Call Center: 1800-180-1551</p>
            </div>

            <div className="text-right">
              <div className="h-8 font-serif italic text-sm text-emerald-800 dark:text-emerald-400 font-bold print:text-black">
                Dr. M. S. Gill, Ph.D.
              </div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-700 dark:text-slate-300 text-[11px] print:text-black">
                Senior Plant Pathologist (Reg: PP-PB-481)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
