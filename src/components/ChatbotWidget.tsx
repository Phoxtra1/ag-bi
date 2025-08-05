
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, User } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi! I'm Odeneho, your AI assistant. How can I help you today?", 
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

  // Enhanced AI responses with Amniva context
  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('api') || lowerMessage.includes('integration')) {
      return "I can help you with Amniva's API integration! Our API provides real-time fact-checking, misinformation detection, and media intelligence. Would you like me to guide you through the API documentation or help you get started with your API key?";
    }
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('plan') || lowerMessage.includes('subscription')) {
      return "Amniva offers three plans: Free (basic verification), Elite (advanced features), and Institutional (full API access). Each plan is designed to meet different needs. Would you like detailed information about any specific plan?";
    }
    
    if (lowerMessage.includes('fact') || lowerMessage.includes('verify') || lowerMessage.includes('check')) {
      return "Amniva's AI-powered fact-checking system analyzes content in real-time, cross-references multiple sources, and provides credibility scores. You can submit content for verification through our dashboard or API. Want me to show you how?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return "I'm here to help! You can also reach our human support team via email at support@amniva.com or call +233 200 348 349 during business hours (9AM-6PM GMT). For immediate assistance, I can help you with most questions right now!";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast')) {
      return "Amniva provides real-time weather intelligence and climate data analysis. Our weather API can be integrated into your applications for accurate forecasting. Are you interested in weather data for a specific region or our weather intelligence API?";
    }
    
    if (lowerMessage.includes('news') || lowerMessage.includes('media') || lowerMessage.includes('intelligence')) {
      return "Our media intelligence platform monitors global news sources, social media, and provides real-time misinformation alerts. You can configure custom feeds and get instant credibility scores. Would you like me to explain how to set up your custom news feeds?";
    }

    // Default responses with context
    const responses = [
      "That's a great question! Let me help you find the right information about Amniva's services. Could you be more specific about what you're looking for?",
      "I understand you need assistance with Amniva. Our platform specializes in AI-powered fact-checking and media intelligence. What specific aspect would you like to explore?",
      "Thanks for reaching out! Amniva offers comprehensive misinformation detection and verification services. How can I help you get the most out of our platform?",
      "I'm here to help you navigate Amniva's features. Whether it's about our API, dashboard features, or verification services, I can guide you through it. What would you like to know?",
      "As your AI assistant, I can help with account questions, technical support, or general information about Amniva's intelligence platform. What's on your mind?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
    "How does fact-checking work?",
    "Tell me about API integration",
    "What are your pricing plans?",
    "Contact human support"
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
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/c6c3c868-18b1-4268-bb9d-d184e79e37fe.png" 
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
                      src="/lovable-uploads/c6c3c868-18b1-4268-bb9d-d184e79e37fe.png" 
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
                    src="/lovable-uploads/c6c3c868-18b1-4268-bb9d-d184e79e37fe.png" 
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

export default ChatbotWidget;
