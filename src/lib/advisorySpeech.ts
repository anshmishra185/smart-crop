import type { LanguageCode } from './translations'

export interface SprayingSpeechParams {
  location: string
  isFavourable: boolean
  windSpeed: number
  windDirection: string
  recommendation: string
}

export interface IrrigationSpeechParams {
  location: string
  rainfallProb: number
  humidity: number
  recommendation: string
}

export interface DiseaseSpeechParams {
  cropName: string
  diseaseName: string
  confidence: number
  severity: string
  symptoms: string[]
  treatments: string[]
}

export interface WeatherAlertSpeechParams {
  title: string
  description: string
  location?: string
}

export interface SoilSpeechParams {
  fertilityScore: number
  qualityStatus: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

/**
 * Transforms advisory technical telemetry into a fluent, naturally paced,
 * and articulate spoken narrative in the selected regional language.
 */
export function getSprayingAudioNarrative(params: SprayingSpeechParams, lang: LanguageCode): string {
  const { location, isFavourable, windSpeed, windDirection, recommendation } = params

  switch (lang) {
    case 'pa': // Punjabi
      return isFavourable
        ? `${location} ਲਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹ। ਫਸਲ ਉੱਤੇ ਛਿੜਕਾਅ ਕਰਨ ਲਈ ਮੌਸਮ ਬਹੁਤ ਅਨੁਕੂਲ ਹੈ। ਹਵਾ ਦੀ ਗਤੀ ${windSpeed} ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ, ਜੋ ਕਿ ${windDirection} ਦਿਸ਼ਾ ਵੱਲ ਹੈ। ${recommendation}। ਦੁਪਹਿਰ ਦੀ ਤੇਜ਼ ਧੁੱਪ ਤੋਂ ਬਾਅਦ ਸ਼ਾਮ ਵੇਲੇ ਛਿੜਕਾਅ ਕਰਨਾ ਸਭ ਤੋਂ ਲਾਭਕਾਰੀ ਹੋਵੇਗਾ।`
        : `${location} ਲਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹ। ਇਸ ਸਮੇਂ ਕੀਟਨਾਸ਼ਕ ਜਾਂ ਉੱਲੀਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਟਾਲ ਦਿਓ। ਹਵਾ ਦੀ ਗਤੀ ${windSpeed} ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ। ${recommendation}। ਮੌਸਮ ਸ਼ਾਂਤ ਹੋਣ ਤੱਕ ਉਡੀਕ ਕਰੋ।`

    case 'hi': // Hindi
      return isFavourable
        ? `${location} क्षेत्र के लिए कृषि मौसम सलाह। फसलों पर कीटनाशक एवं फफूंदनाशक छिड़काव के लिए मौसम पूरी तरह अनुकूल है। हवा की गति ${windSpeed} किलोमीटर प्रति घंटा है। ${recommendation}। सर्वोत्तम प्रभाव के लिए शाम के समय छिड़काव करें।`
        : `${location} क्षेत्र के लिए कृषि मौसम सलाह। वर्तमान में छिड़काव कार्य स्थगित करने की सलाह दी जाती है। हवा की गति ${windSpeed} किलोमीटर प्रति घंटा है। ${recommendation}। मौसम सामान्य होने पर ही छिड़काव करें।`

    case 'mr': // Marathi
      return isFavourable
        ? `${location} परिसरासाठी कृषी सल्ला। फवारणीसाठी हवामान अनुकूल आहे। वाऱ्याचा वेग ${windSpeed} किलोमीटर प्रति तास आहे। ${recommendation}। संध्याकाळच्या वेळेस फवारणी करणे अधिक फायदेशीर ठरेल।`
        : `${location} परिसरासाठी कृषी सल्ला। सध्या फवारणी करणे टाळावे। वाऱ्याचा वेग ${windSpeed} किलोमीटर प्रति तास आहे। ${recommendation}। हवामान शांत झाल्यावरच फवारणी करावी।`

    case 'te': // Telugu
      return isFavourable
        ? `${location} కొరకు వ్యవసాయ సలహా సూచన। పంటలకు మందులు పిచికారీ చేయడానికి వాతావరణం చాలా అనుకూలంగా ఉంది। గాలి వేగం గంటకు ${windSpeed} కిలోమీటర్లు। ${recommendation}। సాయంత్రం వేళల్లో పిచికారీ చేయడం ఉత్తమం।`
        : `${location} కొరకు వ్యవసాయ సలహా సూచన। ప్రస్తుతానికి పిచికారీ చేయవద్దు। గాలి వేగం గంటకు ${windSpeed} కిలోమీటర్లు ఉంది। ${recommendation}। వాతావరణం అనుకూలించే వరకు వేచి ఉండండి।`

    default: // English
      return isFavourable
        ? `Agricultural foliar advisory for ${location}. Spraying conditions are currently optimal and safe. Wind velocity is measured at ${windSpeed} kilometers per hour from the ${windDirection}. ${recommendation}. For best absorption, apply treatments during the cooler late afternoon hours.`
        : `Agricultural advisory for ${location}. Chemical spraying should be temporarily postponed. Current wind velocity is ${windSpeed} kilometers per hour. ${recommendation}. Please wait until ambient weather conditions stabilize.`
  }
}

export function getIrrigationAudioNarrative(params: IrrigationSpeechParams, lang: LanguageCode): string {
  const { location, rainfallProb, humidity, recommendation } = params

  switch (lang) {
    case 'pa':
      return `${location} ਲਈ ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ ਸਲਾਹ। ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ${rainfallProb} ਪ੍ਰਤੀਸ਼ਤ ਹੈ, ਅਤੇ ਹਵਾ ਵਿੱਚ ਨਮੀ ${humidity} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ${recommendation}। ਫਸਲ ਦੀਆਂ ਜੜ੍ਹਾਂ ਵਿੱਚ ਨਮੀ ਬਣਾਈ ਰੱਖੋ।`

    case 'hi':
      return `${location} के लिए सिंचाई प्रबंधन सलाह। वर्षा की संभावना ${rainfallProb} प्रतिशत है, तथा वायु में आर्द्रता ${humidity} प्रतिशत दर्ज की गई है। ${recommendation}। आवश्यकतानुसार हल्की सिंचाई की सलाह दी जाती है।`

    case 'mr':
      return `${location} साठी पाणी व्यवस्थापन सल्ला। पावसाची शक्यता ${rainfallProb} टक्के असून हवेतील आर्द्रता ${humidity} टक्के आहे। ${recommendation}। पिकांच्या गरजेनुसार पाणी द्यावे।`

    case 'te':
      return `${location} కొరకు నీటి పారుదల సలహా। వర్షం పడే అవకాశం ${rainfallProb} శాతం మరియు గాలిలో తేమ ${humidity} శాతం ఉంది। ${recommendation}। తగినంత నీటి తేమను నిర్వహించండి।`

    default:
      return `Irrigation management guidance for ${location}. Precipitation probability is currently ${rainfallProb} percent, with relative atmospheric humidity at ${humidity} percent. ${recommendation}. Monitor root-zone moisture before initiating field watering.`
  }
}

export function getDiseaseAudioNarrative(params: DiseaseSpeechParams, lang: LanguageCode): string {
  const { cropName, diseaseName, confidence, severity, symptoms, treatments } = params
  const topSymptom = symptoms[0] || ''
  const topTreatment = treatments[0] || ''

  switch (lang) {
    case 'pa':
      return `ਫਸਲ ਰੋਗ ਜਾਂਚ ਰਿਪੋਰਟ। ${cropName} ਦੀ ਫਸਲ ਵਿੱਚ ${diseaseName} ਦੀ ਪਛਾਣ ਹੋਈ ਹੈ। ਮਾਡਲ ਦੀ ਵਿਸ਼ਵਾਸ ਦਰ ${confidence} ਪ੍ਰਤੀਸ਼ਤ ਹੈ, ਅਤੇ ਗੰਭੀਰਤਾ ${severity} ਹੈ। ਮੁੱਖ ਲੱਛਣ: ${topSymptom}। ਸਿਫਾਰਸ਼ ਕੀਤਾ ਇਲਾਜ: ${topTreatment}। ਖੇਤ ਵਿੱਚ ਸਮੇਂ ਸਿਰ ਉਪਚਾਰ ਕਰੋ।`

    case 'hi':
      return `फसल रोग निदान एवं उपचार रिपोर्ट। ${cropName} की फसल में ${diseaseName} रोग की पुष्टि हुई है। डायग्नोस्टिक विश्वास स्तर ${confidence} प्रतिशत है, तथा गंभीरता स्तर ${severity} है। मुख्य लक्षण: ${topSymptom}। सुझाई गई त्वरित दवा: ${topTreatment}। खेत में जल निकासी का ध्यान रखें।`

    case 'mr':
      return `पीक रोग निदान अहवाल। ${cropName} पिकावर ${diseaseName} या रोगाची लक्षणे आढळली आहेत। अचूकता ${confidence} टक्के असून तीव्रता ${severity} आहे। लक्षण: ${topSymptom}। शिफारस केलेला उपाय: ${topTreatment}। तातडीने योग्य औषध फवारणी करावी।`

    case 'te':
      return `పంట వ్యాధి నిర్ధారణ నివేదిక। ${cropName} పంటలో ${diseaseName} వ్యాధి గుర్తించబడింది। నిర్ధారణ విశ్వసనీయత ${confidence} శాతం మరియు తీవ్రత ${severity}। ప్రధాన లక్షణం: ${topSymptom}। సిఫార్సు చేసిన చికిత్స: ${topTreatment}। సకాలంలో తగిన నివారణ చర్యలు తీసుకోండి।`

    default:
      return `Diagnostic pathology report for ${cropName}. The neural network identified ${diseaseName} with ${confidence} percent confidence at a ${severity} severity level. Primary visual symptom: ${topSymptom}. Recommended commercial treatment: ${topTreatment}. Follow up with soil moisture regulation.`
  }
}

export function getWeatherAlertAudioNarrative(params: WeatherAlertSpeechParams, lang: LanguageCode): string {
  const { title, description, location } = params
  const locPrefix = location ? `${location}: ` : ''

  switch (lang) {
    case 'pa':
      return `ਜ਼ਰੂਰੀ ਖੇਤੀ ਮੌਸਮ ਚੇਤਾਵਨੀ। ${locPrefix}${title}। ${description}। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਲੋੜੀਂਦੇ ਕਦਮ ਚੁੱਕੋ।`

    case 'hi':
      return `आवश्यक कृषि मौसम चेतावनी। ${locPrefix}${title}। ${description}। कृपया अपनी फसल की सुरक्षा के लिए उचित सावधानी बरतें।`

    case 'mr':
      return `महत्त्वाची कृषी हवामान सूचना। ${locPrefix}${title}। ${description}। पिकांच्या संरक्षणासाठी योग्य ती खबरदारी घ्यावी।`

    case 'te':
      return `ముఖ్యమైన వాతావరణ హెచ్చరిక। ${locPrefix}${title}। ${description}। దయచేసి మీ పంట రక్షణ కోసం అవసరమైన జాగ్రత్తలు తీసుకోండి।`

    default:
      return `Critical Agricultural Weather Advisory. ${locPrefix}${title}. ${description}. Please take appropriate field precautions to safeguard cultivated acreage.`
  }
}

