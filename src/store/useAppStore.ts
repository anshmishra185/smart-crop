import { create } from 'zustand'
import { regionalWeatherPresets } from '../data/weather'
import { punjabDistrictsData } from '../data/punjabDistricts'
import { liveWeatherService } from '../services/liveWeatherService'
import { defaultSoilReading, computeSoilHealth } from '../data/soil'
import { sampleDiseaseCases } from '../data/diseases'
import { getTranslation, type LanguageCode } from '../lib/translations'
import type { AgriNotification, CalendarTask, DiseaseDetectionResult, SoilReading, WeatherCondition } from '../types'

export type { LanguageCode }

interface AppState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  outdoorMode: boolean
  toggleOutdoorMode: () => void

  language: LanguageCode
  setLanguage: (lang: LanguageCode | string) => void
  t: (key: string) => string

  selectedRegion: string
  setSelectedRegion: (region: string) => void
  selectedPunjabDistrict: string
  setSelectedPunjabDistrict: (district: string) => void
  weather: WeatherCondition
  isWeatherLive: boolean
  isWeatherLoading: boolean
  weatherLastUpdated: string | null
  fetchLiveDistrictWeather: (district?: string, forceFresh?: boolean) => Promise<void>

  soilReading: SoilReading
  updateSoilReading: (updates: Partial<SoilReading>) => void

  notifications: AgriNotification[]
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  dismissNotification: (id: string) => void

  calendarTasks: CalendarTask[]
  addTask: (task: Omit<CalendarTask, 'id'>) => void
  updateTask: (id: string, updates: Partial<CalendarTask>) => void
  deleteTask: (id: string) => void
  toggleTaskCompleted: (id: string) => void

  lastDiagnosis: DiseaseDetectionResult | null
  setLastDiagnosis: (result: DiseaseDetectionResult) => void
  diagnosisHistory: DiseaseDetectionResult[]
}

const initialNotifications: AgriNotification[] = [
  {
    id: 'notif-1',
    title: 'High Humidity Alert',
    message: 'Canopy humidity exceeded 75% in North Field A. Elevated risk of Early Blight in tomato rows.',
    severity: 'warning',
    timestamp: '15m ago',
    read: false,
    category: 'disease'
  },
  {
    id: 'notif-2',
    title: 'Optimal Spray Window Open',
    message: 'Wind speeds dropped to 9 km/h in Ludhiana. Ideal window for foliar fungicide application.',
    severity: 'success',
    timestamp: '1h ago',
    read: false,
    category: 'weather'
  },
  {
    id: 'notif-3',
    title: 'Irrigation Due Reminder',
    message: 'Plot 3 (Wheat) moisture down to 24%. Scheduled light sprinkler cycle is recommended today.',
    severity: 'info',
    timestamp: '3h ago',
    read: true,
    category: 'irrigation'
  },
  {
    id: 'notif-4',
    title: 'Nitrogen Depletion Warning',
    message: 'Soil lab sensor in South Valley C detected available N below 70 kg/ha.',
    severity: 'critical',
    timestamp: 'Yesterday',
    read: true,
    category: 'soil'
  }
]

const initialCalendarTasks: CalendarTask[] = [
  {
    id: 'task-1',
    title: 'Wheat Sowing (HD-2967)',
    crop: 'Wheat',
    category: 'sowing',
    date: '2026-11-04',
    time: '08:00 AM',
    priority: 'high',
    completed: false,
    notes: 'Ensure seed treatment with Trichoderma viride @ 5g/kg.'
  },
  {
    id: 'task-2',
    title: 'Tomato Foliar Spray (Mancozeb)',
    crop: 'Tomato',
    category: 'inspection',
    date: '2026-11-03',
    time: '04:30 PM',
    priority: 'high',
    completed: false,
    notes: 'Spray preventive Mancozeb 75% WP @ 2.5 g/L before sunset.'
  },
  {
    id: 'task-3',
    title: 'Drip Irrigation Check - Block 2',
    crop: 'Cotton',
    category: 'irrigation',
    date: '2026-11-05',
    time: '07:00 AM',
    priority: 'medium',
    completed: false,
    notes: 'Flush lateral drip lines and check emitter pressures.'
  },
  {
    id: 'task-4',
    title: 'Soil Nitrogen Top Dressing',
    crop: 'Maize',
    category: 'fertilizer',
    date: '2026-11-07',
    time: '09:00 AM',
    priority: 'medium',
    completed: false,
    notes: 'Apply 35 kg/acre Urea before forecasted light shower.'
  },
  {
    id: 'task-5',
    title: 'Paddy Harvesting Stage 2',
    crop: 'Rice',
    category: 'harvest',
    date: '2026-11-10',
    time: '06:30 AM',
    priority: 'high',
    completed: false,
    notes: 'Combine harvester booked. Moisture target 14-16%.'
  }
]

const normalizeLang = (l: string): LanguageCode => {
  if (l === 'hi' || l.toLowerCase().includes('hind')) return 'hi'
  if (l === 'pa' || l.toLowerCase().includes('punj')) return 'pa'
  if (l === 'mr' || l.toLowerCase().includes('marath')) return 'mr'
  if (l === 'te' || l.toLowerCase().includes('telug')) return 'te'
  return 'en'
}

export const useAppStore = create<AppState>((set, get) => {
  // Read initial theme
  const savedTheme = (typeof window !== 'undefined' && localStorage.getItem('crop_doctor_theme')) as 'light' | 'dark' | null
  const initialTheme = savedTheme || 'light'

  if (typeof document !== 'undefined') {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Read initial outdoor field mode
  const savedOutdoor = typeof window !== 'undefined' ? localStorage.getItem('crop_doctor_outdoor') === 'true' : false
  if (typeof document !== 'undefined' && savedOutdoor) {
    document.documentElement.classList.add('outdoor-mode')
  }

  // Read saved language
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('crop_doctor_lang') : null
  const initialLang: LanguageCode = savedLang ? normalizeLang(savedLang) : 'en'

  // Read saved tasks
  const savedTasks = typeof window !== 'undefined' ? localStorage.getItem('crop_doctor_tasks') : null
  const parsedTasks = savedTasks ? JSON.parse(savedTasks) : initialCalendarTasks

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('crop_doctor_theme', theme)
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      set({ theme })
    },
    toggleTheme: () => {
      set((state) => {
        const next = state.theme === 'light' ? 'dark' : 'light'
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_theme', next)
          if (next === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
        return { theme: next }
      })
    },

    outdoorMode: savedOutdoor,
    toggleOutdoorMode: () => {
      set((state) => {
        const next = !state.outdoorMode
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_outdoor', String(next))
          if (next) {
            document.documentElement.classList.add('outdoor-mode')
          } else {
            document.documentElement.classList.remove('outdoor-mode')
          }
        }
        return { outdoorMode: next }
      })
    },

    language: initialLang,
    setLanguage: (lang) => {
      const normalized = normalizeLang(lang)
      if (typeof window !== 'undefined') {
        localStorage.setItem('crop_doctor_lang', normalized)
      }
      set({ language: normalized })
    },
    t: (key: string) => {
      return getTranslation(key, get().language)
    },

    selectedRegion: 'Punjab',
    selectedPunjabDistrict: 'Ludhiana',
    isWeatherLive: false,
    isWeatherLoading: false,
    weatherLastUpdated: null,

    fetchLiveDistrictWeather: async (districtQuery?: string, forceFresh = false) => {
      const targetDistrict = districtQuery || get().selectedPunjabDistrict || 'Ludhiana'
      set({ isWeatherLoading: true })
      try {
        const liveData = await liveWeatherService.fetchLiveDistrictWeather(targetDistrict, forceFresh)
        set({
          weather: liveData,
          isWeatherLive: Boolean(liveData.isLive),
          weatherLastUpdated: liveData.lastUpdated || 'Just now',
          isWeatherLoading: false,
        })
      } catch {
        set({ isWeatherLoading: false })
      }
    },

    setSelectedRegion: (region) => {
      if (region === 'Punjab') {
        const district = get().selectedPunjabDistrict || 'Ludhiana'
        const weather = punjabDistrictsData[district] || regionalWeatherPresets.Punjab
        set({ selectedRegion: region, weather })
        void get().fetchLiveDistrictWeather(district)
      } else {
        const weather = regionalWeatherPresets[region] || regionalWeatherPresets.Punjab
        set({ selectedRegion: region, weather, isWeatherLive: false, weatherLastUpdated: null })
      }
    },
    setSelectedPunjabDistrict: (district) => {
      const canonicalKey = liveWeatherService.resolveDistrictKey(district)
      const districtWeather = punjabDistrictsData[canonicalKey] || punjabDistrictsData.Ludhiana
      set({
        selectedRegion: 'Punjab',
        selectedPunjabDistrict: canonicalKey,
        weather: districtWeather,
      })
      void get().fetchLiveDistrictWeather(canonicalKey)
    },
    weather: punjabDistrictsData.Ludhiana,

    soilReading: defaultSoilReading,
    updateSoilReading: (updates) => {
      set((state) => {
        const next = computeSoilHealth({ ...state.soilReading, ...updates })
        return { soilReading: next }
      })
    },

    notifications: initialNotifications,
    markNotificationAsRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      }))
    },
    markAllNotificationsAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      }))
    },
    dismissNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    },

    calendarTasks: parsedTasks,
    addTask: (task) => {
      set((state) => {
        const newTask: CalendarTask = { ...task, id: `task-${Date.now()}` }
        const nextTasks = [newTask, ...state.calendarTasks]
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_tasks', JSON.stringify(nextTasks))
        }
        return { calendarTasks: nextTasks }
      })
    },
    updateTask: (id, updates) => {
      set((state) => {
        const nextTasks = state.calendarTasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_tasks', JSON.stringify(nextTasks))
        }
        return { calendarTasks: nextTasks }
      })
    },
    deleteTask: (id) => {
      set((state) => {
        const nextTasks = state.calendarTasks.filter((t) => t.id !== id)
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_tasks', JSON.stringify(nextTasks))
        }
        return { calendarTasks: nextTasks }
      })
    },
    toggleTaskCompleted: (id) => {
      set((state) => {
        const nextTasks = state.calendarTasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
        if (typeof window !== 'undefined') {
          localStorage.setItem('crop_doctor_tasks', JSON.stringify(nextTasks))
        }
        return { calendarTasks: nextTasks }
      })
    },

    lastDiagnosis: sampleDiseaseCases[0],
    setLastDiagnosis: (result) => {
      set((state) => ({
        lastDiagnosis: result,
        diagnosisHistory: [result, ...state.diagnosisHistory.slice(0, 9)]
      }))
    },
    diagnosisHistory: sampleDiseaseCases.slice(0, 4)
  }
})

