import { useState } from 'react';
import type {
  NotificationSettings,
  SecuritySettings,
  PreferenceSettings,
} from '../types/settings.types';

export function useAccountSettings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    invoiceCreated: true,
    invoicePaid: true,
    invoiceOverdue: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    language: 'es',
    theme: 'light',
  });

  const updateNotif = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return {
    notifications,
    security,
    preferences,
    setSecurity,
    setPreferences,
    updateNotif,
  };
}