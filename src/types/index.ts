export interface Contact {
  id: string;
  name: string;
  number: string;
  status?: 'pending' | 'sent' | 'skipped' | 'failed';
  error?: string;
  messageId?: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  payload?: any;
}

export interface BotConfig {
  businessName: string;
  businessLocation: string;
  googleMapsLink: string;
  teamContactNumber: string;
  whatsappToken: string;
  phoneNumberId: string;
  verifyToken: string;
  defaultTemplateName: string;
  defaultLanguage: string;
  senderName: string;
  businessType: string;
}

export interface LogEntry {
  timestamp: string;
  number: string;
  name: string;
  status: 'SENT' | 'SKIPPED' | 'FAILED';
  error?: string;
  messageId?: string;
}

export interface DeliverableFile {
  filename: string;
  title: string;
  language: string;
  description: string;
  content: string;
}
