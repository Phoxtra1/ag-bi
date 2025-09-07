import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, User, Mic, MicOff } from 'lucide-react';
import { getResolvedOdenehoSettings } from '@/lib/odenehoSettings';
import { getChatbaseConfig, sendMessageToChatbase } from '@/lib/chatbaseApi';
import { useConversation } from '@11labs/react';
import { getOdenehoVoiceConfig } from '@/lib/odenehoVoiceConfig';
import { toast } from 'sonner';

// ✅ FIX: Import the voice component
import OdenehoVoiceComponent from '@/components/OdenehoVoiceComponent';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const OdenehoComponent = () => {
  // Load settings at mount
  const initialSettings = getResolvedOdenehoSettings();

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: initialSettings.greeting, sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>(initialSettings.quickActions);
  const [typingAnimationEnabled, setTypingAnimationEnabled] = useState<boolean>(initialSettings.typingAnimation);

  // Voice session state (embedded mic)
  const [voiceConfig, setVoiceConfig] = useState(getOdenehoVoiceConfig());
  const [isRecording, setIsRecording] = useState(false);
  const conversation = useConversation({
    onConnect: () => {
      console.log('Odeneho Voice: connected');
    },
    onDisconnect: () => {
      setIsRecording(false);
    },
    onError: (err) => {
      console.error('Odeneho Voice error:', err);
      toast.error('Voice error', { description: String(err?.message || err) });
    },
  });

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);

    // React to settings changes across the app in real-time
    const handleSettingsUpdated = (e: Event) => {
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

  // --- keep all your getAIResponse logic as is ---

  const startVoiceMode = async () => {
    const cfg = voiceConfig;
    if (!cfg?.agentId || !cfg?.elevenApiKey) {
      toast.error('Voice not configured', {
        description: 'Add ElevenLabs API Key and Agent ID in System Settings → Odeneho Chat Bot.',
      });
      try {
        window.open('/admin#odeneho-ai', '_self');
      } catch {}
      return;
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
      const botResponse = await getAIResponse(userMsg.text);
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
    <>
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

        {/* Chat Window */}
        {isOpen && (
          <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
            {/* --- header, messages, quick actions, input etc. remain unchanged --- */}
          </div>
        )}
      </div>

      {/* ✅ Voice Component is now properly imported and rendered */}
      <OdenehoVoiceComponent />
    </>
  );
};

export default OdenehoComponent;
