import { Request, Response } from 'express';
import { TwilioService } from '../services/twilioService.js';
import { WhatsAppService } from '../services/whatsappService.js';
import { GLACIER_CONTACTS, generateEmergencyMessage } from '../utils/messageTemplates.js';

// Define proper interfaces for type safety
interface AlertResult {
  success: boolean;
  messageId?: string;
  status: string;
  cost?: string;
  error?: string;
  note?: string;
}

interface AlertResultWithPhone extends AlertResult {
  phoneNumber: string;
}

interface SMSResults {
  sms: AlertResultWithPhone[];
  whatsapp: AlertResultWithPhone[];
  summary: {
    totalSent: number;
    totalFailed: number;
  };
}

const twilioService = new TwilioService();
const whatsappService = new WhatsAppService();

export const sendSMSAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumbers, message, priority = 'medium' } = req.body;

    if (!phoneNumbers || phoneNumbers.length === 0) {
      res.status(400).json({
        error: 'Phone numbers required (format: ["+918767936699"])'
      });
      return;
    }

    const results: AlertResultWithPhone[] = [];
    
    for (const phoneNumber of phoneNumbers) {
      const result = await twilioService.sendSMS(phoneNumber, message);
      results.push({ 
        phoneNumber,
        success: result.success,
        messageId: result.messageId,
        status: result.status,
        cost: result.cost,
        error: result.error,
        note: result.note
      });
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      status: 'sms_sent',
      priority,
      totalSent: successCount,
      totalFailed: phoneNumbers.length - successCount,
      results,
      deliveryTime: '10-30 seconds'
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'SMS sending failed',
      message: error.message
    });
  }
};

export const sendWhatsAppAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumbers, message, priority = 'medium' } = req.body;

    if (!phoneNumbers || phoneNumbers.length === 0) {
      res.status(400).json({
        error: 'Phone numbers required'
      });
      return;
    }

    const results: AlertResultWithPhone[] = [];
    
    for (const phoneNumber of phoneNumbers) {
      const result = await whatsappService.sendMessage(phoneNumber, message);
      results.push({ 
        phoneNumber,
        success: result.success,
        messageId: result.messageId,
        status: result.status,
        error: result.error,
        note: result.note
      });
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      status: 'whatsapp_sent',
      priority,
      totalSent: successCount,
      totalFailed: phoneNumbers.length - successCount,
      results,
      deliveryTime: '5-15 seconds'
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'WhatsApp sending failed',
      message: error.message
    });
  }
};

export const sendEmergencyAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      phoneNumbers,
      message,
      channels = ['sms', 'whatsapp'],
      lakeId,
      lakeName = 'Unknown Lake',
      location = 'Unknown Location'
    } = req.body;

    const emergencyMsg = `🚨 GLACIAL EMERGENCY 🚨\n${message}\nLake: ${lakeName}\nLocation: ${location}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\nEVACUATE IMMEDIATELY!`;

    const results: SMSResults = {
      sms: [],
      whatsapp: [],
      summary: { totalSent: 0, totalFailed: 0 }
    };

    // Send SMS if requested
    if (channels.includes('sms')) {
      for (const phoneNumber of phoneNumbers) {
        const smsResult = await twilioService.sendSMS(phoneNumber, emergencyMsg);
        const smsResultWithPhone: AlertResultWithPhone = {
          phoneNumber,
          success: smsResult.success,
          messageId: smsResult.messageId,
          status: smsResult.status,
          cost: smsResult.cost,
          error: smsResult.error,
          note: smsResult.note
        };
        
        results.sms.push(smsResultWithPhone);
        
        if (smsResult.success) results.summary.totalSent++;
        else results.summary.totalFailed++;
      }
    }

    // Send WhatsApp if requested
    if (channels.includes('whatsapp')) {
      for (const phoneNumber of phoneNumbers) {
        const wpResult = await whatsappService.sendMessage(phoneNumber, emergencyMsg);
        const wpResultWithPhone: AlertResultWithPhone = {
          phoneNumber,
          success: wpResult.success,
          messageId: wpResult.messageId,
          status: wpResult.status,
          error: wpResult.error,
          note: wpResult.note
        };
        
        results.whatsapp.push(wpResultWithPhone);
        
        if (wpResult.success) results.summary.totalSent++;
        else results.summary.totalFailed++;
      }
    }

    res.json({
      status: 'emergency_alert_dispatched',
      alertLevel: 'CRITICAL',
      lakeId,
      lakeName,
      channelsUsed: channels,
      results,
      totalDeliveryTime: '30-60 seconds',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Emergency alert failed',
      message: error.message
    });
  }
};

export const testAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, channel = 'sms' } = req.body;

    if (!phoneNumber) {
      res.status(400).json({
        error: 'Phone number required for test'
      });
      return;
    }

    const testMessage = `🧪 TEST ALERT: GlacialGuard system operational. Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    let result: AlertResult;
    
    if (channel === 'whatsapp') {
      result = await whatsappService.sendMessage(phoneNumber, testMessage);
    } else {
      result = await twilioService.sendSMS(phoneNumber, testMessage);
    }

    res.json({
      status: 'test_completed',
      channel,
      phoneNumber,
      result,
      message: result.success ? 'Test alert sent successfully!' : 'Test alert failed',
      note: result.success ? 'Check your phone for the test message' : 'Check service configuration'
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Test alert failed',
      message: error.message
    });
  }
};

// Multilingual Emergency Alert Function
export const sendMultilingualEmergencyAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { glacierName, riskScore, floodTimeMinutes = 45, evacuationTimeMinutes = 30 } = req.body;

    const glacierData = GLACIER_CONTACTS[glacierName as keyof typeof GLACIER_CONTACTS];
    if (!glacierData) {
      res.status(400).json({ error: 'Glacier not found in database' });
      return;
    }

    const results: SMSResults = {
      sms: [],
      whatsapp: [],
      summary: { totalSent: 0, totalFailed: 0 }
    };

    // Send alerts in all supported languages for this glacier
    for (const language of glacierData.languages) {
      const message = generateEmergencyMessage({
        glacierName,
        region: glacierData.region,
        safeZone: glacierData.evacuationZones[0],
        floodTimeMinutes,
        evacuationTimeMinutes,
        language
      });

      // Send to all phone numbers for this glacier
      for (const phoneNumber of glacierData.phoneNumbers) {
        // Send SMS
        const smsResult = await twilioService.sendSMS(phoneNumber, message);
        results.sms.push({
          phoneNumber,
          success: smsResult.success,
          messageId: smsResult.messageId,
          status: smsResult.status,
          cost: smsResult.cost,
          error: smsResult.error,
          note: `Language: ${language}`
        });

        // Send WhatsApp
        const wpResult = await whatsappService.sendMessage(phoneNumber, message);
        results.whatsapp.push({
          phoneNumber,
          success: wpResult.success,
          messageId: wpResult.messageId,
          status: wpResult.status,
          error: wpResult.error,
          note: `Language: ${language}`
        });

        // Update counters
        if (smsResult.success) results.summary.totalSent++;
        else results.summary.totalFailed++;
        
        if (wpResult.success) results.summary.totalSent++;
        else results.summary.totalFailed++;
      }
    }

    res.json({
      status: 'multilingual_emergency_alert_dispatched',
      glacierName,
      region: glacierData.region,
      riskScore,
      languagesUsed: glacierData.languages,
      evacuationZones: glacierData.evacuationZones,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Multilingual emergency alert failed',
      message: error.message
    });
  }
};
