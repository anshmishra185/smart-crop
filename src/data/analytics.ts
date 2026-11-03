export interface CropHealthStats {
  category: string
  count: number
  percentage: number
  color: string
}

export const cropHealthDistribution: CropHealthStats[] = [
  { category: 'Healthy', count: 1840, percentage: 76.6, color: '#10B981' },
  { category: 'Infected', count: 380, percentage: 15.8, color: '#EF4444' },
  { category: 'At Risk', count: 182, percentage: 7.6, color: '#F59E0B' }
]

export const cropHealthComparisonData = [
  { month: 'Jun', healthy: 1200, infected: 210, atRisk: 90 },
  { month: 'Jul', healthy: 1450, infected: 280, atRisk: 140 },
  { month: 'Aug', healthy: 1680, infected: 420, atRisk: 210 },
  { month: 'Sep', healthy: 1720, infected: 390, atRisk: 160 },
  { month: 'Oct', healthy: 1810, infected: 340, atRisk: 130 },
  { month: 'Nov', healthy: 1840, infected: 380, atRisk: 182 }
]

export const diseaseDistributionData = [
  { disease: 'Early Blight', cases: 142, percentage: 37.4, color: '#F97316' },
  { disease: 'Late Blight', cases: 98, percentage: 25.8, color: '#EF4444' },
  { disease: 'Leaf Rust', cases: 64, percentage: 16.8, color: '#EAB308' },
  { disease: 'Leaf Blast', cases: 46, percentage: 12.1, color: '#8B5CF6' },
  { disease: 'Bacterial Spot', cases: 30, percentage: 7.9, color: '#EC4899' }
]

export const monthlyDiseaseTrends = [
  { month: 'Jan', totalCases: 42, growthRate: 3.2, rainfall: 22, avgTemp: 14 },
  { month: 'Feb', totalCases: 56, growthRate: 14.0, rainfall: 28, avgTemp: 18 },
  { month: 'Mar', totalCases: 84, growthRate: 28.0, rainfall: 18, avgTemp: 24 },
  { month: 'Apr', totalCases: 110, growthRate: 18.2, rainfall: 15, avgTemp: 31 },
  { month: 'May', totalCases: 95, growthRate: -13.6, rainfall: 35, avgTemp: 36 },
  { month: 'Jun', totalCases: 180, growthRate: 89.5, rainfall: 140, avgTemp: 33 },
  { month: 'Jul', totalCases: 290, growthRate: 61.1, rainfall: 260, avgTemp: 29 },
  { month: 'Aug', totalCases: 380, growthRate: 31.0, rainfall: 240, avgTemp: 28 },
  { month: 'Sep', totalCases: 340, growthRate: -10.5, rainfall: 180, avgTemp: 27 },
  { month: 'Oct', totalCases: 240, growthRate: -29.4, rainfall: 45, avgTemp: 26 },
  { month: 'Nov', totalCases: 180, growthRate: -25.0, rainfall: 15, avgTemp: 22 },
  { month: 'Dec', totalCases: 115, growthRate: -36.1, rainfall: 10, avgTemp: 16 }
]

export const soilNutrientComparisonData = [
  { plot: 'North Field A', nitrogen: 112, phosphorus: 48, potassium: 165, ph: 6.8 },
  { plot: 'North Field B', nitrogen: 88, phosphorus: 34, potassium: 140, ph: 6.4 },
  { plot: 'South Valley C', nitrogen: 135, phosphorus: 56, potassium: 190, ph: 7.1 },
  { plot: 'East Orchard D', nitrogen: 96, phosphorus: 42, potassium: 155, ph: 6.7 },
  { plot: 'West Canal E', nitrogen: 145, phosphorus: 62, potassium: 210, ph: 7.4 }
]

export const soilCompositionPieData = [
  { name: 'Organic Carbon', value: 32, color: '#166534' },
  { name: 'Available Nitrogen', value: 28, color: '#10B981' },
  { name: 'Available Phosphorus', value: 16, color: '#3B82F6' },
  { name: 'Available Potassium', value: 24, color: '#84CC16' }
]

export const cropDistributionPieData = [
  { name: 'Wheat', value: 35, count: '840 acres', color: '#EAB308' },
  { name: 'Rice', value: 25, count: '600 acres', color: '#10B981' },
  { name: 'Cotton', value: 18, count: '430 acres', color: '#06B6D4' },
  { name: 'Tomato', value: 12, count: '290 acres', color: '#EF4444' },
  { name: 'Potato', value: 10, count: '240 acres', color: '#F97316' }
]

export const weatherAnalyticsComparisonData = [
  { month: 'Jan', temp: 15, rainfall: 18, humidity: 62 },
  { month: 'Feb', temp: 19, rainfall: 24, humidity: 58 },
  { month: 'Mar', temp: 25, rainfall: 14, humidity: 48 },
  { month: 'Apr', temp: 32, rainfall: 12, humidity: 42 },
  { month: 'May', temp: 37, rainfall: 28, humidity: 46 },
  { month: 'Jun', temp: 34, rainfall: 160, humidity: 74 },
  { month: 'Jul', temp: 29, rainfall: 280, humidity: 84 },
  { month: 'Aug', temp: 28, rainfall: 240, humidity: 82 },
  { month: 'Sep', temp: 28, rainfall: 170, humidity: 76 },
  { month: 'Oct', temp: 26, rainfall: 42, humidity: 66 },
  { month: 'Nov', temp: 22, rainfall: 14, humidity: 59 },
  { month: 'Dec', temp: 16, rainfall: 8, humidity: 61 }
]

