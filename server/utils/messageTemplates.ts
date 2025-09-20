interface EmergencyMessageParams {
  glacierName: string;
  region: string;
  safeZone: string;
  floodTimeMinutes: number;
  evacuationTimeMinutes: number;
  language: string;
}

const messageTemplates = {
  english: `🚨 GLACIAL EMERGENCY ALERT 🚨
Glacier: {glacierName}
Region: {region}
Risk Level: CRITICAL
Expected Flood: {floodTimeMinutes} minutes
Evacuation Zone: {safeZone}
Time: {currentTime}

⚠️ EVACUATE IMMEDIATELY TO SAFE AREAS ⚠️
Stay on high ground. Follow local authorities.`,

  hindi: `🚨 हिमनदी आपातकालीन अलर्ट 🚨
हिमनद: {glacierName}
क्षेत्र: {region}
जोखिम स्तर: अतिखतरनाक
अपेक्षित बाढ़: {floodTimeMinutes} मिनट
निकासी क्षेत्र: {safeZone}
समय: {currentTime}

⚠️ तुरंत सुरक्षित स्थानों पर जाएं ⚠️
ऊंची जगह रहें। स्थानीय अधिकारियों का पालन करें।`,

  garhwali: `🚨 हिमनद की खतरनाक स्थिति 🚨
हिमनद: {glacierName}
जागा: {region}
खतरा: बहुत ज्यादा
बाढ़: {floodTimeMinutes} मिनट मा आली
सुरक्षित जागा: {safeZone}

⚠️ तुरंत सुरक्षित जागा जाव ⚠️
ऊंची जागा रयाव। अधिकारी की बात मानाव।`,

  kumaoni: `🚨 हिमनदी खतरा 🚨
हिमनद: {glacierName}
जगा: {region}
खतरा: बड़ा
बाढ़: {floodTimeMinutes} मिनट मा
सुरक्षित जगा: {safeZone}

⚠️ सुरक्षित जगा भाग जाव ⚠️
ऊंची जगा रयाव।`,

  nepali: `🚨 हिमनदी आपतकालीन चेतावनी 🚨
हिमनद: {glacierName}
स्थान: {region}
जोखिम: अति उच्च
बाढी: {floodTimeMinutes} मिनेटमा
सुरक्षित ठाउँ: {safeZone}

⚠️ तुरुन्त सुरक्षित ठाउँमा जानुहोस् ⚠️`,

  urdu: `🚨 برفانی ہنگامی انتباہ 🚨
گلیشیر: {glacierName}
علاقہ: {region}
خطرے کی سطح: انتہائی بلند
سیلاب: {floodTimeMinutes} منٹ میں
محفوظ علاقہ: {safeZone}

⚠️ فوری طور پر محفوظ علاقوں میں جائیں ⚠️`
};

export function generateEmergencyMessage(params: EmergencyMessageParams): string {
  const template = messageTemplates[params.language as keyof typeof messageTemplates] || messageTemplates.english;
  
  return template
    .replace(/{glacierName}/g, params.glacierName)
    .replace(/{region}/g, params.region)
    .replace(/{safeZone}/g, params.safeZone)
    .replace(/{floodTimeMinutes}/g, params.floodTimeMinutes.toString())
    .replace(/{evacuationTimeMinutes}/g, params.evacuationTimeMinutes.toString())
    .replace(/{currentTime}/g, new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
}

export const GLACIER_CONTACTS = {
  "Bara Shigri": {
    region: "Himachal Pradesh",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "english"],
    evacuationZones: ["Keylong", "Manali"]
  },
  "Baspa": {
    region: "Himachal Pradesh",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "english"],
    evacuationZones: ["Chitkul", "Sangla"]
  },
  "Chandra": {
    region: "Himachal Pradesh",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "english"],
    evacuationZones: ["Batal", "Chatru"]
  },
  "Durung-Drung": {
    region: "Ladakh",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "english"],
    evacuationZones: ["Padum", "Zangla"]
  },
  "Gangotri": {
    region: "Uttarakhand",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "garhwali", "kumaoni", "english"],
    evacuationZones: ["Gangotri", "Uttarkashi"]
  },
  "Khumbu": {
    region: "Nepal",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["nepali", "english"],
    evacuationZones: ["Namche Bazaar", "Lukla"]
  },
  "Rongbuk": {
    region: "Tibet",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["tibetan", "english"],
    evacuationZones: ["Rongbuk Monastery", "Base Camp"]
  },
  "Siachen": {
    region: "Kashmir",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["urdu", "hindi", "english"],
    evacuationZones: ["Nubra Valley", "Diskit"]
  },
  "Thajwas": {
    region: "Kashmir",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["urdu", "hindi", "english"],
    evacuationZones: ["Sonamarg", "Gund"]
  },
  "Yamunotri": {
    region: "Uttarakhand",
    phoneNumbers: ["+918767936699", "+917218147401"],
    languages: ["hindi", "garhwali", "kumaoni", "english"],
    evacuationZones: ["Yamunotri", "Hanuman Chatti"]
  }
};


export function generateTestMessage(language = 'english'): string {
  const templates = {
    english: '🧪 TEST ALERT: This is a test message from GlacialGuard emergency system. System operational.',
    hindi: '🧪 परीक्षण अलर्ट: यह ग्लेशियल गार्ड आपातकालीन सिस्टम से परीक्षण संदेश है। सिस्टम चालू है।',
    garhwali: '🧪 टेस्ट: ग्लेशियल गार्ड सिस्टम ठीक च।',
    kumaoni: '🧪 टेस्ट: ग्लेशियल गार्ड सिस्टम ठीक छ।'
  };
  return templates[language as keyof typeof templates] || templates.english;
}
