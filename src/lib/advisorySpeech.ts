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

export interface OperationsBriefingParams {
  totalAcres: number
  healthyRatio: number
  activeAlertsCount: number
  weatherTemp: number
  weatherCondition: string
}

export interface CropRecommendationSpeechParams {
  location: string
  season: string
  topCropName: string
  suitabilityScore: number
  projectedProfitPerAcre: number
  waterFootprint: string
}

export interface DiseaseAnalyticsSpeechParams {
  location: string
  activeCasesCount: number
  sporePressureIndex: number
  primaryThreat: string
  avoidedLossInr: number
}

export interface CalendarSpeechParams {
  location: string
  totalTasks: number
  urgentTasksCount: number
  isSprayingFavourable: boolean
  activeReiAlert?: string
}

export interface ReportsAuditSpeechParams {
  location: string
  totalAcreageAudited: number
  healthyRatio: number
  mrlStatus: string
  carbonOffsetTons: number
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

export function getSoilHealthAudioNarrative(params: SoilSpeechParams, lang: LanguageCode): string {
  const { fertilityScore, qualityStatus, ph, nitrogen, phosphorus, potassium } = params

  switch (lang) {
    case 'pa':
      return `ਮਿੱਟੀ ਸਿਹਤ ਅਤੇ ਖੁਰਾਕੀ ਤੱਤ ਵਿਸ਼ਲੇਸ਼ਣ। ਤੁਹਾਡੀ ਮਿੱਟੀ ਦਾ ਸਮੁੱਚਾ ਉਪਜਾਊ ਸ਼ਕਤੀ ਸਕੋਰ ${fertilityScore} ਹੈ, ਜੋ ਕਿ ${qualityStatus} ਸਥਿਤੀ ਦਰਸਾਉਂਦਾ ਹੈ। ਮਿੱਟੀ ਦਾ ਪੀ-ਐਚ ${ph} ਹੈ। ਉਪਲਬਧ ਨਾਈਟ੍ਰੋਜਨ ${nitrogen} ਕਿਲੋ, ਫਾਸਫੋਰਸ ${phosphorus} ਕਿਲੋ, ਅਤੇ ਪੋਟਾਸ਼ ${potassium} ਕਿਲੋ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਹੈ। ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਅਤੇ ਜੈਵਿਕ ਰੂੜੀ ਖਾਦ ਪਾਉਣ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`

    case 'hi':
      return `मृदा स्वास्थ्य एवं पोषक तत्व विश्लेषण। आपकी मिट्टी का समग्र उर्वरता सूचकांक स्कोर ${fertilityScore} है, जो कि ${qualityStatus} स्थिति दर्शाता है। मिट्टी का पीएच मान ${ph} है। उपलब्ध नाइट्रोजन ${nitrogen} किलो, फास्फोरस ${phosphorus} किलो, और पोटाश ${potassium} किलो प्रति हेक्टेयर है। संतुलित यूरिया और डीएपी का अनुशंसित विभाजित छिड़काव करें।`

    case 'mr':
      return `माती आरोग्य आणि पोषणद्रव्य विश्लेषण अहवाल। आपल्या शेतातील मातीचा सुपीकता निर्देशांक ${fertilityScore} असून गुणवत्ता स्थिती ${qualityStatus} आहे। मातीचा सामू ${ph} आहे। उपलब्ध नत्र ${nitrogen} किलो, स्फुरद ${phosphorus} किलो आणि पालाश ${potassium} किलो प्रति हेक्टर आहे। रासायनिक खतांचा संतुलित वापर करावा।`

    case 'te':
      return `నేల ఆరోగ్యం మరియు పోషకాల విశ్లేషణ నివేదిక। మీ నేల సారవంతత సూచిక స్కోరు ${fertilityScore}, ఇది ${qualityStatus} స్థితిని సూచిస్తుంది। నేల pH విలువ ${ph}। అందుబాటులో ఉన్న నత్రజని ${nitrogen} కిలోలు, భాస్వరం ${phosphorus} కిలోలు, మరియు పొటాషియం ${potassium} కిలోలు ప్రతి హెక్టారుకు ఉంది। సమతుల్య ఎరువుల నిర్వహణ పాటించండి।`

    default:
      return `Soil health and fertility diagnostic analysis. The composite fertility index is ${fertilityScore} out of 100, indicating ${qualityStatus} condition. Soil pH is measured at ${ph}. Available nitrogen is ${nitrogen} kg, phosphorus is ${phosphorus} kg, and potassium is ${potassium} kg per hectare. Maintain recommended split fertilizer doses and organic carbon incorporation.`
  }
}

export function getMorningOperationsBriefingAudio(params: OperationsBriefingParams, lang: LanguageCode): string {
  const { totalAcres, healthyRatio, activeAlertsCount, weatherTemp, weatherCondition } = params

  switch (lang) {
    case 'pa':
      return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਇਹ ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਖੇਤੀ ਕਮਾਂਡ ਸੰਖੇਪ ਹੈ। ਤੁਹਾਡੇ ਕੁੱਲ ${totalAcres} ਏਕੜ ਰਕਬੇ ਵਿੱਚੋਂ ${healthyRatio} ਪ੍ਰਤੀਸ਼ਤ ਫਸਲ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ। ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${weatherTemp} ਡਿਗਰੀ ਹੈ ਅਤੇ ਮੌਸਮ ${weatherCondition} ਹੈ। ਖੇਤ ਵਿੱਚ ${activeAlertsCount} ਜ਼ਰੂਰੀ ਚੇਤਾਵਨੀਆਂ ਹਨ। ਸੈਕਟਰ ਬੀ-ਦੋ ਵਿੱਚ ਫੁਹਾਰਾ ਸਪਰੇਅ ਦਾ ਕੰਮ ਜਾਰੀ ਹੈ।`

    case 'hi':
      return `नमस्ते। यह आपका दैनिक कृषि कमान सारांश है। आपके कुल ${totalAcres} एकड़ रकबे में से ${healthyRatio} प्रतिशत फसल स्वस्थ है। वर्तमान तापमान ${weatherTemp} डिग्री सेल्सियस और मौसम ${weatherCondition} है। खेत में ${activeAlertsCount} आवश्यक कार्य अलर्ट सक्रिय हैं। सेक्टर बी-2 में छिड़काव कार्य प्राथमिकता पर है।`

    case 'mr':
      return `नमस्कार। हा आपला दैनिक शेती नियंत्रण अहवाल आहे। आपल्या एकूण ${totalAcres} एकर शेतीपैकी ${healthyRatio} टक्के पीक निरोगी आहे। तापमान ${weatherTemp} अंश असून हवामान ${weatherCondition} आहे। शेतात ${activeAlertsCount} महत्त्वाच्या सूचना सक्रिय आहेत।`

    case 'te':
      return `నమస్కారం। ఇది మీ రోజువారీ వ్యవసాయ కార్యకలాపాల నివేదిక। మీ మొత్తం ${totalAcres} ఎకరాలలో ${healthyRatio} శాతం పంట ఆరోగ్యంగా ఉంది। ప్రస్తుత ఉష్ణోగ్రత ${weatherTemp} డిగ్రీలు మరియు వాతావరణం ${weatherCondition}। క్షేత్రంలో ${activeAlertsCount} ముఖ్యమైన హెచ్చరికలు ఉన్నాయి।`

    default:
      return `Good morning. Here is your Krishi Saarthi Farm Operations Command briefing. Across your ${totalAcres} cultivated acres, ${healthyRatio} percent of the canopy is in vigorous health. The ambient temperature is ${weatherTemp} degrees Celsius with ${weatherCondition} conditions. There are ${activeAlertsCount} active agronomic work orders requiring attention today.`
  }
}

export function getCropRecommendationAudioNarrative(params: CropRecommendationSpeechParams, lang: LanguageCode): string {
  const { location, season, topCropName, suitabilityScore, projectedProfitPerAcre, waterFootprint } = params

  switch (lang) {
    case 'pa':
      return `ਖੇਤੀਬਾੜੀ ਫਸਲ ਸਿਫਾਰਸ਼। ${location} ਵਿੱਚ ${season} ਸੀਜ਼ਨ ਲਈ ਸਭ ਤੋਂ ਅਨੁਕੂਲ ਫਸਲ ${topCropName} ਹੈ, ਜਿਸਦਾ ਐਗਰੋ-ਇਕੋਲੋਜੀਕਲ ਸਕੋਰ ${suitabilityScore} ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ਅੰਦਾਜ਼ਨ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ ₹${projectedProfitPerAcre.toLocaleString('en-IN')} ਪ੍ਰਤੀ ਏਕੜ ਹੈ। ਪਾਣੀ ਦੀ ਖਪਤ ${waterFootprint} ਪੱਧਰ ਦੀ ਹੈ। ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਕਿਸਮਾਂ ਅਤੇ ਤੁਪਕਾ ਸਿੰਚਾਈ ਦੀ ਵਰਤੋਂ ਕਰੋ।`

    case 'hi':
      return `कृषि फसल सिफारिश एवं आर्थिक योजना। ${location} में ${season} सत्र के लिए सबसे उपयुक्त फसल ${topCropName} है, जिसका उपयुक्तता स्कोर ${suitabilityScore} प्रतिशत है। अनुमानित शुद्ध लाभ ₹${projectedProfitPerAcre.toLocaleString('en-IN')} प्रति एकड़ है। जल आवश्यकता ${waterFootprint} श्रेणी की है। प्रमाणित बीज किस्मों और संतुलित पोषक प्रबंधन की सिफारिश की जाती है।`

    case 'mr':
      return `कृषी पीक शिफारस आणि आर्थिक नियोजन अहवाल। ${location} मध्ये ${season} हंगामासाठी सर्वोच्च शिफारस केलेले पीक ${topCropName} असून अनुकूलता निर्देशांक ${suitabilityScore} टक्के आहे। निव्वळ नफा ₹${projectedProfitPerAcre.toLocaleString('en-IN')} प्रति एकर अपेक्षित आहे।`

    case 'te':
      return `వ్యవసాయ పంట సిఫార్సు మరియు ఆర్థిక ప్రణాళిక। ${location} లో ${season} సీజన్ కోసం అత్యుత్తమ పంట ${topCropName}, దీని అనుకూలత స్కోరు ${suitabilityScore} శాతం। ఎకరాకు అంచనా నికర లాభం ₹${projectedProfitPerAcre.toLocaleString('en-IN')}.`

    default:
      return `Crop suitability and agronomic economic planning advisory. For the ${season} season in ${location}, the top recommended crop is ${topCropName} with an agro-ecological match score of ${suitabilityScore} percent. Projected net profit is estimated at ₹${projectedProfitPerAcre.toLocaleString('en-IN')} per acre with a ${waterFootprint} water requirement tier. Certified university seed varieties and balanced fertilizer scheduling are recommended.`
  }
}

export function getDiseaseAnalyticsAudioNarrative(params: DiseaseAnalyticsSpeechParams, lang: LanguageCode): string {
  const { location, activeCasesCount, sporePressureIndex, primaryThreat, avoidedLossInr } = params

  switch (lang) {
    case 'pa':
      return `ਫਸਲੀ ਰੋਗ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਮਹਾਂਮਾਰੀ ਸੰਖੇਪ। ${location} ਖੇਤਰ ਵਿੱਚ ${activeCasesCount} ਸਰਗਰਮ ਕੇਸ ਦਰਜ ਹਨ। ਸਪੋਰ ਇਨੋਕੁਲਮ ਦਬਾਅ ਸੂਚਕਾਂਕ ${sporePressureIndex} ਹੈ। ਮੁੱਖ ਖ਼ਤਰਾ ${primaryThreat} ਦਾ ਹੈ। ਸਮੇਂ ਸਿਰ ਉੱਲੀਨਾਸ਼ਕ ਸਪਰੇਅ ਨਾਲ ਲਗਭਗ ₹${avoidedLossInr.toLocaleString('en-IN')} ਦਾ ਸੰਭਾਵੀ ਨੁਕਸਾਨ ਬਚਾਇਆ ਗਿਆ ਹੈ।`

    case 'hi':
      return `पादप रोग एनालिटिक्स एवं पादप स्वच्छता सारांश। ${location} क्षेत्र में कुल ${activeCasesCount} सक्रिय रोग मामले दर्ज हैं। बीजाणु दबाव सूचकांक ${sporePressureIndex} प्रतिशत है। मुख्य रोग जोखिम ${primaryThreat} है। समय पर रासायनिक छिड़काव से लगभग ₹${avoidedLossInr.toLocaleString('en-IN')} के आर्थिक नुकसान का बचाव हुआ है।`

    case 'mr':
      return `पीक रोग विश्लेषण अहवाल। ${location} भागात ${activeCasesCount} सक्रिय रोग नोंदी आढळल्या असून बीजाणू दाब निर्देशांक ${sporePressureIndex} आहे। मुख्य धोका ${primaryThreat} असून ₹${avoidedLossInr.toLocaleString('en-IN')} इतके संभाव्य नुकसान टाळण्यात आले आहे।`

    case 'te':
      return `మొక్కల వ్యాధుల విశ్లేషణ నివేదిక। ${location} లో ${activeCasesCount} యాక్టివ్ కేసులు నమోదయ్యాయి। బీజాంశ పీడన సూచిక ${sporePressureIndex}। ప్రధాన ముప్పు ${primaryThreat}। సకాలంలో నివారణ చర్యలతో ₹${avoidedLossInr.toLocaleString('en-IN')} నష్టం నివారించబడింది।`

    default:
      return `Plant pathology and epidemiological intelligence summary for ${location}. There are ${activeCasesCount} active foliar disease cases under surveillance. The airborne spore pressure index is calculated at ${sporePressureIndex} out of 100 with ${primaryThreat} identified as the primary threat. Proactive agronomic intervention has prevented an estimated ₹${avoidedLossInr.toLocaleString('en-IN')} in crop yield damage.`
  }
}

export function getCalendarOperationsAudio(params: CalendarSpeechParams, lang: LanguageCode): string {
  const { location, totalTasks, urgentTasksCount, isSprayingFavourable } = params

  switch (lang) {
    case 'pa':
      return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਇਹ ${location} ਲਈ ਤੁਹਾਡਾ ਖੇਤੀ ਕੈਲੰਡਰ ਅਤੇ ਕੰਮ ਸੰਖੇਪ ਹੈ। ਅੱਜ ਲਈ ਕੁੱਲ ${totalTasks} ਕੰਮ ਤੈਅ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${urgentTasksCount} ਜ਼ਰੂਰੀ ਤਰਜੀਹ 'ਤੇ ਹਨ। ਮੌਸਮ ਅਨੁਸਾਰ ਸਪਰੇਅ ਕਰਨ ਦੀ ਸਥਿਤੀ ${isSprayingFavourable ? 'ਅਨੁਕੂਲ' : 'ਨਾ-ਅਨੁਕੂਲ'} ਹੈ। ਬੀਜਾਈ ਅਤੇ ਸਿੰਚਾਈ ਦਾ ਕੰਮ ਤੈਅ ਸਮੇਂ ਅਨੁਸਾਰ ਕਰੋ।`

    case 'hi':
      return `नमस्ते। यह ${location} क्षेत्र के लिए आपका दैनिक कृषि कार्य कैलेंडर है। आज कुल ${totalTasks} कार्य निर्धारित हैं, जिनमें से ${urgentTasksCount} कार्य उच्च प्राथमिकता पर हैं। वर्तमान मौसम के अनुसार छिड़काव की स्थिति ${isSprayingFavourable ? 'अनुकूल' : 'प्रतिकूल'} है। अनुशंसित आईसीएआर पैकेज ऑफ प्रैक्टिसेज का पालन करें।`

    case 'mr':
      return `नमस्कार। ${location} भागासाठी हा आपला शेती कार्य दिनदर्शिका अहवाल आहे। आज एकूण ${totalTasks} कामे नियोजित असून ${urgentTasksCount} कामे तातडीची आहेत। फवारणीसाठी हवामान ${isSprayingFavourable ? 'अनुकूल' : 'प्रतिकूल'} आहे।`

    case 'te':
      return `నమస్కారం। ${location} వ్యవసాయ క్యాలెండర్ నివేదిక। ఈ రోజు మొత్తం ${totalTasks} పనులు షెడ్యూల్ చేయబడ్డాయి, ఇందులో ${urgentTasksCount} అత్యవసర పనులు। పిచికారీ చేయడానికి వాతావరణం ${isSprayingFavourable ? 'అనుకూలంగా' : 'ప్రతికూలంగా'} ఉంది।`

    default:
      return `Good day. Here is your farm operations work calendar briefing for ${location}. There are ${totalTasks} scheduled agricultural operations today, with ${urgentTasksCount} marked high priority. Current micro-climate conditions for foliar spraying are ${isSprayingFavourable ? 'favourable' : 'unfavourable due to drift or wash-off risk'}. Adhere to certified re-entry intervals and machinery dispatch guidelines.`
  }
}

export function getReportsAuditAudio(params: ReportsAuditSpeechParams, lang: LanguageCode): string {
  const { location, totalAcreageAudited, healthyRatio, mrlStatus, carbonOffsetTons } = params

  switch (lang) {
    case 'pa':
      return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਇਹ ${location} ਲਈ ਤੁਹਾਡੀ ਐਗਰੋਨੋਮਿਕ ਆਡਿਟ ਅਤੇ ਪਾਲਣਾ ਰਿਪੋਰਟ ਹੈ। ਕੁੱਲ ${totalAcreageAudited} ਏਕੜ ਰਕਬੇ ਦੀ ਜਾਂਚ ਕੀਤੀ ਗਈ ਹੈ, ਜਿਸ ਵਿੱਚੋਂ ${healthyRatio} ਪ੍ਰਤੀਸ਼ਤ ਰਕਬਾ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ। ਨਿਰਯਾਤ ਐਮਆਰਐਲ ਸਥਿਤੀ ${mrlStatus} ਹੈ, ਅਤੇ ਲਗਭਗ ${carbonOffsetTons} ਟਨ ਕਾਰਬਨ ਆਫਸੈੱਟ ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ। ਸਾਰੇ ਪ੍ਰਮਾਣੀਕਰਨ ਵੇਰਵੇ ਡਾਊਨਲੋਡ ਲਈ ਤਿਆਰ ਹਨ।`

    case 'hi':
      return `नमस्ते। यह ${location} के लिए आपका कृषि लेखा-परीक्षण एवं अनुपालन सारांश है। कुल ${totalAcreageAudited} एकड़ कृषि भूमि का ऑडिट संपन्न हुआ है, जिसमें से ${healthyRatio} प्रतिशत फसल पूर्णतः स्वस्थ प्रमाणित है। निर्यात अवशेष एमआरएल स्तर ${mrlStatus} है, और ${carbonOffsetTons} टन कार्बन क्रेडिट संचय दर्ज किया गया है। सभी निर्यात एवं बीमा दस्तावेज डाउनलोड के लिए उपलब्ध हैं।`

    case 'mr':
      return `नमस्कार। ${location} साठी हा आपला शेती लेखापरीक्षण व नियामक पूर्तता अहवाल आहे। एकूण ${totalAcreageAudited} एकर क्षेत्राचे ऑडिट झाले असून ${healthyRatio} टक्के पीक निरोगी आढळले आहे। निर्यात एमआरएल स्थिती ${mrlStatus} असून ${carbonOffsetTons} टन कार्बन क्रेडिट नोंदवले गेले आहे।`

    case 'te':
      return `నమస్కారం। ${location} కోసం వ్యవసాయ ఆడిట్ మరియు ధృవీకరణ నివేదిక। మొత్తం ${totalAcreageAudited} ఎకరాల భూమి తనిఖీ చేయబడింది, ఇందులో ${healthyRatio} శాతం పంట ఆరోగ్యంగా ఉంది। ఎగుమతి ఎంఆర్ఎల్ స్థితి ${mrlStatus} మరియు ${carbonOffsetTons} టన్నుల కార్బన్ క్రెడిట్ నమోదు చేయబడింది।`

    default:
      return `Official agronomic audit and compliance intelligence report for ${location}. Total evaluated estate area is ${totalAcreageAudited} acres with a certified healthy canopy index of ${healthyRatio} percent. Export phytosanitary chemical residue status is evaluated as ${mrlStatus}. Sustainable soil management practices have accrued ${carbonOffsetTons} metric tons of verified agricultural carbon offsets. All geospatial ISO-XML and PMFBY claim packages are compiled and ready.`
  }
}





