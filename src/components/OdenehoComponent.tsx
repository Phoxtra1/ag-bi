import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Mic, MicOff } from 'lucide-react';
import { getResolvedOdenehoSettings } from '@/lib/odenehoSettings';
import { useConversation } from '@11labs/react';
import { getOdenehoVoiceConfig } from '@/lib/odenehoVoiceConfig';
import { toast } from 'sonner';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const OdenehoComponent = () => {
  const initialSettings = getResolvedOdenehoSettings();

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: initialSettings.greeting, sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>(initialSettings.quickActions);
  const [typingAnimationEnabled, setTypingAnimationEnabled] = useState<boolean>(
    initialSettings.typingAnimation
  );

  // Voice state
  const [voiceConfig, setVoiceConfig] = useState(getOdenehoVoiceConfig());
  const [isRecording, setIsRecording] = useState(false);
  const conversation = useConversation({
    onConnect: () => console.log('Odeneho Voice: connected'),
    onDisconnect: () => setIsRecording(false),
    onError: (err) => {
      console.error('Odeneho Voice error:', err);
      toast.error('Voice error', { description: String(err?.message || err) });
    },
  });

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);

    window.addEventListener('openChatbot', handleOpenChatbot);

    const handleSettingsUpdated = () => {
      const next = getResolvedOdenehoSettings();
      setMessages((prev) => {
        if (prev.length > 0 && prev[0].sender === 'bot') {
          const updated = [...prev];
          updated[0] = { ...updated[0], text: next.greeting };
          return updated;
        }
        return prev;
      });
      setQuickActions(next.quickActions);
      setTypingAnimationEnabled(next.typingAnimation);
      if (next.autoOpen) setIsOpen(true);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'odenehoSettings') {
        const next = getResolvedOdenehoSettings();
        setQuickActions(next.quickActions);
        setTypingAnimationEnabled(next.typingAnimation);
      }
    };

    window.addEventListener('odenehoSettingsUpdated', handleSettingsUpdated as EventListener);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('chatbaseConfigUpdated', () => {});
    window.addEventListener('odenehoVoiceConfigUpdated', () =>
      setVoiceConfig(getOdenehoVoiceConfig())
    );

    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
      window.removeEventListener('odenehoSettingsUpdated', handleSettingsUpdated as EventListener);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('chatbaseConfigUpdated', () => {});
      window.removeEventListener('odenehoVoiceConfigUpdated', () =>
        setVoiceConfig(getOdenehoVoiceConfig())
      );
    };
  }, []);

  const startVoiceMode = async () => {
    const cfg = voiceConfig;
    if (!cfg?.agentId || !cfg?.elevenApiKey) {
      toast.error('Voice not configured', {
        description: 'Add ElevenLabs API Key and Agent ID in System Settings → Odeneho Chat Bot.',
      });
      return; // ✅ no redirect
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const resp = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${cfg.agentId}`,
        { headers: { 'xi-api-key': cfg.elevenApiKey } }
      );
      if (!resp.ok) throw new Error(`Signed URL failed: ${resp.status}`);
      const data = await resp.json();
      await conversation.startSession({ signedUrl: data.signed_url });
      setIsRecording(true);
    } catch (e: any) {
      console.error('Failed to start voice:', e);
      toast.error('Unable to start recording', {
        description: e?.message || 'Check mic permissions and config.',
      });
    }
  };

  const stopVoiceMode = async () => {
    try {
      if (conversation.status === 'connected') {
        await conversation.endSession();
      }
    } finally {
      setIsRecording(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) return stopVoiceMode();
    return startVoiceMode();
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg: Message = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);
    try {
      // placeholder for AI response
      const botResponse = `Echo: ${userMsg.text}`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponse, sender: 'bot' },
      ]);
    } catch (err) {
      console.error('Bot reply failed:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg animate-pulse hover:animate-none transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <img
            src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png"
            alt="Odeneho AI"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-800">Odeneho AI</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-gray-400 text-xs">Odeneho is typing...</div>}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center space-x-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full ${
                isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OdenehoComponent;
