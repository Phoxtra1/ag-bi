
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, User } from 'lucide-react';
import { getResolvedOdenehoSettings } from '@/lib/odenehoSettings';

const OdenehoComponent = () => {
  // Load settings at mount
  const initialSettings = getResolvedOdenehoSettings();

  const [isOpen, setIsOpen] = useState<boolean>(initialSettings.autoOpen || false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: initialSettings.greeting, 
      sender: 'bot' as const
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>(initialSettings.quickActions);
  const [typingAnimationEnabled, setTypingAnimationEnabled] = useState<boolean>(initialSettings.typingAnimation);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);

    // React to settings changes across the app in real-time
    const handleSettingsUpdated = (e: Event) => {
      const custom = e as CustomEvent;
      const next = getResolvedOdenehoSettings();
      // Update greeting only if the first message is still the default bot message
      setMessages(prev => {
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
        // Optional: do not force open here to avoid UX surprises
      }
    };

    window.addEventListener('odenehoSettingsUpdated', handleSettingsUpdated as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
      window.removeEventListener('odenehoSettingsUpdated', handleSettingsUpdated as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Enhanced AI responses with better greeting detection and contextual answers
  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
        lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || 
        lowerMessage.includes('good evening') || lowerMessage.includes('greetings')) {
      return "Hello there! Great to meet you! I'm Odeneho, your dedicated AI assistant for Amniva's intelligence platform. I'm here to help you with fact-checking, API integration, pricing information, technical support, and much more. What can I assist you with today?";
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm always happy to help. Is there anything else you'd like to know about Amniva's services or do you need assistance with something specific?";
    }

    // How are you responses
    if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
      return "I'm doing great, thank you for asking! I'm here and ready to help you navigate Amniva's powerful intelligence platform. Whether you need help with verification, trending analysis, predictions, or API integration, I'm at your service. What would you like to explore?";
    }

    // API and integration queries
    if (lowerMessage.includes('api') || lowerMessage.includes('integration')) {
      return "Excellent! I'd love to help you with Amniva's API integration. Our API provides real-time fact-checking, misinformation detection, trending analysis, and predictive intelligence. You can access endpoints for verification, reporting, predictions, and trending data. Would you like me to guide you through getting your API key, show you documentation, or help with specific integration questions?";
    }
    
    // Pricing and subscription queries
    if (lowerMessage.includes('pricing') || lowerMessage.includes('plan') || lowerMessage.includes('subscription') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "Great question! Amniva offers three flexible plans tailored to different needs: Free (basic verification features), Elite (advanced analytics and higher limits), and Institutional (full API access with enterprise features). Would you like detailed information about any specific plan or help choosing the right one for your needs?";
    }
    
    // Fact-checking and verification queries
    if (lowerMessage.includes('fact') || lowerMessage.includes('verify') || lowerMessage.includes('check') || lowerMessage.includes('verification')) {
      return "Absolutely! Amniva's AI-powered fact-checking analyzes content in real-time, cross-references multiple authoritative sources, and provides credibility scores with supporting evidence. Would you like me to show you how to submit content for verification or explain our credibility scoring system?";
    }
    
    // Support and help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact') || lowerMessage.includes('assistance')) {
      return "I'm here to help! For immediate assistance, I can guide you on account questions, API integration, feature explanations, or troubleshooting. What specific area would you like help with today?";
    }
    
    // Weather and forecasting queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('climate')) {
      return "Amniva provides weather intelligence and climate analysis. Our weather API delivers accurate forecasts and real-time conditions. Are you interested in data for a specific region, API endpoints, or climate trend analysis?";
    }
    
    // News and media intelligence queries
    if (lowerMessage.includes('news') || lowerMessage.includes('media') || lowerMessage.includes('intelligence') || lowerMessage.includes('trending')) {
      return "Our media intelligence platform monitors global news and social media in real-time, providing misinformation alerts, credibility scores, and trending topic analysis. Would you like to set up personalized news feeds or review our trending analysis features?";
    }

    // Prediction and forecasting queries
    if (lowerMessage.includes('predict') || lowerMessage.includes('prediction') || lowerMessage.includes('forecast') || lowerMessage.includes('future')) {
      return "Amniva's prediction engine analyzes patterns across domains to produce probability scores, confidence intervals, and forecasting reports. Are you looking for predictions in a specific domain like politics, weather, or economics?";
    }

    // Account and dashboard queries
    if (lowerMessage.includes('account') || lowerMessage.includes('dashboard') || lowerMessage.includes('login')) {
      return "Your Amniva dashboard provides access to verification, trending analysis, predictions, custom feeds, and API management. Are you having trouble accessing your account or need guidance on a specific feature?";
    }

    // Generic questions about Amniva
    if (lowerMessage.includes('amniva') || lowerMessage.includes('what do you do') || lowerMessage.includes('about')) {
      return "Amniva is an AI-powered intelligence platform specializing in real-time fact-checking, misinformation detection, media intelligence, and predictive analytics. What aspect of our capabilities interests you most?";
    }

    // Default contextual responses
    const contextualResponses = [
      "That's an interesting question! Could you tell me more specifically what you're looking for? I can help with fact-checking, API integration, pricing, or technical support.",
      "I want to make sure I give you the most helpful answer. Could you provide a bit more detail about what you'd like to know?",
      "Great question! To give you the most accurate response, could you clarify what specific aspect of Amniva you're interested in?",
      "I'm here to help you get the most out of Amniva's platform! What would you like to explore first?",
      "Thanks for reaching out! Are you looking for help with account setup, API integration, understanding our verification process, or something else?"
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user' as const
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);
      
      // Simulate processing delay for more realistic experience
      const delay = typingAnimationEnabled ? 1500 : 0;
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = {
          id: messages.length + 2,
          text: getAIResponse(inputMessage),
          sender: 'bot' as const
        };
        setMessages(prev => [...prev, botResponse]);
      }, delay);
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png" 
                  alt="Odeneho AI" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">Odeneho - AI Assistant</h4>
                <p className="text-sm text-blue-100">Usually replies instantly</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <img 
                      src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png" 
                      alt="Odeneho AI" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 border rounded-bl-sm'
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && typingAnimationEnabled && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <img 
                    src="/lovable-uploads/09200a87-69a1-40bc-ba24-967d1f42f0e7.png" 
                    alt="Odeneho AI" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="bg-gray-100 text-gray-900 border p-3 rounded-lg rounded-bl-sm text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick actions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start text-xs h-8"
                      onClick={() => {
                        setInputMessage(action);
                        setTimeout(() => {
                          // Same behavior as handleQuickAction but inline to avoid duplicating logic
                          if (action.trim()) {
                            const fakeEvent = { key: 'Enter', shiftKey: false } as unknown as React.KeyboardEvent;
                            handleSendMessage();
                          }
                        }, 100);
                      }}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm" 
                disabled={!inputMessage.trim() || isTyping}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OdenehoComponent;
