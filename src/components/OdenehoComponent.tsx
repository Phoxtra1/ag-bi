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

// 🔹 Comprehensive Knowledge Base for Amniva Platform
const staticAnswers: Record<string, string> = {
  // Account & Access
  'create amniva account':
    'To create an Amniva account, click "Get Started" or "Sign Up" on our homepage. Enter your email and password, verify your email, and you\'ll have access to Prediction, Verify, Info, and Trending features.',
  'sign up': 'Visit amniva.io and click "Sign Up". Enter your email, create a password, and verify your account via the confirmation email.',
  'login': 'Go to amniva.io and click "Login". Enter your registered email and password. If you\'ve enabled social login, you can also use Google, Facebook, GitHub, or Microsoft.',
  'forgot password': 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link.',
  'delete account': 'To delete your account, go to Account Settings in your dashboard and select "Delete Account". This action is permanent.',
  
  // Core Features
  'amniva api':
    'The Amniva API provides programmatic access to our Prediction, Verification, and Info engines. Apply for API access from your dashboard under "API Access". We offer tiered plans for different usage levels.',
  'api access': 'Request API access from your dashboard\'s "API Access" tab. Choose your plan (Basic, Pro, or Enterprise), submit the request, and our team will review and approve it.',
  'api documentation': 'Once approved for API access, you\'ll receive documentation with endpoints, authentication methods, rate limits, and code examples in multiple languages.',
  
  // Prediction
  'prediction':
    'Amniva Prediction uses AI to analyze historical data, current trends, and patterns to forecast potential outcomes in politics, environment, business, and society. Submit your prediction requests from the Predictions tab.',
  'how prediction works': 'Submit a topic or question in the Predictions tab. Our AI engine analyzes relevant data sources and returns probability-based forecasts with confidence levels and key factors.',
  'prediction accuracy': 'Our prediction engine continuously learns and improves. We provide confidence scores with each prediction. Historical accuracy varies by topic category.',
  
  // Verify
  'verify':
    'Amniva Verify authenticates content, fact-checks claims, and provides credibility scores. Submit any content you want verified through the Verify tab on your dashboard.',
  'verification process': 'Submit content via the Verify tab. Our AI cross-references multiple sources, analyzes patterns, and returns an authenticity score with evidence and risk factors.',
  'fact check': 'Use our Verify feature to fact-check any claim. Submit the content and receive a detailed analysis with sources and credibility assessment.',
  
  // Info (Reports)
  'report':
    'Submit information through the Info tab to receive detailed insights and analysis. Our engine processes your submission and delivers results to your dashboard or email.',
  'info': 'The Info tab is where you submit information for analysis. You\'ll receive insights including AI summaries, key observations, and recommended actions.',
  'submit info': 'Go to the Info tab, fill out the submission form with your content, category, and context. Our engines will process it and deliver insights.',
  'insights': 'After submitting info, check your dashboard for insights. These include AI-generated summaries, key observations, and actionable recommendations.',
  
  // Trending
  'trending':
    'Amniva Trending shows real-time global trends across Business, Technology, Environment, Politics, and Science. View trending topics on your Overview dashboard.',
  'trending news': 'The Trending News section on your Overview page displays auto-rotating headlines from global sources, categorized by topic. It updates dynamically throughout the day.',
  
  // Pricing & Plans
  'pricing':
    'Amniva offers: Free Trial (limited features), Pro Plan (full AI analysis, priority processing), Elite Plan (expert review, dedicated support), and Institutional Plan (custom solutions). Visit amniva.io/pricing for details.',
  'free trial': 'Sign up for a free trial to explore Amniva\'s core features. No credit card required. Upgrade anytime for full access.',
  'pro plan': 'The Pro Plan includes full AI analysis, priority processing, API access, and detailed insights. Perfect for professionals and small teams.',
  'elite plan': 'Elite Plan adds human expert review, enhanced accuracy, dedicated support, and advanced analytics. Ideal for organizations requiring verified insights.',
  'subscription': 'Manage your subscription from Account Settings. You can upgrade, downgrade, or cancel anytime. Changes take effect at the next billing cycle.',
  
  // Platform Info
  'what is amniva':
    'Amniva is an AI-powered media intelligence platform that helps you predict trends, verify content, and gain insights. We combine advanced AI with real-time data to deliver actionable intelligence.',
  'who do we serve':
    'Amniva serves individuals, journalists, media organizations, businesses, researchers, and institutions who need reliable intelligence for informed decision-making.',
  'how amniva works': 'Submit requests through Prediction, Verify, or Info tabs. Our AI engines process your submission using internal models and external APIs, then deliver results to your dashboard.',
  
  // Support
  'help': 'Visit the Support tab in your dashboard for FAQs, documentation, and contact options. You can also reach us at support@amniva.io.',
  'contact support': 'For assistance, use the Support tab or email support@amniva.io. Pro and Elite members get priority response.',
  'community': 'Join Amniva Society from the Community tab to connect with other users, share insights, and participate in discussions.',
  
  // Odeneho
  'odeneho': 'I\'m Odeneho, your AI assistant for Amniva. I can explain features, guide you through processes, and answer questions about the platform. How can I help you today?',
  'who are you': 'I\'m Odeneho, Amniva\'s AI assistant. I\'m here to help you navigate the platform, explain features, and answer any questions about our services.',
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
    "👋 Hello there! I'm Odeneho, your AI assistant at Amniva. Ask me about our features, pricing, API access, or how to get started!";

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: defaultGreeting, sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Expanded quick actions covering key platform areas
  const quickActions: string[] = [
    'What is Amniva?',
    'How do I verify content?',
    'Tell me about pricing',
    'How does prediction work?'
  ];

  // Voice state
  const [voiceConfig, setVoiceConfig] = useState(getOdenehoVoiceConfig());
  const [isRecording, setIsRecording] = useState(false);
  const conversation = useConversation({
    onConnect: () => console.log('Odeneho Voice: connected'),
    onDisconnect: () => setIsRecording(false),
    onError: (err: any) => {
      console.error('Odeneho Voice error:', err);
      toast.error('Voice error', { description: err?.message || String(err) });
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
      toast.error('Voice not configured');
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
        // Helpful fallback guiding users to key features
        botResponse =
          "I'd be happy to help! You can ask me about: creating an account, our Prediction/Verify/Info features, pricing plans, API access, or how to get started. What would you like to know?";
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
        <div className="bg-white rounded-lg shadow-2xl w-[400px] h-[500px] flex flex-col border border-gray-200">
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

          {/* Quick actions (4 preemptive clickable questions) */}
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
