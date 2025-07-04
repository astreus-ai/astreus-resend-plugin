![Resend Plugin](src/assets/resend-plugin.webp)

# Astreus Resend Plugin

An email integration plugin for the Astreus AI agent framework, allowing agents to send emails using [Resend](https://resend.com).

## Features

- **Official Resend API Integration**: Uses the official Resend API for reliable email delivery
- **Template Support**: Send emails using pre-built templates with dynamic data
- **Rich Email Content**: Support for both HTML and plain text emails
- **Flexible Recipients**: Support for CC and BCC recipients
- **Custom Sender Configuration**: Configurable sender and reply-to addresses
- **Enhanced Logging**: Detailed logging of email operations for improved debugging
- **Integration with Astreus Logger**: Consistent logging patterns with the core framework

## Installation

```bash
npm install @astreus-ai/resend-plugin
```

## Configuration

Create a `.env` file with your Resend API configuration:

```env
# Resend API configuration
RESEND_API_KEY=your_resend_api_key
RESEND_DEFAULT_FROM=you@example.com
RESEND_DEFAULT_REPLY_TO=optional_reply_to@example.com

# Logging options
LOG_LEVEL=info  # Options: error, warn, info, debug
```

To get these values:
1. Create a Resend account at https://resend.com/
2. Generate an API key from your Resend dashboard
3. Verify your sending domain

## Usage

### Basic Usage

```typescript
import { createAgent, createProvider, createMemory, createDatabase } from '@astreus-ai/astreus';
import ResendPlugin from '@astreus-ai/resend-plugin';

// Initialize database and memory
const db = await createDatabase();
const memory = await createMemory({ database: db });
const provider = createProvider({ type: 'openai', model: 'gpt-4o-mini' });

// Create a Resend plugin instance
const resendPlugin = new ResendPlugin();

// Initialize the plugin
await resendPlugin.init();

// Create an agent with the Resend plugin
const agent = await createAgent({
  name: 'Email Agent',
  description: 'An agent that can send emails',
  provider: provider,
  memory: memory,
  database: db
});

// Add Resend plugin tools to the agent
resendPlugin.getTools().forEach(tool => agent.addTool(tool));

// Now the agent can use email functionality
const response = await agent.chat(`Send an email to john@example.com with subject "Welcome" and message "Hello, welcome to our service!"`);
```

### Custom Configuration

```typescript
import { createAgent, createProvider, createMemory, createDatabase } from '@astreus-ai/astreus';
import ResendPlugin from '@astreus-ai/resend-plugin';

// Initialize database and memory
const db = await createDatabase();
const memory = await createMemory({ database: db });
const provider = createProvider({ type: 'openai', model: 'gpt-4o-mini' });

// Create a plugin with custom configuration
const resendPlugin = new ResendPlugin({
  apiKey: 'your_resend_api_key',
  defaultFrom: 'you@example.com',
  defaultReplyTo: 'reply@example.com',
  logLevel: 'debug'  // Set logging verbosity
});

// Initialize the plugin
await resendPlugin.init();

// Create an agent with the plugin
const agent = await createAgent({
  name: 'Email Agent',
  description: 'An agent that can send emails',
  provider: provider,
  memory: memory,
  database: db
});

// Add Resend plugin tools to the agent
resendPlugin.getTools().forEach(tool => agent.addTool(tool));
```

## Available Tools

The Resend plugin provides the following tools to Astreus agents:

- `resend_send_email`: Send a text or HTML email to recipients
- `resend_send_template_email`: Send an email using a pre-built template with dynamic data

### Send an Email

```typescript
const response = await agent.execute('resend_send_email', {
  to: 'recipient@example.com',
  subject: 'Hello from Astreus',
  html: '<h1>Hello World</h1><p>This is a test email from Astreus using Resend.</p>',
  text: 'Hello World! This is a test email from Astreus using Resend.',
  from: 'custom@example.com', // Optional, overrides default
  replyTo: 'reply@example.com', // Optional, overrides default
  cc: 'cc@example.com', // Optional
  bcc: 'bcc@example.com' // Optional
});

console.log(`Email sent with ID: ${response.id}`);
```

### Send a Template Email

```typescript
const response = await agent.execute('resend_send_template_email', {
  to: 'recipient@example.com',
  templateId: 'template_123abc',
  templateData: {
    name: 'John Doe',
    verificationCode: '123456',
    link: 'https://example.com/verify'
  },
  from: 'custom@example.com', // Optional, overrides default
  replyTo: 'reply@example.com', // Optional, overrides default
  cc: 'cc@example.com', // Optional
  bcc: 'bcc@example.com' // Optional
});

console.log(`Template email sent with ID: ${response.id}`);
```

## Error Handling

The plugin methods throw descriptive errors when something goes wrong. Always wrap the calls in try/catch blocks:

```typescript
try {
  const response = await agent.execute('resend_send_email', { /* ... */ });
  console.log(`Email sent with ID: ${response.id}`);
} catch (error) {
  console.error('Failed to send email:', error.message);
}
```

## Debugging

The plugin includes logging capabilities to help troubleshoot issues. You can adjust the logging level using the `LOG_LEVEL` environment variable or by setting the `logLevel` option when creating the plugin instance.

## Resend API Documentation

For more details on the Resend API, refer to the official documentation:
[Resend API Documentation](https://resend.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Astreus Team - [https://astreus.org](https://astreus.org)

Project Link: [https://github.com/astreus-ai/astreus-resend-plugin](https://github.com/astreus-ai/astreus-resend-plugin) 