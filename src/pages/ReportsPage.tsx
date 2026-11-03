import {
  FileSpreadsheet,
  FileText,
  Printer,
} from 'lucide-react'
import { useState } from 'react'
import { sampleDiseaseCases } from '../data/diseases'
import { useAppStore } from '../store/useAppStore'

export function ReportsPage() {
  const { weather, soilReading, selectedRegion, lastDiagnosis, t } = useAppStore()
  const [reportDateRange, setReportDateRange] = useState('Nov 01, 2026 - Nov 02, 2026')

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const rows = [
      ['Report Category', 'Metric', 'Value', 'Status'],
      ['Crop Health', 'Total Monitored Acres', '2,402 Acres', 'Active'],
      ['Crop Health', 'Healthy Acreage', '1,840 Acres (76.6%)', 'Optimal'],
      ['Crop Health', 'Infected Plots', '380 Acres (15.8%)', 'Under Treatment'],
      ['Soil Health', 'Soil Fertility Score', `${soilReading.fertilityScore} / 100`, soilReading.qualityStatus],
      ['Soil Health', 'Soil pH', `${soilReading.ph}`, 'Tested'],
      ['Soil Health', 'Nitrogen (N)', `${soilReading.nitrogen} kg/ha`, 'Monitored'],
      ['Soil Health', 'Phosphorus (P)', `${soilReading.phosphorus} kg/ha`, 'Monitored'],
      ['Soil Health', 'Potassium (K)', `${soilReading.potassium} kg/ha`, 'Monitored'],
      ['Weather', 'Zone', selectedRegion, 'Logged'],
      ['Weather', 'Ambient Temperature', `${weather.temp}°C`, weather.condition],
      ['Weather', 'Rainfall Probability', `${weather.rainfallProb}%`, weather.rainfallProb > 40 ? 'Wet' : 'Dry'],
      ['Latest AI Pathology', 'Crop / Disease', `${lastDiagnosis?.cropName}: ${lastDiagnosis?.diseaseName}`, `${lastDiagnosis?.confidence}% Confidence`],
    ]

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `crop_doctor_audit_report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 print:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('reports.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('reports.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('reports.subtitle')}
          </p>
        </div>

        {/* Export & Print Buttons & Date Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={reportDateRange}
            onChange={(e) => setReportDateRange(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-forest-700 focus:outline-none dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
          >
            <option value="Nov 01, 2026 - Nov 02, 2026">Nov 01 - Nov 02, 2026 (Current 48h)</option>
            <option value="October 2026 (Monthly Audit)">October 2026 (Monthly Audit)</option>
            <option value="Q3 2026 (Quarterly Agronomic Review)">Q3 2026 (Quarterly Review)</option>
            <option value="Kharif Season 2026">Kharif Season 2026</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> {t('reports.exportCSV')}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 dark:bg-emerald-600"
          >
            <Printer className="h-4 w-4" /> {t('reports.printPDF')}
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:p-0 space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-200 pb-6 dark:border-agri-darkBorder gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-800 text-white font-black text-sm">
                CD
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Crop Doctor AI — Agronomic Intelligence Audit
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Estate Sector: Ludhiana Central Plot (120 Acres) · Agro-Climatic Zone: {selectedRegion}
            </p>
          </div>

          <div className="text-right text-xs">
            <p className="font-extrabold text-slate-900 dark:text-white">Report Reference: CD-2026-NOV-8941</p>
            <p className="text-slate-400 mt-0.5">Date Range: {reportDateRange}</p>
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
              Auditor: Ansh Mishra (Lead Agronomist)
            </p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            1. Executive Estate Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Monitored</span>
              <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">2,402 Acres</p>
              <span className="text-[11px] text-emerald-600 font-bold">100% telemetry coverage</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Healthy Ratio</span>
              <p className="mt-1 text-xl font-black text-emerald-700 dark:text-emerald-400">76.6%</p>
              <span className="text-[11px] text-slate-500">1,840 Acres certified</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Soil Health Score</span>
              <p className="mt-1 text-xl font-black text-forest-800 dark:text-emerald-300">
                {soilReading.fertilityScore} / 100
              </p>
              <span className="text-[11px] text-slate-500">{soilReading.qualityStatus} status</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Active Pathologies</span>
              <p className="mt-1 text-xl font-black text-amber-600">380 Cases</p>
              <span className="text-[11px] text-slate-500">Controlled containment</span>
            </div>
          </div>
        </div>

        {/* Section 2: Soil Physico-Chemical Breakdown */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            2. Soil Chemistry &amp; NPK Lab Audit
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Measured Value</th>
                  <th className="p-3">Agronomic Target</th>
                  <th className="p-3">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
                <tr>
                  <td className="p-3 font-bold">Soil Reaction (pH)</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{soilReading.ph}</td>
                  <td className="p-3 text-slate-500">6.0 - 7.5</td>
                  <td className="p-3 font-bold text-emerald-600">Optimal Neutral</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Available Nitrogen (N)</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{soilReading.nitrogen} kg/ha</td>
                  <td className="p-3 text-slate-500">100 - 140 kg/ha</td>
                  <td className="p-3 font-bold text-emerald-600">Sufficient</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Available Phosphorus (P)</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{soilReading.phosphorus} kg/ha</td>
                  <td className="p-3 text-slate-500">35 - 60 kg/ha</td>
                  <td className="p-3 font-bold text-emerald-600">Optimal</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Available Potassium (K)</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{soilReading.potassium} kg/ha</td>
                  <td className="p-3 text-slate-500">150 - 220 kg/ha</td>
                  <td className="p-3 font-bold text-emerald-600">High Reserve</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Organic Carbon (OC)</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{soilReading.organicCarbon}%</td>
                  <td className="p-3 text-slate-500">&gt; 0.75%</td>
                  <td className="p-3 font-bold text-amber-600">Moderate · FYM Advised</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Diagnostic Pathology Audit Log */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            3. AI Computer Vision Diagnostic History (Sample Trail)
          </h3>
          <div className="space-y-3">
            {sampleDiseaseCases.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.cropName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-forest-800 dark:text-emerald-400">{item.diseaseName}</span>
                  </div>
                  <p className="mt-1 text-slate-500 leading-relaxed">
                    Prescription: {item.recommendedTreatment[0]}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {item.confidence}% Confidence
                  </span>
                  <p className="mt-1 text-[10px] text-slate-400">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signoff Footer */}
        <div className="border-t border-slate-200 pt-6 dark:border-agri-darkBorder flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 Crop Doctor AI · Enterprise Precision Agriculture Platform</p>
          <p>Generated dynamically via simulated client telemetry</p>
        </div>
      </div>
    </div>
  )
}

