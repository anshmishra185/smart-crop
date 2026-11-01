import type { CropCategory, CropImageData } from '../types/crop'

export const cropPlaceholderImage =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ecfdf5"/>
          <stop offset="100%" stop-color="#dcfce7"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <rect x="120" y="140" width="960" height="620" rx="40" fill="#ffffff" opacity="0.9"/>
      <circle cx="610" cy="360" r="180" fill="#bbf7d0" opacity="0.7"/>
      <path d="M455 500C512 420 570 385 620 360C670 335 720 330 760 340" fill="none" stroke="#166534" stroke-width="26" stroke-linecap="round"/>
      <path d="M510 505C560 455 610 435 660 430C705 425 760 430 820 470" fill="none" stroke="#15803d" stroke-width="20" stroke-linecap="round"/>
      <text x="600" y="670" text-anchor="middle" font-size="52" font-family="Arial, sans-serif" fill="#14532d" font-weight="700">Crop image unavailable</text>
    </svg>
  `)

const riceImage: CropImageData = {
  src: '/crops/rice-field.jpg',
  alt: 'Green rice plants growing in a paddy field at golden hour',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Green_rice_sheaves_planted_in_a_paddy_field_with_long_shadows_at_golden_hour_in_Don_Det_Laos.jpg',
  attribution: 'Basile Morin / Wikimedia Commons',
  license: 'CC BY-SA 4.0',
}

const wheatImage: CropImageData = {
  src: '/crops/wheat-field.jpg',
  alt: 'A mature wheat field at sunset',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset-over-the-wheat-field-featured.jpg',
  attribution: 'Dreamy Pixel / Wikimedia Commons',
  license: 'CC BY 4.0',
}

const maizeImage: CropImageData = {
  src: '/crops/maize-field.jpg',
  alt: 'A corn field in Liechtenstein',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Field,_corn,_Liechtenstein,_Mountains,_Alps,_Vaduz,_sky,_clouds,_landscape.jpg',
  attribution: 'Paranoid / Wikimedia Commons',
  license: 'Public domain',
}

const soybeanImage: CropImageData = {
  src: '/crops/soybean-field.jpg',
  alt: 'Soybeans growing between walnut trees in an alley-cropping field',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Missouri_soybean_and_walnut_alley_cropping_(25706978934).jpg',
  attribution: 'National Agroforestry Center / Wikimedia Commons',
  license: 'CC BY 2.0',
}

const tomatoImage: CropImageData = {
  src: '/crops/tomato-plant.jpg',
  alt: 'A tomato plant with ripening tomatoes',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tomato_plant_2026_G2.jpg',
  attribution: 'George Chernilevsky / Wikimedia Commons',
  license: 'CC BY 4.0',
}

const cottonImage: CropImageData = {
  src: '/crops/cotton-boll.jpg',
  alt: 'A cotton boll nearly ready for harvest',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cotton_boll_nearly_ready_for_harvest.jpg',
  attribution: 'Michael Bass-Deschenes / Wikimedia Commons',
  license: 'CC BY 2.0',
}

const potatoImage: CropImageData = {
  src: '/crops/potato-field.jpg',
  alt: 'A potato field in Aoya, Japan',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Potato_field_in_Aoya,_Tottori(shared_place_for_Anti-nuclear_power_plant).jpg',
  attribution: '聖石大戦ぶぅぶぅ / Wikimedia Commons',
  license: 'CC BY-SA 4.0',
}

const sunflowerImage: CropImageData = {
  src: '/crops/sunflower.jpg',
  alt: 'A sunflower with a bumblebee',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunflower_and_a_bee.jpg',
  attribution: 'Tomas Castelazo / Wikimedia Commons',
  license: 'CC BY-SA 4.0',
}

const mangoImage: CropImageData = {
  src: '/crops/mangoes.jpg',
  alt: 'Whole and sliced mangoes',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mangos_-_single_and_halved.jpg',
  attribution: 'Ivar Leidus / Wikimedia Commons',
  license: 'CC BY-SA 4.0',
}

export const cropImages: Record<string, CropImageData> = {
  rice: riceImage,
  wheat: wheatImage,
  maize: maizeImage,
  soybean: soybeanImage,
  tomato: tomatoImage,
  cotton: cottonImage,
  potato: potatoImage,
  sunflower: sunflowerImage,
  mango: mangoImage,
  Cereal: wheatImage,
  Millet: wheatImage,
  Pulse: soybeanImage,
  Oilseed: sunflowerImage,
  'Cash Crop': cottonImage,
  Vegetable: tomatoImage,
  Fruit: mangoImage,
}

export function getCropImage(imageKey: string, category: CropCategory): CropImageData {
  return cropImages[imageKey] ?? cropImages[category]
}
