import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Mic, MicOff } from 'lucide-react';
import { getResolvedOdenehoSettings } from '@/lib/odenehoSettings';
import { useConversation } from '@11labs/react';
import { getOdenehoVoiceConfig } from '@/lib/odenehoVoiceConfig';
import { toast } from 'sonner';

// Types
type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

// 🔹 Static Knowledge Base (keys are lowercase for reliable matching)
const staticAnswers: Record<string, string> = {
  'create amniva account':
    'To create an Amniva account, sign up on our portal with your email and password. Once verified, you’ll gain access to Prediction, Verify, Report, and Trending.',
  'amniva api':
    'The Amniva API lets developers integrate Prediction, Verification, and Reporting into apps and platforms. It provides real-time access to media intelligence tools.',
  'prediction':
    'Amniva Prediction uses AI to forecast media trends, audience behavior, and viral potential. Perfect for journalists, brands, and agencies.',
  'verify':
    'Amniva Verify authenticates content and provides insights to combat misinformation and ensure trust across digital platforms.',
  'report':
    'Amniva Report delivers analytics on sources and insight reports, reach, and engagement to measure impact.',
  'trending':
    'Amniva Trending shows the most viral and relevant stories in real time, helping you follow what matters now.',
  'pricing':
    'Amniva offers flexible plans: entry-level free trial for individuals and tiered plans for businesses and enterprises. Visit amniva.io/pricing for full details.',
  'what is amniva':
    'Amniva is a media intelligence platform combining AI-powered insights with real-time monitoring. It helps you track, verify, predict, and report media content effectively.',
  'who do we serve':
    'Amniva serves individuals, media organizations, businesses, civil society organizations, and research institutions that need reliable media intelligence for informed decision-making.'
};

// find best static answer by searching normalized keys
const findStaticAnswer = (input: string) => {
  if (!input) return null;
  const normalized = input.toLowerCase();
  const key = Object.keys(staticAnswers).find((k) => normalized.includes(k));
  return key ? staticAnswers[key] : null;
};

const OdenehoComponent = () => {
  const initialSettings = getResolvedOdenehoSettings();

  const defaultGreeting =
    initialSettings?.greeting ||
    "👋 Hello there! I'm Odeneho, your AI assistant at Amniva. How can I help you today?";

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: defaultGreeting, sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // three clickable preemptive questions
  const quickActions: string[] = [
    'How do I create an Amniva account?',
    'Tell me about Amniva API',
    'What is Amniva Prediction?'
  ];

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

  // stable handler for voice config updates so cleanup works
  useEffect(() => {
    const onVoiceConfigUpdated = () => setVoiceConfig(getOdenehoVoiceConfig());
    window.addEventListener('odenehoVoiceConfigUpdated', onVoiceConfigUpdated);
    return () => window.removeEventListener('odenehoVoiceConfigUpdated', onVoiceConfigUpdated);
  }, []);

  const startVoiceMode = async () => {
    const cfg = voiceConfig;
    if (!cfg?.agentId || !cfg?.elevenApiKey) {
      toast.error('Voice not configured', {
        description: 'Add ElevenLabs API Key and Agent ID in System Settings → Odeneho Chat Bot.',
      });
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

  const handleSendMessage = async (text?: string) => {
    const content = (text || inputMessage || '').trim();
    if (!content) return;

    const userMsg: Message = { id: Date.now(), text: content, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Try static knowledge base first
      const staticResponse = findStaticAnswer(content);
      let botResponse: string;
      if (staticResponse) {
        botResponse = staticResponse;
      } else {
        // Polished neutral fallback for visitors (no "I'm learning" leak)
        botResponse =
          'To create an Amniva account, register from the platform with your email and password, and then signin to access our components';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponse, sender: 'bot' },
      ]);
    } catch (err) {
      console.error('Bot reply failed:', err);
      // graceful fallback
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Sorry — something went wrong. Please try again.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
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
        <div className="bg-white rounded-lg shadow-2xl w-[420px] h-[600px] flex flex-col border border-gray-200">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick actions (3 preemptive clickable questions) */}
          <div className="p-3 flex flex-wrap gap-2 border-t bg-gray-50">
            {quickActions.map((qa, idx) => (
              <Button key={idx} size="sm" variant="outline" onClick={() => handleSendMessage(qa)}>
                {qa}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OdenehoComponent;
