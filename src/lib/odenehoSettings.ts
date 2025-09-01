
export type OdenehoSettings = {
  // When true, Odeneho should be considered the primary engine and can auto-open
  primary?: boolean;
  // Optional custom greeting for first message
  greeting?: string;
  // Auto-open the widget when the page loads
  autoOpen?: boolean;
  // Control typing animation on/off
  typingAnimation?: boolean;
  // Override default quick actions
  quickActions?: string[];
};

// Storage key used across the app
const SETTINGS_KEY = 'odenehoSettings';

// Dispatch a custom event so any mounted components can react instantly
export const dispatchOdenehoSettingsUpdated = (settings: OdenehoSettings) => {
  window.dispatchEvent(new CustomEvent('odenehoSettingsUpdated', { detail: settings }));
};

export const getOdenehoSettings = (): OdenehoSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OdenehoSettings;
  } catch {
    return {};
  }
};

export const setOdenehoSettings = (settings: OdenehoSettings) => {
  const current = getOdenehoSettings();
  const next = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  dispatchOdenehoSettingsUpdated(next);
};

// Merge with defaults
export const getResolvedOdenehoSettings = (): Required<OdenehoSettings> => {
  const s = getOdenehoSettings();
  return {
    primary: s.primary ?? true,
    greeting: s.greeting ?? "Hello there! I'm Odeneho, your AI assistant at Amniva. How can I help you today?",
    autoOpen: s.autoOpen ?? false,
    typingAnimation: s.typingAnimation ?? true,
    quickActions: s.quickActions ?? [
      "Hello! How are you?",
      "How does fact-checking work?",
      "Tell me about API integration",
      "What are your pricing plans?",
      "I need help with my account",
    ],
  };
};
