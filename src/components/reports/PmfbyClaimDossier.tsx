import { useState } from 'react'
import {
  FileText,
  Camera,
  Satellite,
  CloudRain,
  CheckCircle2,
  UserCheck
} from 'lucide-react'

export interface PmfbyClaimDetails {
  policyNumber: string
  farmerName: string
  aadhaarHash: string
  cropName: string
  sumInsuredPerAcre: number
  historicalYieldQtl: number
  actualYieldEstimateQtl: number
  lossPercentage: number
  causeOfDamage: string
  damageDate: string
  surveyorAssigned: string
  claimStatus: 'Survey Complete' | 'Under Audit' | 'Claim Disbursed'
}

const DEFAULT_CLAIM: PmfbyClaimDetails = {
  policyNumber: 'PMFBY-PB-RABI-2026-98124',
  farmerName: 'S. Gurpreet Singh (Ludhiana Parcel Cluster)',
  aadhaarHash: 'XXXX-XXXX-4912',
  cropName: 'HD-3086 Wheat (Sector B2 - 12.0 Acres)',
  sumInsuredPerAcre: 48000,
  historicalYieldQtl: 22.5,
  actualYieldEstimateQtl: 13.0,
  lossPercentage: 42.2,
  causeOfDamage: 'Localized Inundation + Yellow Rust (Puccinia striiformis)',
  damageDate: 'Oct 28, 2026',
  surveyorAssigned: 'Er. Rajeshwar Varma (Agriculture Dept Punjab)',
  claimStatus: 'Survey Complete',
}

export function PmfbyClaimDossier() {
  const [claim] = useState<PmfbyClaimDetails>(DEFAULT_CLAIM)
  const [lossPct, setLossPct] = useState<number>(claim.lossPercentage)

  // Recalculate compensation dynamically based on loss percentage slider
  const totalInsuredSum = claim.sumInsuredPerAcre * 12.0 // 12 Acres
  const estimatedCompensation = Math.round((totalInsuredSum * (lossPct / 100)))

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Ministry of Agriculture &amp; Farmers Welfare
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                PMFBY Automated Claim Engine
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              PMFBY Crop Insurance Loss Assessment &amp; Claim Dossier
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Policy Active: {claim.policyNumber}
          </span>
        </div>
      </div>

      {/* Actuarial Metrics Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Sum Insured (12.0 Ac)
          </span>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            ₹{totalInsuredSum.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500">₹{claim.sumInsuredPerAcre.toLocaleString('en-IN')} / Acre</span>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Evaluated Shortfall
            </span>
            <span className="text-xs font-black text-amber-800 dark:text-amber-300">
              {lossPct.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-xl font-black text-amber-800 dark:text-amber-400">
            -9.5 Qtl/Acre
          </p>
          <span className="text-[11px] text-slate-500">Actual 13.0 vs Threshold 22.5 Qtl</span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Projected Payout
          </span>
          <p className="mt-1 text-xl font-black text-emerald-800 dark:text-emerald-300">
            ₹{estimatedCompensation.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">Direct DBT to Bank A/C</span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Insurance Surveyor
          </span>
          <p className="mt-1 text-xs font-black text-slate-900 dark:text-white truncate">
            {claim.surveyorAssigned}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <UserCheck className="h-3.5 w-3.5" /> Biometrically Certified
          </span>
        </div>
      </div>

      {/* Interactive Claim Adjuster Slider */}
      <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard border border-slate-100 dark:border-agri-darkBorder">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Interactive Crop Cutting Experiment (CCE) Yield Shortfall Simulator:
          </span>
          <span className="font-mono font-black text-forest-800 dark:text-emerald-400">
            {lossPct.toFixed(1)}% Assessed Damage
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="80"
          step="0.5"
          value={lossPct}
          onChange={(e) => setLossPct(parseFloat(e.target.value))}
          className="w-full accent-forest-800 dark:accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>10% (Minor Spotting)</span>
          <span>42.2% (Field Surveyed Baseline)</span>
          <span>80% (Severe Catastrophic Loss)</span>
        </div>
      </div>

      {/* Surveyor Evidence Package */}
      <div className="mt-5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          Institutional Evidence Package &amp; Remote Sensing Verification
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Evidence 1: Geotagged Ground Photo */}
          <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-agri-darkBorder bg-white dark:bg-agri-darkSurface">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Geotagged Photo Verification</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-snug">
              2 high-resolution photos captured via PMFBY Crop App with embedded EXIF GPS coordinates (30.9010° N, 75.8573° E).
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> EXIF Timestamp &amp; Azimuth Authenticated
            </div>
          </div>

          {/* Evidence 2: Sentinel-2 NDVI Anomaly */}
          <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-agri-darkBorder bg-white dark:bg-agri-darkSurface">
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-sky-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Satellite NDVI Anomaly Diff</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-snug">
              Sentinel-2 MSI pass indicates a 0.28 drop in canopy index from normal 0.74, confirming vegetative stress.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-sky-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Earth Observation Cross-Referenced
            </div>
          </div>

          {/* Evidence 3: Local AWS Weather Station */}
          <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-agri-darkBorder bg-white dark:bg-agri-darkSurface">
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">AWS Rainfall Telemetry</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-snug">
              Ludhiana Block Automatic Weather Station recorded 68mm rain over 4 hours on Oct 28, exceeding localized flood threshold.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Weather Index Trigger Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
