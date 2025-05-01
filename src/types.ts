/**
 * Resend API configuration options
 */
export interface ResendConfig {
  /**
   * Resend API key
   */
  apiKey?: string;
  
  /**
   * Default sender email address
   */
  defaultFrom?: string;
  
  /**
   * Default reply-to email address
   */
  defaultReplyTo?: string;
  
  /**
   * Timeout for API requests in milliseconds
   */
  requestTimeout?: number;
}

/**
 * Email message options
 */
export interface EmailMessageOptions {
  /**
   * Recipient email address or addresses
   */
  to: string | string[];
  
  /**
   * Email subject
   */
  subject: string;
  
  /**
   * Email body in HTML format
   */
  html?: string;
  
  /**
   * Email body in plain text format
   */
  text?: string;
  
  /**
   * Sender email address
   */
  from?: string;
  
  /**
   * Reply-to email address
   */
  replyTo?: string;
  
  /**
   * CC recipients
   */
  cc?: string | string[];
  
  /**
   * BCC recipients
   */
  bcc?: string | string[];
  
  /**
   * Email attachments
   */
  attachments?: EmailAttachment[];
  
  /**
   * Email tags for categorization
   */
  tags?: EmailTag[];
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  /**
   * File content as base64 string
   */
  content: string;
  
  /**
   * Filename
   */
  filename: string;
  
  /**
   * MIME type
   */
  type?: string;
  
  /**
   * Content ID for inline attachments
   */
  cid?: string;
}

/**
 * Email tag
 */
export interface EmailTag {
  /**
   * Tag name
   */
  name: string;
  
  /**
   * Tag value
   */
  value: string;
}

/**
 * Template email options
 */
export interface TemplateEmailOptions {
  /**
   * Recipient email address or addresses
   */
  to: string | string[];
  
  /**
   * Template ID
   */
  templateId: string;
  
  /**
   * Template data to be merged
   */
  templateData: Record<string, any>;
  
  /**
   * Sender email address
   */
  from?: string;
  
  /**
   * Reply-to email address
   */
  replyTo?: string;
  
  /**
   * CC recipients
   */
  cc?: string | string[];
  
  /**
   * BCC recipients
   */
  bcc?: string | string[];
  
  /**
   * Email tags for categorization
   */
  tags?: EmailTag[];
}

/**
 * Email response
 */
export interface EmailResponse {
  /**
   * Unique ID of the sent email
   */
  id: string;
  
  /**
   * Success status
   */
  success: boolean;
} 