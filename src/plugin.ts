import { ResendClient } from './client';
import { 
  ResendConfig, 
  EmailMessageOptions, 
  TemplateEmailOptions,
  EmailResponse 
} from './types';
import dotenv from 'dotenv';
import { ToolParameterSchema, Plugin, PluginConfig, PluginInstance, logger } from '@astreus-ai/astreus';

// Load environment variables
dotenv.config();

/**
 * Resend Plugin for Astreus
 * This plugin provides email functionality using the Resend API
 */
export class ResendPlugin implements PluginInstance {
  public name = 'resend';
  public description = 'Resend email integration for Astreus agents';
  private client: ResendClient | null = null;
  private resendConfig: ResendConfig;
  private tools: Map<string, Plugin> = new Map();
  public config: PluginConfig;

  constructor(config?: ResendConfig) {
    this.resendConfig = config || {
      apiKey: process.env.RESEND_API_KEY,
      defaultFrom: process.env.RESEND_DEFAULT_FROM,
      defaultReplyTo: process.env.RESEND_DEFAULT_REPLY_TO
    };

    // Initialize plugin config
    this.config = {
      name: 'resend',
      description: 'Resend email integration for Astreus agents',
      version: '1.0.0',
      tools: []
    };

    // Initialize tools
    this.initializeTools();
  }

  /**
   * Initialize the Resend client
   */
  async init(): Promise<void> {
    try {
      // Initialize client
      this.client = new ResendClient(this.resendConfig);
      
      // Verify client is configured properly
      if (!this.client.isConfigured()) {
        throw new Error('Resend client is not properly configured. Check your API key.');
      }
      
      // Update tools with initialized client
      this.initializeTools();
      
      // Log a summary of tools
      this.logToolsSummary();
      
      logger.success('Resend email plugin initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Resend plugin:', error);
      throw new Error(`Resend plugin initialization failed: ${error}`);
    }
  }

  /**
   * Log a summary of the tools initialized
   */
  private logToolsSummary(): void {
    const toolNames = Array.from(this.tools.keys());
    logger.info(`Resend plugin registered ${toolNames.length} tools: ${toolNames.join(', ')}`);
  }

  /**
   * Initialize tools for Astreus compatibility
   */
  private initializeTools(): void {
    // Convert manifests to Astreus Plugin objects
    const manifests = this.getManifests();
    
    for (const manifest of manifests) {
      const plugin: Plugin = {
        name: manifest.name,
        description: manifest.description,
        parameters: this.convertParameters(manifest.parameters),
        execute: async (params: Record<string, any>) => {
          // Make sure client is initialized
          if (!this.client) {
            throw new Error('Resend client not initialized. Call init() first.');
          }

          // Execute the appropriate method based on the tool name
          const methodName = manifest.name.replace('resend_', '');
          let result;
          
          try {
            switch (methodName) {
              case 'send_email':
                result = await this.sendEmail(params);
                break;
              case 'send_template_email':
                result = await this.sendTemplateEmail(params);
                break;
              default:
                throw new Error(`Unknown method: ${methodName}`);
            }
            
            // Ensure we return a newly created object, not a reference to the input
            if (result === params) {
              if (typeof params === 'object' && params !== null) {
                result = { ...params };
              }
            }
            
            return result;
          } catch (error) {
            logger.error(`Error executing tool ${manifest.name}:`, error);
            if (error instanceof Error) {
              throw error;
            } else {
              throw new Error(`Error executing ${methodName}: ${error}`);
            }
          }
        }
      };

      // Add tool to the map
      this.tools.set(manifest.name, plugin);
    }

    // Update plugin config tools
    this.config.tools = Array.from(this.tools.values());
  }

  /**
   * Convert OpenAPI-style parameters to Astreus ToolParameterSchema
   */
  private convertParameters(params: any): ToolParameterSchema[] {
    const result: ToolParameterSchema[] = [];
    
    if (params && params.properties) {
      for (const [name, prop] of Object.entries<any>(params.properties)) {
        const type = prop.type as string;
        // Ensure type is one of the allowed values
        const validType = ["string", "number", "boolean", "object", "array"].includes(type) 
          ? type as "string" | "number" | "boolean" | "object" | "array"
          : "string"; // Default to string if not a valid type
          
        result.push({
          name,
          type: validType,
          description: prop.description || '',
          required: params.required?.includes(name) || false
        });
      }
    }
    
    return result;
  }

  /**
   * Get the manifests for chatbot function calls
   */
  getManifests() {
    return [
      {
        name: 'resend_send_email',
        description: 'Send an email using Resend',
        parameters: {
          type: 'object',
          properties: {
            to: {
              type: 'string',
              description: 'Recipient email address or comma-separated list of addresses'
            },
            subject: {
              type: 'string',
              description: 'Email subject line'
            },
            html: {
              type: 'string',
              description: 'HTML content of the email'
            },
            text: {
              type: 'string',
              description: 'Plain text content of the email'
            },
            from: {
              type: 'string',
              description: 'Sender email address (overrides default)'
            },
            replyTo: {
              type: 'string',
              description: 'Reply-to email address (overrides default)'
            },
            cc: {
              type: 'string',
              description: 'CC email address or comma-separated list of addresses'
            },
            bcc: {
              type: 'string',
              description: 'BCC email address or comma-separated list of addresses'
            }
          },
          required: ['to', 'subject']
        }
      },
      {
        name: 'resend_send_template_email',
        description: 'Send an email using a Resend template',
        parameters: {
          type: 'object',
          properties: {
            to: {
              type: 'string',
              description: 'Recipient email address or comma-separated list of addresses'
            },
            templateId: {
              type: 'string',
              description: 'ID of the email template to use'
            },
            templateData: {
              type: 'object',
              description: 'Data to populate the template with'
            },
            from: {
              type: 'string',
              description: 'Sender email address (overrides default)'
            },
            replyTo: {
              type: 'string',
              description: 'Reply-to email address (overrides default)'
            },
            cc: {
              type: 'string',
              description: 'CC email address or comma-separated list of addresses'
            },
            bcc: {
              type: 'string',
              description: 'BCC email address or comma-separated list of addresses'
            }
          },
          required: ['to', 'templateId', 'templateData']
        }
      }
    ];
  }

  /**
   * Get all registered tools
   */
  getTools(): Plugin[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get a tool by name
   */
  getTool(name: string): Plugin | undefined {
    return this.tools.get(name);
  }

  /**
   * Register a new tool
   */
  registerTool(tool: Plugin): void {
    this.tools.set(tool.name, tool);
    this.config.tools = Array.from(this.tools.values());
  }

  /**
   * Remove a tool by name
   */
  removeTool(name: string): boolean {
    const result = this.tools.delete(name);
    this.config.tools = Array.from(this.tools.values());
    return result;
  }

  /**
   * Get a tool by its full name
   */
  getToolByFullName(fullName: string): Plugin | undefined {
    return this.getTools().find(tool => tool.name === fullName);
  }

  /**
   * Debug the plugin interface
   */
  public debugPluginInterface(): boolean {
    logger.info(`Plugin [${this.name}] Configuration:`);
    logger.info(`  Tools: ${this.getTools().map(t => t.name).join(', ')}`);
    
    for (const tool of this.getTools()) {
      logger.info(`  Tool: ${tool.name}`);
      logger.info(`    Parameters: ${tool.parameters.map(p => p.name).join(', ')}`);
    }
    
    return true;
  }

  /**
   * Send an email
   */
  async sendEmail(params: Record<string, any>): Promise<EmailResponse> {
    if (!this.client) {
      throw new Error('Resend client not initialized. Call init() first.');
    }
    
    // Convert to proper format expected by the client
    const options: EmailMessageOptions = {
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      from: params.from,
      replyTo: params.replyTo,
      cc: params.cc,
      bcc: params.bcc
    };
    
    try {
      return await this.client.sendEmail(options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to send email: ${errorMessage}`);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  /**
   * Send a template email
   */
  async sendTemplateEmail(params: Record<string, any>): Promise<EmailResponse> {
    if (!this.client) {
      throw new Error('Resend client not initialized. Call init() first.');
    }
    
    // Convert to proper format expected by the client
    const options: TemplateEmailOptions = {
      to: params.to,
      templateId: params.templateId,
      templateData: params.templateData || {},
      from: params.from,
      replyTo: params.replyTo,
      cc: params.cc,
      bcc: params.bcc
    };
    
    try {
      return await this.client.sendTemplateEmail(options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to send template email: ${errorMessage}`);
      throw new Error(`Failed to send template email: ${errorMessage}`);
    }
  }
} 