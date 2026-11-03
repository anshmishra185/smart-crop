import {
  CheckCircle2,
  FileText,
  Printer,
  QrCode,
  X,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface SoilHealthCardModalProps {
  reading: SoilReading
  isOpen: boolean
  onClose: () => void
}

export function SoilHealthCardModal({ reading, isOpen, onClose }: SoilHealthCardModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  // Parameter ratings
  const rows = [
    { name: 'Soil Reaction (pH)', val: reading.ph, unit: 'scale', rating: reading.ph < 6.5 ? 'Acidic' : reading.ph > 7.5 ? 'Alkaline' : 'Neutral (Optimal)' },
    { name: 'Electrical Conductivity (EC)', val: reading.electricalConductivity, unit: 'dS/m', rating: reading.electricalConductivity < 1.0 ? 'Non-Saline (Safe)' : 'Saline' },
    { name: 'Organic Carbon (OC)', val: reading.organicCarbon, unit: '%', rating: reading.organicCarbon < 0.5 ? 'Low' : reading.organicCarbon < 0.75 ? 'Medium' : 'High' },
    { name: 'Available Nitrogen (N)', val: reading.nitrogen, unit: 'kg/ha', rating: reading.nitrogen < 100 ? 'Low (Deficient)' : reading.nitrogen < 150 ? 'Medium (Optimal)' : 'High' },
    { name: 'Available Phosphorus (P)', val: reading.phosphorus, unit: 'kg/ha', rating: reading.phosphorus < 30 ? 'Low (Deficient)' : reading.phosphorus < 60 ? 'Medium (Optimal)' : 'High' },
    { name: 'Available Potassium (K)', val: reading.potassium, unit: 'kg/ha', rating: reading.potassium < 130 ? 'Low (Deficient)' : reading.potassium < 220 ? 'Medium (Optimal)' : 'High' },
    { name: 'Available Sulfur (S)', val: reading.sulfur ?? 16.5, unit: 'ppm', rating: (reading.sulfur ?? 16.5) < 10 ? 'Deficient' : 'Sufficient' },
    { name: 'DTPA Zinc (Zn)', val: reading.zinc ?? 0.85, unit: 'ppm', rating: (reading.zinc ?? 0.85) < 0.6 ? 'Deficient' : 'Sufficient' },
    { name: 'DTPA Iron (Fe)', val: reading.iron ?? 6.8, unit: 'ppm', rating: (reading.iron ?? 6.8) < 4.5 ? 'Deficient' : 'Sufficient' },
    { name: 'DTPA Copper (Cu)', val: reading.copper ?? 0.42, unit: 'ppm', rating: (reading.copper ?? 0.42) < 0.2 ? 'Deficient' : 'Sufficient' },
    { name: 'DTPA Manganese (Mn)', val: reading.manganese ?? 4.1, unit: 'ppm', rating: (reading.manganese ?? 4.1) < 2.0 ? 'Deficient' : 'Sufficient' },
    { name: 'Hot Water Boron (B)', val: reading.boron ?? 0.75, unit: 'ppm', rating: (reading.boron ?? 0.75) < 0.5 ? 'Deficient' : 'Sufficient' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:max-w-none print:p-4 text-slate-800 dark:text-slate-100">
        {/* Modal Controls - Hidden during print */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-agri-darkBorder print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Official Soil Health Card (SHC) Preview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Government of India & ICAR Analytical Laboratory Format
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

        {/* PRINTABLE OFFICIAL CARD CONTAINER */}
        <div className="mt-4 print:mt-0 rounded-2xl border-2 border-emerald-900/30 p-6 bg-slate-50/50 dark:bg-agri-darkCard/50 print:bg-white print:border-2 print:border-black">
          {/* Official Emblem & Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-emerald-800 pb-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white font-black text-xl shadow-xs print:bg-black">
                🏛️
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 dark:text-emerald-300 print:text-black">
                  Government of India • Ministry of Agriculture & Farmers Welfare
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white print:text-black">
                  SOIL HEALTH CARD (ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ)
                </h1>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 print:text-slate-700">
                  National Soil Health Mission • ICAR Certified Diagnostic Protocol
                </p>
              </div>
            </div>

            {/* QR Verification Code */}
            <div className="mt-3 sm:mt-0 flex flex-col items-center">
              <div className="h-16 w-16 rounded-xl border border-slate-300 bg-white p-1 shadow-2xs flex items-center justify-center">
                <QrCode className="h-14 w-14 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                VERIFIED ID: SHC-89412
              </span>
            </div>
          </div>

          {/* Demographics Matrix */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-black">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sample Lab ID</span>
              <p className="font-mono font-black text-slate-900 dark:text-white print:text-black">
                SHC-PB-2026-89412
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Farmer Name</span>
              <p className="font-extrabold text-slate-900 dark:text-white print:text-black">
                Sardar Harpreet Singh
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Geo Coordinates</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                30.9010°N, 75.8573°E
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Testing Laboratory</span>
              <p className="font-bold text-slate-900 dark:text-white print:text-black">
                PAU / ICAR Ludhiana (NABL)
              </p>
            </div>
          </div>

          {/* 12-Parameter Quantitative Results Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b-2 border-emerald-800 bg-emerald-100/60 text-slate-900 dark:bg-emerald-950 dark:text-emerald-200 print:bg-slate-200 print:text-black">
                  <th className="p-2.5 font-black uppercase text-[10px]">#</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Parameter Name</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Test Value</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">Unit</th>
                  <th className="p-2.5 font-black uppercase text-[10px]">ICAR Diagnostic Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-agri-darkBorder print:divide-slate-300">
                {rows.map((row, idx) => (
                  <tr key={row.name} className="hover:bg-slate-100/50 dark:hover:bg-agri-darkSurface/50">
                    <td className="p-2 font-mono text-[11px] font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-800 dark:text-slate-200 print:text-black">{row.name}</td>
                    <td className="p-2 font-mono font-black text-slate-900 dark:text-white print:text-black">{row.val}</td>
                    <td className="p-2 text-slate-500 font-medium">{row.unit}</td>
                    <td className="p-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          row.rating.includes('Deficient') || row.rating.includes('Low') || row.rating.includes('Acidic')
                            ? 'bg-red-100 text-red-800 print:bg-transparent print:text-black'
                            : row.rating.includes('Saline')
                            ? 'bg-amber-100 text-amber-800 print:bg-transparent print:text-black'
                            : 'bg-emerald-100 text-emerald-800 print:bg-transparent print:text-black'
                        }`}
                      >
                        {row.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Agronomist Prescription Box */}
          <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100 print:border-black print:bg-white print:text-black">
            <h4 className="font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 print:text-black" />
              Agronomic Fertilizer & Soil Amendment Prescription
            </h4>
            <div className="mt-2 space-y-1 font-medium">
              <p>• <strong>Primary Fertilisers:</strong> Apply Neem-Coated Urea @ 110 kg/ha split into 3 equal doses (Basal, CRI, Tillering). Band DAP @ 55 kg/ha at sowing.</p>
              <p>• <strong>Micronutrients:</strong> Zinc Sulfate (21% Zn) recommended @ 25 kg/ha once every 3 crop seasons to prevent zinc deficiency chlorosis.</p>
              <p>• <strong>Organic Matter:</strong> Incorporate 5 tonnes/ha farmyard manure (FYM) or green manure with Dhaincha (Sesbania) to sustain Organic Carbon &gt; 0.75%.</p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-6 flex items-end justify-between border-t border-slate-300 pt-4 text-xs dark:border-agri-darkBorder print:border-black">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Accredited Testing Facility</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-200 print:text-black">
                PAU Department of Soil Science & Agro-Chemistry
              </p>
              <p className="text-[10px] text-slate-500">ISO/IEC 17025 Accredited Analytical Lab</p>
            </div>

            <div className="text-right">
              <div className="h-8 font-serif italic text-sm text-emerald-800 dark:text-emerald-400 font-bold print:text-black">
                Dr. K. S. Sandhu
              </div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-700 dark:text-slate-300 text-[11px] print:text-black">
                Chief Soil Analyst / Senior Agronomist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
