import { Resend } from 'resend';
import { 
  ResendConfig, 
  EmailMessageOptions, 
  TemplateEmailOptions,
  EmailResponse 
} from './types';
import { logger } from '@astreus-ai/astreus';

/**
 * Client for Resend API
 */
export class ResendClient {
  private client: Resend;
  private config: ResendConfig;
  
  /**
   * Initialize a new Resend API client
   * @param config Configuration for the Resend API
   */
  constructor(config: ResendConfig) {
    this.config = {
      defaultFrom: 'onboarding@resend.dev',
      requestTimeout: 10000,
      ...config
    };
    
    if (!this.config.apiKey) {
      logger.warn('Resend API key not provided. Email functionality will not work.');
    }
    
    this.client = new Resend(this.config.apiKey);
  }
  
  /**
   * Check if the client is properly configured
   * @returns True if the client is configured, false otherwise
   */
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
  
  /**
   * Format the email options for the Resend API
   * @param options Email message options
   * @returns Formatted options for the Resend API
   */
  private formatEmailOptions(options: EmailMessageOptions): Record<string, any> {
    return {
      from: options.from || this.config.defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo || this.config.defaultReplyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
      tags: options.tags
    };
  }
  
  /**
   * Send an email
   * @param options Email message options
   * @returns Response with email ID and success status
   */
  async sendEmail(options: EmailMessageOptions): Promise<EmailResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Resend API key not configured. Please set RESEND_API_KEY in your environment or pass it in the constructor.');
      }
      
      if (!options.html && !options.text) {
        throw new Error('Either html or text content must be provided for the email.');
      }
      
      const formattedOptions = this.formatEmailOptions(options);
      
      const response = await this.client.emails.send(formattedOptions as any);
      
      if (!response || !response.data?.id) {
        throw new Error('Failed to send email: No response from Resend API');
      }
      
      return {
        id: response.data.id,
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to send email: ${errorMessage}`);
      
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
  
  /**
   * Send an email using a template
   * @param options Template email options
   * @returns Response with email ID and success status
   */
  async sendTemplateEmail(options: TemplateEmailOptions): Promise<EmailResponse> {
    try {
      if (!this.isConfigured()) {
        throw new Error('Resend API key not configured. Please set RESEND_API_KEY in your environment or pass it in the constructor.');
      }
      
      if (!options.templateId) {
        throw new Error('Template ID must be provided for template emails.');
      }
      
      const formattedOptions = {
        from: options.from || this.config.defaultFrom,
        to: options.to,
        reply_to: options.replyTo || this.config.defaultReplyTo,
        cc: options.cc,
        bcc: options.bcc,
        tags: options.tags,
        template: options.templateId,
        data: options.templateData
      };
      
      const response = await this.client.emails.send(formattedOptions as any);
      
      if (!response || !response.data?.id) {
        throw new Error('Failed to send template email: No response from Resend API');
      }
      
      return {
        id: response.data.id,
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to send template email: ${errorMessage}`);
      
      throw new Error(`Failed to send template email: ${errorMessage}`);
    }
  }
} 