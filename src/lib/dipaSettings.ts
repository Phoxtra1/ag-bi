
export type DipaSettings = {
  // When true, Dipa should be considered the primary engine and can auto-open
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
const SETTINGS_KEY = 'dipaSettings';

// Dispatch a custom event so any mounted components can react instantly
export const dispatchDipaSettingsUpdated = (settings: DipaSettings) => {
  window.dispatchEvent(new CustomEvent('dipaSettingsUpdated', { detail: settings }));
};

export const getDipaSettings = (): DipaSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as DipaSettings;
  } catch {
    return {};
  }
};

export const setDipaSettings = (settings: DipaSettings) => {
  const current = getDipaSettings();
  const next = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  dispatchDipaSettingsUpdated(next);
};

// Merge with defaults
export const getResolvedDipaSettings = (): Required<DipaSettings> => {
  const s = getDipaSettings();
  return {
    primary: s.primary ?? true,
    greeting: s.greeting ?? "Hello there! I'm Dipa, your AI assistant at Amniva. How can I help you today?",
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
