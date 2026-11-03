import { useState } from 'react'
import {
  Printer,
  Sparkles,
  Layers
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { PrecisionDataExporter } from '../components/reports/PrecisionDataExporter'
import { UniversalDataIngestionStudio } from '../components/reports/UniversalDataIngestionStudio'
import { ApedaMrlComplianceCertificate } from '../components/reports/ApedaMrlComplianceCertificate'
import { PmfbyClaimDossier } from '../components/reports/PmfbyClaimDossier'
import { InputMaterialLedger } from '../components/reports/InputMaterialLedger'
import { ExecutiveDossierHeader } from '../components/reports/ExecutiveDossierHeader'
import { sampleDiseaseCases } from '../data/diseases'

export function ReportsPage() {
  const { weather, soilReading, selectedRegion, language, t } = useAppStore()
  const [reportDateRange, setReportDateRange] = useState('Nov 01, 2026 - Nov 02, 2026')
  const [activeTab, setActiveTab] = useState<'all' | 'export' | 'import' | 'compliance' | 'pmfby' | 'inventory'>('all')

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 print:p-0">
      {/* Top Operations Action & Navigation Bar (Screen Only) */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Enterprise FMIS &amp; Compliance Data Hub
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('reports.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            ISO 11783 (ISOBUS) prescription exporter, Climate FieldView data inbox, APEDA export phytosanitary clearance, and PMFBY insurance dossier.
          </p>
        </div>

        {/* Date Filter & Print Document Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={reportDateRange}
            onChange={(e) => setReportDateRange(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-forest-700 focus:outline-none dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
          >
            <option value="Nov 01, 2026 - Nov 02, 2026">Nov 01 - Nov 02, 2026 (Current 48h Audit)</option>
            <option value="October 2026 (Monthly Audit)">October 2026 (Monthly Audit)</option>
            <option value="Q3 2026 (Quarterly Agronomic Review)">Q3 2026 (Quarterly Review)</option>
            <option value="Rabi Season 2026-27">Rabi Season 2026-27</option>
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Printer className="h-4 w-4" /> {t('reports.printPDF')}
          </button>
        </div>
      </div>

      {/* Module Filter Tabs (Screen Only) */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          Full Executive Dossier (All 6 Modules)
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'export'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          1. Precision Exporter (ISO-XML)
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'import'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          2. Data Inbox (Lab &amp; Drone)
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'compliance'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          3. APEDA &amp; MRL Residue
        </button>
        <button
          onClick={() => setActiveTab('pmfby')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'pmfby'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          4. PMFBY Insurance Claim
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'inventory'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          5. Inventory &amp; Carbon Offsets
        </button>
      </div>

      {/* Module 6: Executive Watermarked Header & Multilingual Spoken Debrief (Always shown at top) */}
      <ExecutiveDossierHeader
        reportRef="CD-2026-NOV-8941"
        dateRange={reportDateRange}
        selectedRegion={selectedRegion}
        totalAcreageAudited={2402}
        healthyRatio={76.6}
        soilHealthScore={soilReading.fertilityScore}
        activeCasesCount={sampleDiseaseCases.length}
        currentLang={language}
      />

      {/* Module 1: Precision Exporter */}
      {(activeTab === 'all' || activeTab === 'export') && (
        <PrecisionDataExporter />
      )}

      {/* Module 2: Telemetry Ingestion Studio */}
      {(activeTab === 'all' || activeTab === 'import') && (
        <UniversalDataIngestionStudio />
      )}

      {/* Module 3: APEDA & Phytosanitary Residue Certificate */}
      {(activeTab === 'all' || activeTab === 'compliance') && (
        <ApedaMrlComplianceCertificate />
      )}

      {/* Module 4: PMFBY Crop Insurance Claim Dossier */}
      {(activeTab === 'all' || activeTab === 'pmfby') && (
        <PmfbyClaimDossier />
      )}

      {/* Module 5: Input Material Mass Balance & Carbon Offsets */}
      {(activeTab === 'all' || activeTab === 'inventory') && (
        <InputMaterialLedger />
      )}

      {/* Soil Physico-Chemical Lab Reference Table (Printable Appendix) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Appendix A · Chemosensory Benchmarks
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Soil Physico-Chemical &amp; Agro-Climatic Baseline
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Weather Station: {selectedRegion} ({weather.temp}°C · {weather.humidity}% RH)
          </span>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
              <tr>
                <th className="p-3">Parameter</th>
                <th className="p-3">Measured Lab Value</th>
                <th className="p-3">ICAR Target Range</th>
                <th className="p-3">Agronomic Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
              <tr>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Soil Reaction (pH)</td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{soilReading.ph}</td>
                <td className="p-3 text-slate-500">6.0 - 7.5</td>
                <td className="p-3 font-bold text-emerald-600">Optimal Neutral</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Available Nitrogen (N)</td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{soilReading.nitrogen} kg/ha</td>
                <td className="p-3 text-slate-500">100 - 140 kg/ha</td>
                <td className="p-3 font-bold text-emerald-600">Sufficient</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Available Phosphorus (P)</td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{soilReading.phosphorus} kg/ha</td>
                <td className="p-3 text-slate-500">35 - 60 kg/ha</td>
                <td className="p-3 font-bold text-emerald-600">Optimal</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Available Potassium (K)</td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{soilReading.potassium} kg/ha</td>
                <td className="p-3 text-slate-500">150 - 220 kg/ha</td>
                <td className="p-3 font-bold text-emerald-600">High Reserve</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Organic Carbon (OC)</td>
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{soilReading.organicCarbon}%</td>
                <td className="p-3 text-slate-500">&gt; 0.75%</td>
                <td className="p-3 font-bold text-amber-600">Moderate · FYM Topdress Recommended</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer print note */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3 dark:border-agri-darkBorder">
          <p>© 2026 Krishi Saarthi · Enterprise Precision Farm Management Information System (FMIS)</p>
          <p className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> End of Certified Agronomic Audit Dossier
          </p>
        </div>
      </div>
    </div>
  )
}
