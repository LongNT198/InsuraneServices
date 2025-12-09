import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Minimize2, User, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useAuth } from '../../../core/contexts/AuthContext';

export function ChatBubbleAdvanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: user 
          ? `Hi ${user.name || user.email}! How can we help you today?`
          : "Welcome! How can we assist you?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('policy') || lowerMessage.includes('insurance')) {
      return "I can help you with policy information. What specific policy would you like to know about? We offer Life, Health, Motor, and Home insurance.";
    } else if (lowerMessage.includes('claim')) {
      return "To file a claim, please visit our Claims page or I can guide you through the process. What type of claim would you like to file?";
    } else if (lowerMessage.includes('payment')) {
      return "For payment inquiries, you can check your payment history in your dashboard or make a new payment. Need help with a specific payment?";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
      return "You can reach our support team at:\n?? Phone: 1-800-INSURANCE\n?? Email: support@insurance.com\n?? Hours: Mon-Fri 9AM-6PM";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help. What can I assist you with today?";
    } else {
      return "Thank you for your message. Our support team will get back to you shortly. In the meantime, you can browse our Help Center or use the quick actions below.";
    }
  };

  const quickActions = [
    { icon: "??", text: "View Policies", action: () => setInputMessage("I want to view my policies") },
    { icon: "??", text: "File Claim", action: () => setInputMessage("How do I file a claim?") },
    { icon: "??", text: "Payment", action: () => setInputMessage("Help with payment") },
    { icon: "??", text: "Contact Us", action: () => setInputMessage("How can I contact support?") },
  ];

  // Inline styles for ABSOLUTE positioning control
  const buttonStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 99999,
    top: 'auto',
    left: 'auto',
  };

  const windowStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 99999,
    top: 'auto',
    left: 'auto',
    width: '400px',
    maxWidth: 'calc(100vw - 4rem)',
    height: '600px',
    maxHeight: 'calc(100vh - 8rem)',
  };

  return (
    <>
      {/* Floating Chat Button - FORCED BOTTOM-RIGHT */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={buttonStyle}
          className="group"
          aria-label="Open chat"
        >
          <div className="relative">
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-pulse"></span>
            
            {/* Main button with gradient */}
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer">
              <MessageCircle className="w-8 h-8 text-white animate-bounce" />
            </div>
            
            {/* Unread badge */}
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
              1
            </span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl">
            Need help? Chat with us!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Chat Window - FORCED BOTTOM-RIGHT */}
      {isOpen && (
        <div 
          style={windowStyle}
          className="shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 border-2 border-blue-100 rounded-lg bg-white"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Support Chat</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Replies instantly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Minimize"
                title="Minimize"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white scrollbar-chat">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-2 text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 px-3 py-2 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow"
                  title={action.text}
                >
                  <span className="text-base">{action.icon}</span>
                  <span className="font-medium text-gray-700 truncate">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t-2 border-gray-200 flex-shrink-0"
          >
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl h-10 w-10 flex-shrink-0"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              ?? Secure & Encrypted • Powered by AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}


