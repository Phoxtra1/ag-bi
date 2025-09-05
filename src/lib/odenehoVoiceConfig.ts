
export type OdenehoVoiceConfig = {
  enabled: boolean;
  streaming: boolean; // enable streaming mode
  sttProvider: 'elevenlabs';
  ttsProvider: 'elevenlabs';
  elevenApiKey?: string; // XI_API_KEY (frontend storage for now)
  agentId?: string; // ElevenLabs Conversational AI agent id (public agent supported)
};

const KEY = 'odenehoVoiceConfig';

export const getOdenehoVoiceConfig = (): OdenehoVoiceConfig => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { enabled: false, streaming: false, sttProvider: 'elevenlabs', ttsProvider: 'elevenlabs' };
    const cfg = JSON.parse(raw) as OdenehoVoiceConfig;
    return {
      enabled: cfg.enabled ?? false,
      streaming: cfg.streaming ?? false,
      sttProvider: cfg.sttProvider || 'elevenlabs',
      ttsProvider: cfg.ttsProvider || 'elevenlabs',
      elevenApiKey: cfg.elevenApiKey,
      agentId: cfg.agentId,
    };
  } catch {
    return { enabled: false, streaming: false, sttProvider: 'elevenlabs', ttsProvider: 'elevenlabs' };
  }
};

export const setOdenehoVoiceConfig = (config: Partial<OdenehoVoiceConfig>) => {
  const current = getOdenehoVoiceConfig();
  const next = { ...current, ...config } as OdenehoVoiceConfig;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('odenehoVoiceConfigUpdated', { detail: next }));
  return next;
};
