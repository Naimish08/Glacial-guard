interface EmergencyMessageParams {
  lakeName: string;
  safeZone: string;
  floodTimeMinutes: number;
  evacuationTimeMinutes: number;
  language: string;
}

export function generateEmergencyMessage(params: EmergencyMessageParams): string {
  const { lakeName, safeZone, floodTimeMinutes, evacuationTimeMinutes, language } = params;
  
  const templates = {
    english: `🚨 GLACIAL FLOOD EMERGENCY 🚨\n\nDANGER: Flood from ${lakeName}!\nEVACUATE TO: ${safeZone}\nFLOOD ARRIVAL: ${floodTimeMinutes} minutes\nEVACUATION TIME: ${evacuationTimeMinutes} minutes\n\nACT NOW - SAVE LIVES!`,
    
    hindi: `🚨 हिमनदी बाढ़ आपातकाल 🚨\n\nखतरा: ${lakeName} से बाढ़!\nयहाँ जाएं: ${safeZone}\nबाढ़ आने का समय: ${floodTimeMinutes} मिनट\nनिकलने का समय: ${evacuationTimeMinutes} मिनट\n\nअभी कार्य करें - जीवन बचाएं!`,
    
    garhwali: `🚨 हिमनद की बाढ़ - आपातकाल 🚨\n\n${lakeName} से खतरनाक बाढ़!\n${safeZone} में जाओ!\n${floodTimeMinutes} मिनट में बाढ़!\n\nजान बचाव!`,
    
    kumaoni: `🚨 हिमनदी बाढ़ खतरा 🚨\n\n${lakeName} बाट बाढ़!\n${safeZone} मा जाव!\n${floodTimeMinutes} मिनट!\n\nजिन्दगी बचाव!`
  };

  return templates[language as keyof typeof templates] || templates.english;
}

export function generateTestMessage(language = 'english'): string {
  const templates = {
    english: '🧪 TEST ALERT: This is a test message from GlacialGuard emergency system. System operational.',
    hindi: '🧪 परीक्षण अलर्ट: यह ग्लेशियल गार्ड आपातकालीन सिस्टम से परीक्षण संदेश है। सिस्टम चालू है।',
    garhwali: '🧪 टेस्ट: ग्लेशियल गार्ड सिस्टम ठीक च।',
    kumaoni: '🧪 टेस्ट: ग्लेशियल गार्ड सिस्टम ठीक छ।'
  };

  return templates[language as keyof typeof templates] || templates.english;
}

