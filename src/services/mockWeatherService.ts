import { regionalWeatherPresets } from '../data/weather'
import { punjabDistrictsData, type PunjabDistrictWeather } from '../data/punjabDistricts'
import { liveWeatherService } from './liveWeatherService'
import type { WeatherCondition } from '../types'

export const mockWeatherService = {
  getAvailableRegions(): string[] {
    return Object.keys(regionalWeatherPresets)
  },

  getPunjabDistrictNames(): string[] {
    return Object.keys(punjabDistrictsData)
  },

  getAllPunjabDistricts(): PunjabDistrictWeather[] {
    return Object.values(punjabDistrictsData)
  },

  getPunjabDistrictWeather(district: string): PunjabDistrictWeather {
    const key = liveWeatherService.resolveDistrictKey(district)
    return punjabDistrictsData[key] || punjabDistrictsData.Ludhiana
  },

  getWeatherForRegion(region: string): WeatherCondition {
    const key = liveWeatherService.resolveDistrictKey(region)
    if (punjabDistrictsData[key]) {
      return punjabDistrictsData[key]
    }
    return regionalWeatherPresets[region] || regionalWeatherPresets.Punjab
  },

  /**
   * Fetches real-time telemetry from live meteorological satellites & WMO stations
   * matching Weather.com and ECMWF telemetry.
   */
  async fetchLivePunjabDistrict(district: string, forceFresh = false): Promise<PunjabDistrictWeather> {
    return liveWeatherService.fetchLiveDistrictWeather(district, forceFresh)
  },

  /**
   * Fetches real-time telemetry for all 23 districts in parallel
   */
  async fetchAllPunjabDistricts(forceFresh = false): Promise<Record<string, PunjabDistrictWeather>> {
    return liveWeatherService.fetchAllDistrictsLive(forceFresh)
  },

  // Backward compatible method
  async fetchLiveWeather(region: string, _apiKey?: string): Promise<WeatherCondition> {
    if (punjabDistrictsData[region] || region.toLowerCase().includes('punjab') || region.length > 0) {
      return this.fetchLivePunjabDistrict(region)
    }
    return this.getWeatherForRegion(region)
  }
}

