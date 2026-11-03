import { useState } from 'react'
import {
  ShieldCheck,
  QrCode,
  AlertCircle,
  FileBadge2,
  ExternalLink,
  Info
} from 'lucide-react'

export interface ChemicalResidueCheck {
  chemicalName: string
  activeIngredient: string
  detectedPpm: number
  euMrlPpm: number
  fssaiMrlPpm: number
  phiDaysRequired: number
  phiDaysElapsed: number
  isCompliant: boolean
}

const RESIDUE_RECORDS: ChemicalResidueCheck[] = [
  {
    chemicalName: 'Amistar Top (Azoxystrobin + Difenoconazole)',
    activeIngredient: 'Azoxystrobin (QoI FRAC 11)',
    detectedPpm: 0.004,
    euMrlPpm: 0.01,
    fssaiMrlPpm: 0.05,
    phiDaysRequired: 21,
    phiDaysElapsed: 26,
    isCompliant: true,
  },
  {
    chemicalName: 'Bavistin (Carbendazim 50% WP)',
    activeIngredient: 'Carbendazim (MBC FRAC 1)',
    detectedPpm: 0.001,
    euMrlPpm: 0.01,
    fssaiMrlPpm: 0.10,
    phiDaysRequired: 28,
    phiDaysElapsed: 34,
    isCompliant: true,
  },
  {
    chemicalName: 'Beam (Tricyclazole 75% WP)',
    activeIngredient: 'Tricyclazole (MBI-D FRAC 16.1)',
    detectedPpm: 0.008,
    euMrlPpm: 0.01,
    fssaiMrlPpm: 0.05,
    phiDaysRequired: 30,
    phiDaysElapsed: 32,
    isCompliant: true,
  },
  {
    chemicalName: 'Dursban (Chlorpyrifos 20% EC)',
    activeIngredient: 'Chlorpyrifos (Organophosphate)',
    detectedPpm: 0.000,
    euMrlPpm: 0.01,
    fssaiMrlPpm: 0.05,
    phiDaysRequired: 30,
    phiDaysElapsed: 45,
    isCompliant: true,
  },
]

export function ApedaMrlComplianceCertificate() {
  const [showQrModal, setShowQrModal] = useState(false)
  const [targetCrop, setTargetCrop] = useState<'Basmati 1121 Paddy' | 'Bt Cotton' | 'Table Grapes'>('Basmati 1121 Paddy')

  const totalCompliant = RESIDUE_RECORDS.filter((r) => r.isCompliant).length
  const allClear = totalCompliant === RESIDUE_RECORDS.length

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                APEDA &amp; GlobalGAP Phytosanitary Verification
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                FSSAI / EU-MRL Verified
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Phytosanitary Chemical Residue (MRL) Export Certificate
            </h2>
          </div>
        </div>

        {/* Crop Selection & Batch ID */}
        <div className="flex items-center gap-2">
          <select
            value={targetCrop}
            onChange={(e) => setTargetCrop(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
          >
            <option value="Basmati 1121 Paddy">Basmati 1121 Paddy (EU Consignment)</option>
            <option value="Bt Cotton">Bt Cotton (Export Grade 29mm)</option>
            <option value="Table Grapes">Export Table Grapes</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            APEDA Export Clearance
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-black text-emerald-800 dark:text-emerald-300">
              {allClear ? 'CERTIFIED CLEAN' : 'REVIEW NEEDED'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            0 MRL violations detected across {RESIDUE_RECORDS.length} audited chemical assays.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Strict EU-MRL Threshold
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">&lt; 0.010 mg/kg</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Tricyclazole &amp; Azoxystrobin within European Commission limits.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Digital Traceability QR
            </span>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              Batch #APEDA-PB-8941
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">Cryptographically Signed</span>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1 rounded-xl bg-forest-800 px-3 py-2 text-xs font-extrabold text-white shadow hover:bg-forest-900 transition dark:bg-emerald-600"
          >
            <QrCode className="h-4 w-4" /> View QR
          </button>
        </div>
      </div>

      {/* Chemical Residue Assay Table */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FileBadge2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Audited Agrochemical Assay &amp; Pre-Harvest Interval (PHI) Compliance
          </span>
          <span className="text-[11px] text-slate-400">Standard Test Protocol: GC-MS / LC-MS-MS</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
              <tr>
                <th className="p-2.5">Agrochemical Molecule</th>
                <th className="p-2.5">Detected Residue</th>
                <th className="p-2.5">EU Limit (mg/kg)</th>
                <th className="p-2.5">FSSAI Limit (mg/kg)</th>
                <th className="p-2.5">PHI Elapsed</th>
                <th className="p-2.5">Export Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
              {RESIDUE_RECORDS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-2.5">
                    <p className="font-bold text-slate-900 dark:text-white">{item.chemicalName}</p>
                    <p className="text-[10px] text-slate-400">{item.activeIngredient}</p>
                  </td>
                  <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.detectedPpm.toFixed(3)} mg/kg
                  </td>
                  <td className="p-2.5 font-mono text-slate-500">{item.euMrlPpm.toFixed(2)}</td>
                  <td className="p-2.5 font-mono text-slate-500">{item.fssaiMrlPpm.toFixed(2)}</td>
                  <td className="p-2.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {item.phiDaysElapsed}d
                    </span>{' '}
                    <span className="text-[10px] text-slate-400">(Req: {item.phiDaysRequired}d)</span>
                  </td>
                  <td className="p-2.5">
                    {item.isCompliant ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <ShieldCheck className="h-3 w-3" /> PASS (Compliant)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
                        <AlertCircle className="h-3 w-3" /> HOLD BATCH
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GlobalGAP Footer Notice */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-50/50 p-3 dark:bg-emerald-950/20 text-xs border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 text-[11px]">
              Certified for EU Port of Rotterdam and UK Tilbury phytosanitary border clearance. GGN: 4059883719012.
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            APEDA RCMC #PUN-AG-2026-89
          </span>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface text-center">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              APEDA Digital Traceability Passport
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Scan to inspect field geo-coordinates, MRL assay certificate, and harvest lot.
            </p>

            <div className="mt-4 flex justify-center">
              {/* Simulated QR Code SVG */}
              <div className="rounded-2xl border-4 border-slate-900 bg-white p-3 shadow-inner">
                <svg className="h-44 w-44" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="28" height="28" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="#0f172a" />

                  <rect x="67" y="5" width="28" height="28" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="#0f172a" />

                  <rect x="5" y="67" width="28" height="28" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="#0f172a" />

                  {/* QR Pattern dots */}
                  <rect x="40" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="50" y="12" width="8" height="6" fill="#0f172a" />
                  <rect x="42" y="24" width="8" height="6" fill="#0f172a" />
                  <rect x="8" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="22" y="46" width="10" height="6" fill="#0f172a" />
                  <rect x="40" y="40" width="20" height="20" fill="#059669" />
                  <rect x="68" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="82" y="50" width="8" height="6" fill="#0f172a" />
                  <rect x="44" y="68" width="6" height="12" fill="#0f172a" />
                  <rect x="56" y="76" width="10" height="6" fill="#0f172a" />
                  <rect x="72" y="72" width="18" height="18" fill="#0f172a" />
                </svg>
              </div>
            </div>

            <div className="mt-3 text-left bg-slate-50 p-3 rounded-xl dark:bg-agri-darkCard text-[11px] space-y-1">
              <p className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Estate:</strong> Punjab Smart Agronomy Sector A1
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Batch:</strong> BAS-1121-EXP-2026
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Geo-Coordinates:</strong> 30.9010° N, 75.8573° E
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-300 dark:bg-agri-darkCard dark:text-slate-200 transition"
              >
                Close
              </button>
              <a
                href="https://agriexchange.apeda.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 w-full rounded-xl bg-forest-800 px-4 py-2 text-xs font-bold text-white hover:bg-forest-900 dark:bg-emerald-600 transition"
              >
                Verify on APEDA <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

