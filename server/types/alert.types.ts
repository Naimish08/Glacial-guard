export interface PhoneAlert {
  phoneNumbers: string[];
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: ('sms' | 'whatsapp')[];
  language?: 'english' | 'hindi' | 'garhwali' | 'kumaoni';
}

export interface EmergencyAlert extends PhoneAlert {
  lakeId: string;
  lakeName: string;
  riskScore: number;
  floodTimeMinutes: number;
  evacuationTimeMinutes: number;
  safeZone: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface AlertResult {
  success: boolean;
  messageId?: string;
  status: string;
  cost?: string;
  error?: string;
  deliveryTime?: string;
}

export interface MultiChannelResult {
  phoneNumber: string;
  sms?: AlertResult;
  whatsapp?: AlertResult;
}

