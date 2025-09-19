import axios from 'axios';

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  status: string;
  error?: string;
  note?: string;
}

export class WhatsAppService {
  private accessToken: string | undefined;
  private phoneNumberId: string | undefined;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}`;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<WhatsAppResult> {
    try {
      // Simulate if no credentials
      if (!this.accessToken || !this.phoneNumberId) {
        console.log(`📱 SIMULATED WhatsApp to ${phoneNumber}: ${message.substring(0, 50)}...`);
        return {
          success: true,
          messageId: `wp_sim_${Date.now()}`,
          status: 'simulated',
          note: 'Simulated - configure WhatsApp Business API for real messages'
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        status: 'sent'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        status: 'failed'
      };
    }
  }
}
