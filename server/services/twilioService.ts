// @ts-ignore - suppress twilio typing error
import twilio from 'twilio';

interface SMSResult {
  success: boolean;
  messageId?: string;
  status: string;
  cost?: string;
  error?: string;
  note?: string;
}

export class TwilioService {
  private client: any; // Use any instead of twilio.Twilio
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
    
    if (!accountSid || !authToken) {
      console.warn('⚠️ Twilio credentials missing - SMS will be simulated');
      this.client = null;
    } else {
      this.client = twilio(accountSid, authToken);
    }
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResult> {
    try {
      // Simulate if no credentials
      if (!this.client) {
        console.log(`📱 SIMULATED SMS to ${phoneNumber}: ${message.substring(0, 50)}...`);
        return {
          success: true,
          messageId: `sim_${Date.now()}`,
          status: 'simulated',
          cost: '₹0.50',
          note: 'Simulated - configure Twilio for real SMS'
        };
      }

      const twilioMessage = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      return {
        success: true,
        messageId: twilioMessage.sid,
        status: twilioMessage.status,
        cost: '₹0.50'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }
}
