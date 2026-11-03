import { defaultSoilReading, computeSoilHealth } from '../data/soil'
import type { SoilReading } from '../types'

export const mockSoilService = {
  getDefaultReading(): SoilReading {
    return defaultSoilReading
  },

  updateSoilReading(newValues: Partial<SoilReading>, current: SoilReading): SoilReading {
    const merged = { ...current, ...newValues }
    return computeSoilHealth(merged)
  }
}

