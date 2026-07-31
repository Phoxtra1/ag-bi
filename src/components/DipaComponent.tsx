import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Mic, MicOff } from 'lucide-react';
import { getResolvedDipaSettings } from '@/lib/dipaSettings';
import { useConversation } from '@11labs/react';
import { getDipaVoiceConfig } from '@/lib/dipaVoiceConfig';
import { toast } from 'sonner';

// Types
type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

// 🔹 Comprehensive Knowledge Base for Amniva Business Intelligence Platform
const staticAnswers: Record<string, string> = {
  // Account & Access
  'create amniva account':
    'To create an Amniva account, click "Get Started" or "Sign Up" on our homepage. Enter your email and password, verify your email, and you\'ll have access to Verify, Info, Prediction, and Business Trends features.',
  'sign up': 'Visit amniva.io and click "Sign Up". Enter your email, create a password, and verify your account via the confirmation email.',
  'login': 'Go to amniva.io and click "Login". Enter your registered email and password. If you\'ve enabled social login, you can also use Google, Facebook, GitHub, or Microsoft.',
  'forgot password': 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link.',
  'delete account': 'To delete your account, go to Account Settings in your dashboard and select "Delete Account". This action is permanent.',
  
  // Core Features
  'amniva api':
    'The Amniva API provides programmatic access to our Verify, Info, Prediction, and Business Trends engines. Apply for API access from your dashboard under "API Access". We offer tiered plans for different usage levels.',
  'api access': 'Request API access from your dashboard\'s "API Access" tab. Choose your plan (Basic, Pro, or Enterprise), submit the request, and our team will review and approve it.',
  'api documentation': 'Once approved for API access, you\'ll receive documentation with endpoints, authentication methods, rate limits, and code examples in multiple languages.',
  
  // Verify
  'verify':
    'Amniva Verify provides credibility assessment and cross-checking of datasets, reports, and claims. Submit your data through the Verify tab and receive evidence summaries, confidence scores, and verification status.',
  'verification': 'Submit content via the Verify tab. Our AI cross-references multiple sources, analyzes patterns, and returns a verification status with evidence summary and confidence score.',
  'submit for verification': 'Go to the Verify tab in your dashboard and use the "Submit for Verification" form. Upload your data, provide context, and our engines will process it.',
  'verification status': 'Check your verification results in the Verify tab under "My Submissions". Status options include Pending Review, Verified, or Flagged.',
  
  // Info (Insights)
  'info':
    'The Info tab is where you upload data or research to receive structured insights. Our engine transforms your information into actionable summaries, key observations, and recommendations.',
  'generate insight': 'Submit your data through the Info tab. Our AI processes it and generates structured insights including summaries, key findings, and recommended actions.',
  'insights': 'After submitting info, check your dashboard for insights. These include AI-generated summaries, key observations, and actionable recommendations.',
  'upload data': 'Use the Info tab to upload documents, datasets, or research. Supported formats include PDF, CSV, JSON, and text files.',
  
  // Prediction
  'prediction':
    'Amniva Prediction provides business, market, economic, and risk forecasting based on verified data. Submit your prediction requests from the Prediction tab.',
  'run prediction': 'Go to the Prediction tab and click "Run Prediction". Enter your topic, provide relevant data, and our engines will generate a forecast with confidence levels.',
  'forecast': 'Our prediction engine models scenarios using verified inputs, historical patterns, and current market conditions. Results include probability assessments and key factors.',
  'prediction accuracy': 'We provide confidence scores with each prediction. Our models continuously learn and improve based on outcome tracking.',
  
  // Business Trends
  'trending':
    'Business Trends shows real-time market signals across Markets, Trade, Investment, and Risk categories. View trend signals on your Overview dashboard.',
  'business trends': 'The Business Trends section displays aggregated signals from market data, trade flows, investment patterns, and risk indicators. It updates dynamically throughout the day.',
  'view trends': 'Access Business Trends from your Overview tab. Categories include Markets, Trade, Investment, and Risk environments.',
  
  // Pricing & Plans
  'pricing':
    'Amniva offers: Free (basic features), Pro (full AI analysis, priority processing), Elite (AI + human expert review, dedicated support), and Institutional (custom solutions). Visit amniva.io/pricing for details.',
  'free trial': 'Sign up for our free tier to explore Amniva\'s core features. No credit card required. Upgrade anytime for full access.',
  'pro plan': 'The Pro Plan includes full AI analysis, priority processing, API access, and detailed insights. Perfect for professionals and small teams.',
  'elite plan': 'Elite Plan adds human expert review, enhanced accuracy, dedicated support, and advanced analytics. Ideal for organizations requiring verified insights.',
  'subscription': 'Manage your subscription from Account Settings. You can upgrade, downgrade, or cancel anytime. Changes take effect at the next billing cycle.',
  
  // Platform Info
  'what is amniva':
    'Amniva is a business intelligence platform under Amineva Global. We help organizations verify information, transform data into insights, and forecast market outcomes. Our core capabilities are Verify, Info, Prediction, and Business Trends.',
  'who do we serve':
    'Amniva serves analysts, researchers, businesses, investors, and institutions who need reliable intelligence for informed decision-making.',
  'how amniva works': 'Submit requests through Verify, Info, Prediction, or Business Trends tabs. Our AI engines process your submission using internal models and external APIs, then deliver results to your dashboard.',
  'amineva global': 'Amniva is a product of Amineva Global. Learn more at amineva.com.',
  
  // Support
  'help': 'Visit the Support tab in your dashboard for FAQs, documentation, and contact options. You can also reach us at support@amniva.io.',
  'contact support': 'For assistance, use the Support tab or email support@amniva.io. Pro and Elite members get priority response.',
  'support email': 'Email us at support@amniva.io for any assistance. We respond within 5 business days.',
  'community': 'Join Amniva Society from the Community tab to connect with other users, share insights, and participate in discussions.',
  
  // Dipa
  'dipa': 'I\'m Dipa, your AI assistant for Amniva. I can explain features, guide you through processes, and answer questions about the platform. How can I help you today?',
  'who are you': 'I\'m Dipa, Amniva\'s AI assistant. I\'m here to help you navigate the platform, explain features, and answer any questions about our business intelligence services.',
};

// find best static answer by searching normalized keys
const findStaticAnswer = (input: string) => {
  if (!input) return null;
  const normalized = input.toLowerCase();
  const key = Object.keys(staticAnswers).find((k) => normalized.includes(k));
  return key ? staticAnswers[key] : null;
};

const DipaComponent = () => {
  const initialSettings = getResolvedDipaSettings();

  const defaultGreeting =
    initialSettings?.greeting ||
    "Hello! I'm Dipa, your AI assistant at Amniva. Ask me about Verify, Info, Prediction, Business Trends, pricing, API access, or how to get started!";

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: defaultGreeting, sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Expanded quick actions covering key platform areas
  const quickActions: string[] = [
    'What is Amniva?',
    'How does Verify work?',
    'Tell me about pricing',
    'How do I run a prediction?'
  ];

  // Voice state
  const [voiceConfig, setVoiceConfig] = useState(getDipaVoiceConfig());
  const [isRecording, setIsRecording] = useState(false);
  const conversation = useConversation({
    onConnect: () => console.log('Dipa Voice: connected'),
    onDisconnect: () => setIsRecording(false),
    onError: (err: any) => {
      console.error('Dipa Voice error:', err);
      toast.error('Voice error', { description: err?.message || String(err) });
    },
  });

  // stable handler for voice config updates so cleanup works
  useEffect(() => {
    const onVoiceConfigUpdated = () => setVoiceConfig(getDipaVoiceConfig());
    window.addEventListener('dipaVoiceConfigUpdated', onVoiceConfigUpdated);
    return () => window.removeEventListener('dipaVoiceConfigUpdated', onVoiceConfigUpdated);
  }, []);

  // Listen for openChatbot event
  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
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
          "I'd be happy to help! You can ask me about: Verify (credibility assessment), Info (insight generation), Prediction (forecasting), Business Trends, pricing plans, API access, or how to get started. What would you like to know?";
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
          text: 'Sorry — something went wrong. Please try again or contact support@amniva.io.',
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
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg animate-pulse hover:animate-none transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <img
            src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png"
            alt="Dipa"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Button>
      )}

      {isOpen && (
        <div className="bg-card rounded-lg shadow-2xl w-[400px] h-[500px] flex flex-col border">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Dipa</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
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
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-muted-foreground text-xs">Dipa is typing...</div>}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center space-x-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full ${
                isRecording ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'
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
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick actions (4 preemptive clickable questions) */}
          <div className="p-3 flex flex-wrap gap-2 border-t bg-muted/50">
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

export default DipaComponent;
