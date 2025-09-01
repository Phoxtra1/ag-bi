import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, User } from 'lucide-react';

const OdenehoComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Odeneho, your AI assistant at Amniva. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
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
      return "Great question! Amniva offers three flexible plans tailored to different needs: **Free Plan** (basic verification features), **Elite Plan** (advanced analytics and higher limits), and **Institutional Plan** (full API access with enterprise features). Each plan includes different levels of fact-checking, trending analysis, and API calls. Would you like detailed information about any specific plan or help choosing the right one for your needs?";
    }
    
    // Fact-checking and verification queries
    if (lowerMessage.includes('fact') || lowerMessage.includes('verify') || lowerMessage.includes('check') || lowerMessage.includes('verification')) {
      return "Absolutely! Amniva's AI-powered fact-checking is one of our core strengths. Our system analyzes content in real-time, cross-references multiple authoritative sources, and provides detailed credibility scores with supporting evidence. You can submit text, links, or documents for verification through our dashboard or API. The system identifies potential misinformation and provides transparency reports. Would you like me to show you how to submit content for verification or explain our credibility scoring system?";
    }
    
    // Support and help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact') || lowerMessage.includes('assistance')) {
      return "I'm here to provide comprehensive support! For immediate assistance, I can help you with account questions, API integration, feature explanations, or troubleshooting. For more complex technical issues or account management, you can also reach our human support team at support@amniva.com or call +233 200 348 349 (9AM-6PM GMT). What specific area would you like help with today?";
    }
    
    // Weather and forecasting queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('climate')) {
      return "Perfect! Amniva provides sophisticated weather intelligence and climate data analysis. Our weather API delivers accurate forecasting, real-time conditions, and climate trend analysis. This data can be integrated into your applications for location-based services, agricultural planning, or disaster preparedness. Are you interested in weather data for a specific region, our weather API endpoints, or climate trend analysis?";
    }
    
    // News and media intelligence queries
    if (lowerMessage.includes('news') || lowerMessage.includes('media') || lowerMessage.includes('intelligence') || lowerMessage.includes('trending')) {
      return "Excellent! Our media intelligence platform is incredibly powerful. It monitors thousands of global news sources and social media platforms in real-time, providing misinformation alerts, credibility scores, and trending topic analysis. You can configure custom news feeds, set up keyword alerts, and receive instant notifications about emerging stories or potential misinformation. Would you like me to explain how to set up your personalized news feeds or show you our trending analysis features?";
    }

    // Prediction and forecasting queries
    if (lowerMessage.includes('predict') || lowerMessage.includes('prediction') || lowerMessage.includes('forecast') || lowerMessage.includes('future')) {
      return "Great choice! Amniva's prediction engine uses advanced AI to analyze patterns in politics, economics, environmental data, crime statistics, and more. Our system provides probability scores, confidence intervals, and detailed forecasting reports. You can access predictions through our dashboard or API endpoints. Are you interested in predictions for a specific domain like politics, weather, economics, or would you like to know more about how our predictive modeling works?";
    }

    // Account and dashboard queries
    if (lowerMessage.includes('account') || lowerMessage.includes('dashboard') || lowerMessage.includes('login')) {
      return "I can definitely help with account and dashboard questions! Your Amniva dashboard provides access to all our intelligence tools including fact-checking, trending analysis, predictions, and custom feeds. You can manage your API keys, view usage statistics, and configure alerts from there. Are you having trouble accessing your account, need help navigating specific features, or would you like guidance on setting up your dashboard preferences?";
    }

    // Generic questions about Amniva
    if (lowerMessage.includes('amniva') || lowerMessage.includes('what do you do') || lowerMessage.includes('about')) {
      return "Amniva is a cutting-edge AI-powered intelligence platform specializing in real-time fact-checking, misinformation detection, media intelligence, and predictive analytics. We help individuals, organizations, and institutions verify information, track trends, make informed predictions, and combat misinformation. Our platform combines advanced AI with comprehensive data sources to provide reliable, transparent intelligence. What aspect of Amniva's capabilities interests you most?";
    }

    // Default contextual responses
    const contextualResponses = [
      "That's an interesting question! I'd be happy to help you find the right information about Amniva's services. Could you tell me more specifically what you're looking for? Are you interested in our fact-checking, API integration, pricing, or something else?",
      "I want to make sure I give you the most helpful answer. Could you provide a bit more detail about what you'd like to know? I can assist with verification services, trending analysis, predictions, API documentation, account support, or general platform guidance.",
      "Great question! To give you the most accurate and helpful response, could you clarify what specific aspect of Amniva you're interested in? I'm here to help with everything from technical integration to understanding our intelligence features.",
      "I'm here to help you get the most out of Amniva's platform! Whether you're curious about our AI-powered fact-checking, need API documentation, want pricing information, or have technical questions, I can guide you. What would you like to explore first?",
      "Thanks for reaching out! I'd love to provide you with detailed information. Are you looking for help with account setup, API integration, understanding our verification process, or something else? Just let me know how I can best assist you!"
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
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = {
          id: messages.length + 2,
          text: getAIResponse(inputMessage),
          sender: 'bot' as const
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Hello! How are you?",
    "How does fact-checking work?",
    "Tell me about API integration",
    "What are your pricing plans?",
    "I need help with my account"
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
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
            
            {isTyping && (
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
                      onClick={() => handleQuickAction(action)}
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
