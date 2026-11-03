import { sampleDiseaseCases } from '../data/diseases'
import type { DiseaseDetectionResult } from '../types'

export interface ScanProgressCallback {
  (step: string, percent: number): void
}

export const mockDiseaseService = {
  getAllCases(): DiseaseDetectionResult[] {
    return sampleDiseaseCases
  },

  getCaseById(id: string): DiseaseDetectionResult | undefined {
    return sampleDiseaseCases.find((c) => c.id === id)
  },

  async analyzeImage(
    fileOrSampleId: File | string,
    cropType: string,
    onProgress?: ScanProgressCallback
  ): Promise<DiseaseDetectionResult> {
    const steps = [
      { text: 'Preprocessing leaf image & normalizing color bands...', percent: 20 },
      { text: 'Segmenting foliage boundary & filtering background noise...', percent: 45 },
      { text: 'Extracting deep convolutional feature maps (ResNet-50 backbone)...', percent: 70 },
      { text: 'Computing class activation map (Grad-CAM simulated)...', percent: 88 },
      { text: 'Aggregating diagnostic confidence & agronomic advisories...', percent: 100 }
    ]

    for (const step of steps) {
      await new Promise((res) => setTimeout(res, 350))
      if (onProgress) {
        onProgress(step.text, step.percent)
      }
    }

    // If a sample case was selected
    if (typeof fileOrSampleId === 'string') {
      const match = sampleDiseaseCases.find((c) => c.id === fileOrSampleId)
      if (match) {
        return {
          ...match,
          timestamp: 'Just now'
        }
      }
    }

    // If file was uploaded with specific cropType, find best matching case
    const filteredByCrop = sampleDiseaseCases.filter(
      (c) => c.cropName.toLowerCase() === cropType.toLowerCase()
    )

    const baseResult = filteredByCrop.length > 0
      ? filteredByCrop[0]
      : sampleDiseaseCases[0]

    return {
      ...baseResult,
      id: `analysis-${Date.now()}`,
      timestamp: 'Just now',
      confidence: Number((89 + Math.random() * 8).toFixed(1))
    }
  }
}

