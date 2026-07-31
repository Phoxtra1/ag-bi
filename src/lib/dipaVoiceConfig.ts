
export type DipaVoiceConfig = {
  enabled: boolean;
  streaming: boolean; // enable streaming mode
  sttProvider: 'elevenlabs';
  ttsProvider: 'elevenlabs';
  elevenApiKey?: string; // XI_API_KEY (frontend storage for now)
  agentId?: string; // ElevenLabs Conversational AI agent id (public agent supported)
};

const KEY = 'dipaVoiceConfig';

export const getDipaVoiceConfig = (): DipaVoiceConfig => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { enabled: false, streaming: false, sttProvider: 'elevenlabs', ttsProvider: 'elevenlabs' };
    const cfg = JSON.parse(raw) as DipaVoiceConfig;
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

export const setDipaVoiceConfig = (config: Partial<DipaVoiceConfig>) => {
  const current = getDipaVoiceConfig();
  const next = { ...current, ...config } as DipaVoiceConfig;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('dipaVoiceConfigUpdated', { detail: next }));
  return next;
};
