# Astreus Resend Plugin

Email integration plugin for Astreus AI using [Resend](https://resend.com).

## Installation

```bash
npm install astreus-resend-plugin
```

## Prerequisites

- An [Astreus](https://github.com/astreus-ai/astreus) project
- A [Resend](https://resend.com) account and API key

## Configuration

Create a `.env` file in your project with the following variables:

```
RESEND_API_KEY=your_resend_api_key
RESEND_DEFAULT_FROM=you@example.com
RESEND_DEFAULT_REPLY_TO=optional_reply_to@example.com
```

You can also pass the configuration directly when initializing the plugin.

## Usage

### Initialize the plugin

```typescript
import { Astreus } from 'astreus';
import ResendPlugin from 'astreus-resend-plugin';

// Initialize Astreus
const astreus = new Astreus();

// Initialize the Resend plugin with environment variables
const resendPlugin = new ResendPlugin();
await resendPlugin.init();

// Or with explicit configuration
const resendPlugin = new ResendPlugin({
  apiKey: 'your_resend_api_key',
  defaultFrom: 'you@example.com',
  defaultReplyTo: 'reply@example.com'
});
await resendPlugin.init();

// Register the plugin with Astreus
astreus.registerPlugin(resendPlugin);
```

### Available Tools

Once registered, the plugin provides the following tools:

#### 1. Send an Email

```typescript
const response = await astreus.execute('resend_send_email', {
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

#### 2. Send a Template Email

```typescript
const response = await astreus.execute('resend_send_template_email', {
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

## Features

- Send HTML and plain text emails
- Send emails using templates
- Customizable sender and reply-to addresses
- Support for CC and BCC recipients

## Error Handling

The plugin methods throw descriptive errors when something goes wrong. Always wrap the calls in try/catch blocks:

```typescript
try {
  const response = await astreus.execute('resend_send_email', { /* ... */ });
  console.log(`Email sent with ID: ${response.id}`);
} catch (error) {
  console.error('Failed to send email:', error.message);
}
```

## License

MIT 