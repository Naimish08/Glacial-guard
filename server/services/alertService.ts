import { TwilioService } from './twilioService';
import { WhatsAppService } from './whatsappService';
import { EmergencyAlert, MultiChannelResult } from '../types/alert.types';
import { generateEmergencyMessage } from '../utils/messageTemplates';

export class AlertService {
  private twilioService: TwilioService;
  private whatsappService: WhatsAppService;

  constructor() {
    this.twilioService = new TwilioService();
    this.whatsappService = new WhatsAppService();
  }

  async sendEmergencyAlert(alert: EmergencyAlert): Promise<{
    success: boolean;
    results: MultiChannelResult[];
    summary: {
      totalSent: number;
      totalFailed: number;
      smsDelivered: number;
      whatsappDelivered: number;
    };
  }> {
    const message = generateEmergencyMessage({
      lakeName: alert.lakeName,
      safeZone: alert.safeZone,
      floodTimeMinutes: alert.floodTimeMinutes,
      evacuationTimeMinutes: alert.evacuationTimeMinutes,
      language: alert.language || 'english'
    });

    const results: MultiChannelResult[] = [];
    let totalSent = 0;
    let totalFailed = 0;
    let smsDelivered = 0;
    let whatsappDelivered = 0;

    for (const phoneNumber of alert.phoneNumbers) {
      const channelResults: MultiChannelResult = { phoneNumber };

      // Send SMS if requested
      if (alert.channels.includes('sms')) {
        const smsResult = await this.twilioService.sendSMS(phoneNumber, message);
        channelResults.sms = smsResult;
        
        if (smsResult.success) {
          smsDelivered++;
          totalSent++;
        } else {
          totalFailed++;
        }
      }

      // Send WhatsApp if requested
      if (alert.channels.includes('whatsapp')) {
        const whatsappResult = await this.whatsappService.sendMessage(phoneNumber, message);
        channelResults.whatsapp = whatsappResult;
        
        if (whatsappResult.success) {
          whatsappDelivered++;
          totalSent++;
        } else {
          totalFailed++;
        }
      }

      results.push(channelResults);
    }

    return {
      success: totalSent > 0,
      results,
      summary: {
        totalSent,
        totalFailed,
        smsDelivered,
        whatsappDelivered
      }
    };
  }

  async sendQuickAlert(phoneNumbers: string[], message: string, channels: ('sms' | 'whatsapp')[] = ['sms']): Promise<MultiChannelResult[]> {
    const results: MultiChannelResult[] = [];

    for (const phoneNumber of phoneNumbers) {
      const channelResults: MultiChannelResult = { phoneNumber };

      if (channels.includes('sms')) {
        channelResults.sms = await this.twilioService.sendSMS(phoneNumber, message);
      }

      if (channels.includes('whatsapp')) {
        channelResults.whatsapp = await this.whatsappService.sendMessage(phoneNumber, message);
      }

      results.push(channelResults);
    }

    return results;
  }
}

