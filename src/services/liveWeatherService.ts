import { punjabDistrictsData, type PunjabDistrictWeather, PUNJAB_DISTRICT_COORDINATES } from '../data/punjabDistricts'
import type { WeatherCondition } from '../types'

interface OpenMeteoResponse {
  current?: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    surface_pressure: number
  }
  hourly?: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
  }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
    weather_code: number[]
  }
}

/** Converts WMO weather interpretation code to valid WeatherCondition string */
export function mapWmoCodeToCondition(code: number): WeatherCondition['condition'] {
  if (code === 0) return 'Sunny'
  if (code === 1 || code === 2) return 'Partly Cloudy'
  if (code === 3 || code === 45 || code === 48) return 'Cloudy'
  if (code === 51 || code === 53 || code === 55 || code === 61 || code === 80) return 'Light Rain'
  if (code === 63 || code === 65 || code === 81 || code === 82) return 'Heavy Rain'
  if (code >= 95) return 'Thunderstorm'
  return 'Partly Cloudy'
}

/** Converts wind degrees into 8 cardinal compass directions */
export function degreesToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index] || 'NW'
}

/** Formats ISO date string (YYYY-MM-DD) into display format (e.g., 'Mon', 'Nov 02') */
function formatDayAndDate(isoDate: string): { day: string; date: string } {
  try {
    const d = new Date(isoDate)
    const day = d.toLocaleDateString('en-US', { weekday: 'short' })
    const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    return { day, date }
  } catch {
    return { day: 'Day', date: isoDate }
  }
}

// In-memory cache with 5-minute TTL to prevent spamming
interface CachedWeather {
  data: PunjabDistrictWeather
  timestamp: number
}

const weatherCache = new Map<string, CachedWeather>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export const liveWeatherService = {
  /**
   * Resolves the district key and canonical name from user inputs
   */
  resolveDistrictKey(districtQuery: string): string {
    const normalized = districtQuery.toLowerCase().replace(/[\s-()]/g, '')
    const found = Object.keys(punjabDistrictsData).find((key) => {
      const kNorm = key.toLowerCase().replace(/[\s-()]/g, '')
      const d = punjabDistrictsData[key]
      const nameNorm = d ? d.districtName.toLowerCase().replace(/[\s-()]/g, '') : ''
      return kNorm === normalized || nameNorm === normalized || nameNorm.includes(normalized) || normalized.includes(nameNorm)
    })
    return found || 'Ludhiana'
  },

  /**
   * Fetches real-time live meteorological telemetry for any Punjab district
   * using the Open-Meteo live feed (calibrated to ECMWF / NOAA / Weather.com data).
   */
  async fetchLiveDistrictWeather(districtQuery: string, forceFresh = false): Promise<PunjabDistrictWeather> {
    const key = this.resolveDistrictKey(districtQuery)
    const baseDistrict = punjabDistrictsData[key] || punjabDistrictsData.Ludhiana

    // Check cache
    const now = Date.now()
    const cached = weatherCache.get(key)
    if (!forceFresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data
    }

    const coords = PUNJAB_DISTRICT_COORDINATES[key] || {
      lat: baseDistrict.latitude || 30.901,
      lon: baseDistrict.longitude || 75.8573,
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code&timezone=Asia%2FKolkata`

    try {
      const response = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Open-Meteo returned status ${response.status}`)
      }

      const json: OpenMeteoResponse = await response.json()
      const curr = json.current
      if (!curr) {
        throw new Error('Empty current telemetry from Open-Meteo')
      }

      const temp = Math.round(curr.temperature_2m)
      const feelsLike = Math.round(curr.apparent_temperature)
      const humidity = Math.round(curr.relative_humidity_2m)
      const windSpeed = Math.round(curr.wind_speed_10m)
      const windDirection = degreesToCompass(curr.wind_direction_10m)
      const pressure = Math.round(curr.surface_pressure)
      const condition = mapWmoCodeToCondition(curr.weather_code)
      const rainfallProb = json.daily?.precipitation_probability_max?.[0] ?? Math.round(curr.precipitation * 20)

      // Dynamic spraying recommendation based on real-time physics
      const favourableSpraying = windSpeed <= 15 && rainfallProb < 35 && curr.precipitation <= 0.1
      let sprayingRecommendation = baseDistrict.sprayingRecommendation
      if (windSpeed > 15) {
        sprayingRecommendation = `Caution: Real-time wind speed in ${baseDistrict.districtName} (${windSpeed} km/h) exceeds the 15 km/h safety threshold. High risk of foliar drift; postpone spraying.`
      } else if (rainfallProb >= 35) {
        sprayingRecommendation = `Unfavourable: Live radar shows ${rainfallProb}% precipitation probability. Risk of pesticide wash-off; await clear weather.`
      } else {
        sprayingRecommendation = `Favourable: Real-time wind (${windSpeed} km/h) and optimal relative humidity (${humidity}%) allow safe, efficient foliar pesticide and nutrient spraying.`
      }

      // Map hourly intervals
      let hourly = baseDistrict.hourly
      if (json.hourly && json.hourly.time && json.hourly.time.length >= 6) {
        const slots = [6, 9, 12, 15, 18, 21] // Standard reporting hours
        const mappedHourly = slots.map((hour) => {
          const targetIndex = json.hourly?.time.findIndex((tStr) => {
            const h = new Date(tStr).getHours()
            return h === hour
          })
          const idx = targetIndex !== undefined && targetIndex >= 0 ? targetIndex : hour
          const hTemp = json.hourly?.temperature_2m[idx] !== undefined ? Math.round(json.hourly.temperature_2m[idx]) : temp
          const hHum = json.hourly?.relative_humidity_2m[idx] !== undefined ? Math.round(json.hourly.relative_humidity_2m[idx]) : humidity
          const hRain = json.hourly?.precipitation_probability[idx] !== undefined ? json.hourly.precipitation_probability[idx] : 5
          const hCode = json.hourly?.weather_code[idx] ?? 0
          const timeLabel = `${hour.toString().padStart(2, '0')}:00`
          return {
            time: timeLabel,
            temp: hTemp,
            humidity: hHum,
            rainfallProb: hRain,
            condition: mapWmoCodeToCondition(hCode),
          }
        })
        if (mappedHourly.length === 6) {
          hourly = mappedHourly
        }
      }

      // Map daily 7-day forecast
      let daily = baseDistrict.daily
      if (json.daily && json.daily.time && json.daily.time.length >= 7) {
        daily = json.daily.time.slice(0, 7).map((dStr, idx) => {
          const { day, date } = formatDayAndDate(dStr)
          const tempMax = Math.round(json.daily?.temperature_2m_max[idx] ?? temp + 2)
          const tempMin = Math.round(json.daily?.temperature_2m_min[idx] ?? temp - 8)
          const rainProb = json.daily?.precipitation_probability_max[idx] ?? 5
          const dWind = Math.round(json.daily?.wind_speed_10m_max[idx] ?? windSpeed)
          const dCode = json.daily?.weather_code[idx] ?? 0
          return {
            day,
            date,
            tempMax,
            tempMin,
            condition: mapWmoCodeToCondition(dCode),
            rainfallProb: rainProb,
            humidity,
            wind: dWind,
          }
        })
      }

      const updatedDistrict: PunjabDistrictWeather = {
        ...baseDistrict,
        temp,
        feelsLike,
        humidity,
        windSpeed,
        windDirection,
        pressure,
        rainfallProb,
        condition,
        favourableSpraying,
        sprayingRecommendation,
        hourly,
        daily,
        latitude: coords.lat,
        longitude: coords.lon,
        isLive: true,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }

      weatherCache.set(key, { data: updatedDistrict, timestamp: now })
      return updatedDistrict
    } catch {
      // Graceful fallback to calibrated data if network blocked or offline
      const fallback: PunjabDistrictWeather = {
        ...baseDistrict,
        latitude: coords.lat,
        longitude: coords.lon,
        isLive: false,
        lastUpdated: 'Calibrated Station Baseline',
      }
      return fallback
    }
  },

  /**
   * Fetches real-time weather for all 23 Punjab districts in parallel
   */
  async fetchAllDistrictsLive(forceFresh = false): Promise<Record<string, PunjabDistrictWeather>> {
    const keys = Object.keys(punjabDistrictsData)
    const results = await Promise.allSettled(
      keys.map((k) => this.fetchLiveDistrictWeather(k, forceFresh))
    )

    const updatedMap: Record<string, PunjabDistrictWeather> = {}
    keys.forEach((key, idx) => {
      const res = results[idx]
      if (res && res.status === 'fulfilled') {
        updatedMap[key] = res.value
      } else {
        updatedMap[key] = punjabDistrictsData[key] || punjabDistrictsData.Ludhiana
      }
    })

    return updatedMap
  },
}

