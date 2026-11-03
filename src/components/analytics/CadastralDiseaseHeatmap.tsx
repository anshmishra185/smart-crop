import { useState } from 'react'
import {
  CheckCircle2,
  Compass,
  ShieldAlert,
} from 'lucide-react'

interface ZoneRisk {
  id: string
  zoneName: string
  districts: string[]
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low'
  primaryPathogens: string[]
  infectedAcreage: number
  totalSurveyedAcres: number
  containmentStatus: 'Barricaded' | 'Active Spraying' | 'Monitoring'
  dominantCrops: string
  recommendation: string
}

const AGRO_ZONES: ZoneRisk[] = [
  {
    id: 'sub-mountainous',
    zoneName: 'Sub-Mountainous Undulating Zone',
    districts: ['Ropar (Roopnagar)', 'Hoshiarpur', 'Pathankot', 'SBS Nagar'],
    riskLevel: 'High',
    primaryPathogens: ['Yellow / Stripe Rust (Puccinia striiformis)', 'Paddy Blast (Magnaporthe oryzae)'],
    infectedAcreage: 184,
    totalSurveyedAcres: 1250,
    containmentStatus: 'Active Spraying',
    dominantCrops: 'Wheat (PBW-826), Basmati Rice, Maize',
    recommendation: 'Cool foothills micro-climate favors yellow rust spore showers from sub-Himalayan valleys. Deploy Propiconazole 25% EC barrier sprays along northern borders.',
  },
  {
    id: 'central-plain',
    zoneName: 'Central Plain Agro-Climatic Zone',
    districts: ['Ludhiana', 'Jalandhar', 'Patiala', 'Fatehgarh Sahib', 'Kapurthala'],
    riskLevel: 'Moderate',
    primaryPathogens: ['Potato Late Blight (Phytophthora infestans)', 'Wheat Spot Blight (Bipolaris sorokiniana)'],
    infectedAcreage: 96,
    totalSurveyedAcres: 2400,
    containmentStatus: 'Barricaded',
    dominantCrops: 'Potato (Kufri Pukhraj), Wheat (HD-3086), Paddy',
    recommendation: 'Canopy humidity remains optimal. Preventive Mancozeb 75% WP buffer holds pathogen progression below the 5% foliar economic injury threshold.',
  },
  {
    id: 'south-western',
    zoneName: 'South-Western Sandy Plain Zone',
    districts: ['Bathinda', 'Mansa', 'Fazilka', 'Sri Muktsar Sahib', 'Faridkot'],
    riskLevel: 'Critical',
    primaryPathogens: ['Cotton Leaf Curl Geminivirus (CLCuD)', 'Whitefly (Bemisia tabaci Vector)', 'Rhizoctonia Root Rot'],
    infectedAcreage: 290,
    totalSurveyedAcres: 1800,
    containmentStatus: 'Active Spraying',
    dominantCrops: 'Bt Cotton (RCH-659), Mustard, Wheat',
    recommendation: 'Semi-arid sandy soils and high day temperatures promote sap-sucking whitefly populations transmitting CLCuD. Coordinate regional yellow sticky trap grid.',
  },
]

export function CadastralDiseaseHeatmap() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('sub-mountainous')

  const activeZone = AGRO_ZONES.find((z) => z.id === selectedZoneId) || AGRO_ZONES[0]
  const infectionRate = Number(((activeZone.infectedAcreage / activeZone.totalSurveyedAcres) * 100).toFixed(1))

  const riskBadges = {
    Critical: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    High: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Cadastral Outbreak Heatmap & Agro-Climatic Vulnerability Clusters
            </h3>
            <p className="text-[11px] text-slate-500">
              Macro-geographical surveillance across Punjab agro-climatic sub-zones with active phytosanitary containment
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-agri-darkCard dark:text-slate-300">
          Punjab Agriculture Dept · GIS Mesh
        </span>
      </div>

      {/* Zone Selector Buttons */}
      <div className="grid gap-2 sm:grid-cols-3">
        {AGRO_ZONES.map((zone) => {
          const isSelected = zone.id === selectedZoneId
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedZoneId(zone.id)}
              className={`text-left rounded-2xl border p-3.5 transition ${
                isSelected
                  ? 'border-forest-800 bg-forest-50/60 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/30'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-slate-400">
                  ZONE {zone.id.toUpperCase().slice(0, 3)}
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase ${riskBadges[zone.riskLevel]}`}>
                  {zone.riskLevel} Risk
                </span>
              </div>
              <h4 className="mt-1.5 text-xs font-black text-slate-900 dark:text-white truncate">
                {zone.zoneName}
              </h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {zone.districts.join(', ')}
              </p>
            </button>
          )
        })}
      </div>

      {/* Selected Zone Deep Dive */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/70 pb-3 dark:border-agri-darkBorder">
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {activeZone.zoneName}
            </h4>
            <p className="text-xs text-slate-500">
              Districts: {activeZone.districts.join(' • ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <ShieldAlert className="h-3.5 w-3.5" /> Containment: {activeZone.containmentStatus}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Infected Acreage</span>
            <p className="mt-1 text-base font-black text-red-600 dark:text-red-400 font-mono">
              {activeZone.infectedAcreage} <span className="text-xs font-normal text-slate-400">/ {activeZone.totalSurveyedAcres} ac</span>
            </p>
            <span className="text-[10px] text-slate-400">{infectionRate}% disease incidence</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Dominant Host Crops</span>
            <p className="mt-1 text-xs font-black text-slate-800 dark:text-slate-200 truncate">
              {activeZone.dominantCrops}
            </p>
            <span className="text-[10px] text-slate-400">Susceptible monoculture</span>
          </div>

          <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Primary Pathogen Complex</span>
            <div className="mt-1 space-y-0.5">
              {activeZone.primaryPathogens.map((pathogen) => (
                <p key={pathogen} className="text-xs font-black text-slate-900 dark:text-white truncate">
                  • {pathogen}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Agronomic Containment Protocol */}
        <div className="rounded-xl bg-white p-3 text-xs dark:bg-agri-darkSurface border border-slate-200/80 dark:border-agri-darkBorder flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>State Agronomist Directives:</strong> {activeZone.recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}
