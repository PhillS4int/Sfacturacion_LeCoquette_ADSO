export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'system';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  invoiceCreated: boolean;
  invoicePaid: boolean;
  invoiceOverdue: boolean;
}

export interface SecuritySettings {
  twoFactor: boolean;
}

export interface PreferenceSettings {
  language: Language;
  theme: Theme;
}