import { useState } from 'react'
import {
  Settings,
  Building2,
  Cpu,
  BellRing,
  SunMedium,
  KeyRound,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { MultiTenantEstateProfile } from '../components/settings/MultiTenantEstateProfile'
import { SensorHardwareNetworkManager } from '../components/settings/SensorHardwareNetworkManager'
import { AgronomicThresholdEngine } from '../components/settings/AgronomicThresholdEngine'
import { DisplayVoicePreferences } from '../components/settings/DisplayVoicePreferences'
import { ApiKeysAndWebhooksHub } from '../components/settings/ApiKeysAndWebhooksHub'
import { RbacDigitalSignatureSecurity } from '../components/settings/RbacDigitalSignatureSecurity'

export function SettingsPage() {
  const { t } = useAppStore()
  const [activeTab, setActiveTab] = useState<'all' | 'estate' | 'hardware' | 'thresholds' | 'display' | 'apis' | 'security'>('all')

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Settings className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Enterprise Farm Management System (FMS) Command
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Institutional cadastral configuration, IoT micro-climate hardware calibration, phytosanitary threshold rules, and API integrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> System Online &amp; Synced
          </span>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          Full Configuration Hub (All 6 Modules)
        </button>

        <button
          onClick={() => setActiveTab('estate')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'estate'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> 1. Estate Cadastre
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'hardware'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" /> 2. IoT Hardware
        </button>

        <button
          onClick={() => setActiveTab('thresholds')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'thresholds'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <BellRing className="h-3.5 w-3.5" /> 3. Agronomic Thresholds
        </button>

        <button
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'display'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <SunMedium className="h-3.5 w-3.5" /> 4. Display &amp; Voice
        </button>

        <button
          onClick={() => setActiveTab('apis')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'apis'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" /> 5. APIs &amp; Webhooks
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === 'security'
              ? 'bg-forest-800 text-white shadow-md dark:bg-emerald-600'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-300'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" /> 6. RBAC &amp; Signatures
        </button>
      </div>

      {/* Module 1: Multi-Tenant Estate Profile & Cadastral Boundaries */}
      {(activeTab === 'all' || activeTab === 'estate') && (
        <MultiTenantEstateProfile />
      )}

      {/* Module 2: IoT Sensor Hardware & Mesh Network */}
      {(activeTab === 'all' || activeTab === 'hardware') && (
        <SensorHardwareNetworkManager />
      )}

      {/* Module 3: Agronomic Threshold & Rule Engine */}
      {(activeTab === 'all' || activeTab === 'thresholds') && (
        <AgronomicThresholdEngine />
      )}

      {/* Module 4: Display, Ergonomics & Multilingual Voice Synthesis */}
      {(activeTab === 'all' || activeTab === 'display') && (
        <DisplayVoicePreferences />
      )}

      {/* Module 5: API Keys & External FMIS Webhooks */}
      {(activeTab === 'all' || activeTab === 'apis') && (
        <ApiKeysAndWebhooksHub />
      )}

      {/* Module 6: RBAC & Digital Agronomist Signature */}
      {(activeTab === 'all' || activeTab === 'security') && (
        <RbacDigitalSignatureSecurity />
      )}
    </div>
  )
}
