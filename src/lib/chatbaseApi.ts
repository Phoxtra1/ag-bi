
export interface ChatbaseConfig {
  apiKey: string;
  chatbotId: string;
  enabled: boolean;
}

export const getChatbaseConfig = (): ChatbaseConfig => {
  try {
    const config = localStorage.getItem('chatbaseConfig');
    if (!config) return { apiKey: '', chatbotId: '', enabled: false };
    return JSON.parse(config) as ChatbaseConfig;
  } catch {
    return { apiKey: '', chatbotId: '', enabled: false };
  }
};

export const setChatbaseConfig = (config: ChatbaseConfig) => {
  localStorage.setItem('chatbaseConfig', JSON.stringify(config));
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('chatbaseConfigUpdated', { detail: config }));
};

export const sendMessageToChatbase = async (message: string): Promise<string> => {
  const config = getChatbaseConfig();
  
  if (!config.enabled || !config.apiKey || !config.chatbotId) {
    throw new Error('Chatbase not configured');
  }

  try {
    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbotId: config.chatbotId,
        message: message,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Chatbase API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('Chatbase API error:', error);
    throw error;
  }
};
