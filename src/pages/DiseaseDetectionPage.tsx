import {
  CheckCircle2,
  RefreshCw,
  Scan,
  ScanEye,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { sampleDiseaseCases } from '../data/diseases'
import { mockDiseaseService } from '../services/mockDiseaseService'
import { useAppStore } from '../store/useAppStore'
import type { DiseaseDetectionResult } from '../types'
import { DiagnosticComparisonSlider } from '../components/disease/DiagnosticComparisonSlider'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import { getDiseaseAudioNarrative } from '../lib/advisorySpeech'

export function DiseaseDetectionPage() {
  const { lastDiagnosis, setLastDiagnosis, t } = useAppStore()

  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [selectedSampleId, setSelectedSampleId] = useState<string>('case-tomato-early-blight')

  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState<string>('')
  const [scanPercent, setScanPercent] = useState<number>(0)
  const [result, setResult] = useState<DiseaseDetectionResult | null>(lastDiagnosis)

  // Drag-and-drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const previewUrl = URL.createObjectURL(file)
      setUploadedImage(previewUrl)
      setUploadedFileName(file.name)
      setSelectedSampleId('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  // Load sample case
  const handleSelectSample = (sampleId: string) => {
    const sample = sampleDiseaseCases.find((c) => c.id === sampleId)
    if (sample) {
      setSelectedSampleId(sampleId)
      setSelectedCrop(sample.cropName)
      setUploadedImage(sample.sampleImage)
      setUploadedFileName(`${sample.cropName}_leaf_sample.jpg`)
    }
  }

  // Clear image
  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadedFileName(null)
    setSelectedSampleId('')
    setResult(null)
  }

  // Trigger analysis
  const handleAnalyze = async () => {
    if (!uploadedImage && !selectedSampleId) return

    setIsScanning(true)
    setScanPercent(10)
    setScanStep(t('disease.analyzing'))

    try {
      const output = await mockDiseaseService.analyzeImage(
        selectedSampleId || (uploadedFileName as any),
        selectedCrop,
        (step, percent) => {
          setScanStep(step)
          setScanPercent(percent)
        }
      )
      setResult(output)
      setLastDiagnosis(output)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <ScanEye className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('disease.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('disease.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('disease.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
            ResNet-50 Classifier · 98.4% Accuracy
          </div>
        </div>
      </div>

      {/* Preset Sample Gallery for Instant Demo */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('disease.sampleCases')}
          </p>
          <span className="text-[11px] text-slate-400">Deterministic diagnostic benchmarks</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {sampleDiseaseCases.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample.id)}
              className={`flex flex-shrink-0 items-center gap-2.5 rounded-2xl border p-2 text-left transition-all ${
                selectedSampleId === sample.id
                  ? 'border-forest-800 bg-emerald-50/80 shadow-sm dark:border-emerald-400 dark:bg-agri-darkCard'
                  : 'border-slate-200/90 bg-slate-50/60 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard/60'
              }`}
            >
              <img
                src={sample.sampleImage}
                alt={sample.diseaseName}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div className="text-xs">
                <p className="font-extrabold text-slate-900 dark:text-white">{sample.cropName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                  {sample.diseaseName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Section (2 Column: Upload on Left, Results on Right) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Image Upload & Crop Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t('disease.targetCrop')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select crop type and drag a high-resolution close-up of foliage.
            </p>

            {/* Crop Type Selector */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('disease.targetCrop')}:
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-emerald-500 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
              >
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Potato">Potato (Solanum tuberosum)</option>
                <option value="Rice">Rice (Oryza sativa)</option>
                <option value="Wheat">Wheat (Triticum aestivum)</option>
                <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                <option value="Maize">Maize (Zea mays)</option>
              </select>
            </div>

            {/* Drag & Drop Area / Preview */}
            <div className="mt-5">
              {uploadedImage ? (
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-agri-darkBorder">
                  <img
                    src={uploadedImage}
                    alt="Foliage Preview"
                    className="h-64 w-full object-cover"
                  />
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {uploadedFileName || 'Active Sample Image'}
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                    isDragActive
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
                      : 'border-slate-300 bg-slate-50/70 hover:border-emerald-400 hover:bg-white dark:border-agri-darkBorder dark:bg-agri-darkCard'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-sm">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('disease.dragDropTitle')}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {t('disease.dragDropDesc')}
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300"
                  >
                    {t('disease.browseFiles')}
                  </button>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isScanning || (!uploadedImage && !selectedSampleId)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-800 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {t('disease.analyzing')}
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    {t('disease.analyzeBtn')}
                  </>
                )}
              </button>
            </div>

            {/* Scanning Progress Animation */}
            {isScanning && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <span>{scanStep}</span>
                  <span>{scanPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 dark:bg-emerald-400"
                    style={{ width: `${scanPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Result Screen & Grad-CAM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              {/* Header Status Row */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                        result.status === 'healthy'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : result.status === 'critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {result.status === 'healthy' ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5" />
                      )}
                      {result.status.toUpperCase()} DIAGNOSIS
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Timestamp: {result.timestamp}
                    </span>
                  </div>

                  <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {result.diseaseName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Host: {result.cropName} · Pathogen: {result.pathogenType || 'None'} · Severity: {result.severity}
                  </p>
                  <div className="mt-2.5">
                    <AudioAdvisoryButton
                      label="Listen Diagnosis"
                      getNarrative={(l) =>
                        getDiseaseAudioNarrative(
                          {
                            cropName: result.cropName,
                            diseaseName: result.diseaseName,
                            confidence: result.confidence,
                            severity: result.severity,
                            symptoms: result.symptoms,
                            treatments: result.recommendedTreatment,
                          },
                          l
                        )
                      }
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-forest-800 dark:text-emerald-400">
                    {result.confidence}%
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Model Confidence
                  </p>
                </div>
              </div>

              {/* Severity & Risk Breakdown */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Risk Level</p>
                  <p className={`mt-1 text-sm font-extrabold ${result.riskLevel === 'Critical' ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {result.riskLevel}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Disease Stage</p>
                  <p className="mt-1 text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">
                    {result.stage || 'N/A'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Affected Area</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {result.affectedAreaPercentage}%
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Intervention</p>
                  <p className="mt-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                    {result.status === 'healthy' ? 'Preventive' : 'Immediate'}
                  </p>
                </div>
              </div>

              {/* Interactive AI Diagnostic Vision Studio (Before/After Split Slider) */}
              <div className="mt-6">
                <DiagnosticComparisonSlider
                  rawImage={result.sampleImage}
                  cropName={result.cropName}
                  diseaseName={result.diseaseName}
                  confidence={result.confidence}
                  affectedAreaPercentage={result.affectedAreaPercentage}
                />
              </div>

              {/* Symptoms */}
              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Pathology Symptoms:
                </h4>
                <ul className="space-y-1.5">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention & Treatments */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-emerald-50/50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-400">
                      Recommended Treatment Plan
                    </p>
                    <AudioAdvisoryButton
                      variant="ghost"
                      label=""
                      textToSpeak={`Treatment plan for ${result.cropName}: ${result.recommendedTreatment.join('. ')}`}
                    />
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {result.recommendedTreatment.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      Preventive Agronomic Measures
                    </p>
                    <AudioAdvisoryButton
                      variant="ghost"
                      label=""
                      textToSpeak={`Preventive measures: ${result.prevention.join('. ')}`}
                    />
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {result.prevention.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <ScanEye className="h-12 w-12 text-slate-300 dark:text-slate-400" />
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                Awaiting Crop Diagnostic Scan
              </p>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                Select one of the demo samples above or drag-and-drop a leaf photograph to generate pathology predictions and chemical remedies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

