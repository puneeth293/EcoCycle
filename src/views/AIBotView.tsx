import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, PageRoute } from '../types';
import Markdown from 'react-markdown';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `### 👋 Hello! I'm EcoBot, your AI Environmental Copilot.\n\nI'm powered by Gemini to help you make sustainable choices, segregate waste accurately, earn rewards, and reduce your carbon footprint.\n\nHere is how I can assist you right now:\n* 🗑️ **Waste Segregation**: Ask me which bin (Green, Blue, Yellow, Red, Black) any item belongs to.\n* ⚡ **Electricity Bills**: Learn how to redeem your **Eco Points (₹0.50/pt)** to discount your power bills (BESCOM, Tata Power, etc.).\n* 📸 **Upload Waste & Pollution**: Discover how to upload photos of waste or report local air/water/soil pollution for **+35 to +75 Eco Points**.\n* 🚚 **Doorstep Pickups**: Schedule free doorstep collection for bulk dry waste and e-waste.\n\nWhat would you like to explore today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: [
      { label: '⚡ How to pay electricity bill?', actionType: 'query', target: 'How do I redeem my Eco Points for electricity bill discounts?' },
      { label: '🗑️ Which bin for lithium batteries?', actionType: 'query', target: 'Which bin do old lithium batteries and smartphone chargers go in?' },
      { label: '📸 How to report air/water pollution?', actionType: 'query', target: 'How do I upload a photo to report pollution and get a CPCB grievance ticket?' }
    ],
    topic: 'general'
  }
];

const PRESET_TOPICS = [
  {
    id: 'segregation',
    title: 'Waste Segregation',
    icon: '🗑️',
    description: 'Bin colors, recyclability & disposal rules',
    queries: [
      'Which bin for pizza boxes with grease?',
      'How to dispose of broken fluorescent tubes?',
      'Can tetra paks and milk pouches be recycled?'
    ]
  },
  {
    id: 'electricity',
    title: 'Electricity & Rebates',
    icon: '⚡',
    description: 'Bill discounts, ₹0.50/point redemption',
    queries: [
      'How much discount do I get per Eco Point on electricity bills?',
      'Which electricity boards (BESCOM, Tata Power) are supported?',
      'Do I get bonus points for paying bills via EcoCycle?'
    ]
  },
  {
    id: 'pollution',
    title: 'Pollution Reporting',
    icon: '🏭',
    description: 'Air, water, soil photos & CPCB tickets',
    queries: [
      'How does the AI detect industrial smoke plumes?',
      'What points do I earn for reporting lake foam or sewage?',
      'What immediate safety steps should I take during high AQI smog?'
    ]
  },
  {
    id: 'composting',
    title: 'Composting & Habits',
    icon: '🌱',
    description: 'Home vermicompost & zero-waste hacks',
    queries: [
      'How to start home kitchen waste composting without odor?',
      'What items should NEVER go into a compost bin?',
      'Top 5 habits to cut household single-use plastic by 80%'
    ]
  }
];

export const AIBotView: React.FC = () => {
  const { navigate, user, showToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ecocycle_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ecocycle_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get bot reply');
      }

      const data = await response.json();

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm here to help with all environmental questions!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
        topic: data.topic || 'general',
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now, but here's quick guidance: 
- **Green Bin**: Wet & organic compostable kitchen scraps.
- **Blue Bin**: Clean & dry plastics, glass bottles, metal cans.
- **Red/Yellow Bin**: Sanitary, chemical & hazardous waste.
- **Electricity Subsidy**: Redeem points on the **Electricity Bill** tab for ₹0.50 OFF per point!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; target: string }) => {
    if (action.actionType === 'navigate') {
      navigate(action.target as PageRoute);
    } else if (action.actionType === 'query') {
      handleSendMessage(action.target);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('ecocycle_chat_history');
    showToast('Chat history cleared', 'info');
  };

  return (
    <div className="py-10 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Multimodal Environmental Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 font-sans tracking-tight drop-shadow-md">
              EcoBot AI Copilot
            </h1>
            <p className="text-sm font-semibold text-emerald-50/90 drop-shadow-xs">
              Powered by Gemini • Smart segregation, bill discounts, and pollution reporting guidance.
            </p>
          </div>

          <button
            onClick={handleClearChat}
            className="px-4 py-2 rounded-2xl bg-white/85 hover:bg-white text-[#063B32] border border-white/80 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 backdrop-blur-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Main Grid: Left Chat Area & Right Topic Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chat Column */}
          <div className="lg:col-span-8 flex flex-col h-[650px] glass-panel rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-sm shadow-xs ${
                        isBot
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-[#063B32] text-white font-bold'
                      }`}
                    >
                      {isBot ? <Bot className="w-5 h-5" /> : (user?.name?.charAt(0).toUpperCase() || 'U')}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                      <div
                        className={`rounded-2xl p-4 sm:p-5 text-sm shadow-xs leading-relaxed ${
                          isBot
                            ? 'glass-subcard border border-emerald-100 text-[#063B32]'
                            : 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-md'
                        }`}
                      >
                        {isBot ? (
                          <div className="markdown-body prose max-w-none text-sm space-y-2 text-[#063B32]">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>

                      {/* Bot Suggested Actions */}
                      {isBot && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-[#063B32] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3 h-3 text-emerald-600" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Footer Info / Copy */}
                      <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-[#365A52] font-semibold">
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="hover:text-[#063B32] flex items-center gap-1 transition-colors"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="glass-subcard border border-emerald-100 rounded-2xl p-4 text-xs font-bold text-[#063B32] flex items-center gap-2.5 shadow-xs">
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>EcoBot is analyzing with Gemini AI...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-emerald-100 bg-white/70 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask anything (e.g. 'Which bin for milk cartons?' or 'How to pay my BESCOM bill?')..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Sample Quick Queries */}
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <span className="text-[#365A52] font-black shrink-0">Try asking:</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Which bin do pizza boxes and greasy napkins go into?')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-[#063B32] shrink-0 font-bold transition-colors"
                >
                  🍕 Pizza boxes
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How do I redeem Eco Points to reduce my electricity bill?')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-[#063B32] shrink-0 font-bold transition-colors"
                >
                  ⚡ Power bill discount
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How to report air pollution or chimney smoke with photos?')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-[#063B32] shrink-0 font-bold transition-colors"
                >
                  🏭 Report chimney smoke
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Topics & Quick Portals */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Portals */}
            <div className="glass-panel rounded-3xl p-5 shadow-2xl">
              <h3 className="text-sm font-black text-[#063B32] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Quick Eco Services</span>
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => navigate('electricity-bill')}
                  className="w-full p-3 rounded-2xl glass-subcard border border-amber-200 hover:border-amber-400 text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#063B32] group-hover:text-amber-600 transition-colors">
                        Pay Electricity Bill
                      </h4>
                      <p className="text-[11px] text-[#365A52] font-semibold">Redeem points for ₹0.50/pt off</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('upload-waste')}
                  className="w-full p-3 rounded-2xl glass-subcard border border-emerald-100 hover:border-emerald-300 text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                      📸
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#063B32] group-hover:text-emerald-700 transition-colors">
                        Upload Waste Photo
                      </h4>
                      <p className="text-[11px] text-[#365A52] font-semibold">Earn +35 to +75 points</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('pickup')}
                  className="w-full p-3 rounded-2xl glass-subcard border border-teal-100 hover:border-teal-300 text-left flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                      🚚
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#063B32] group-hover:text-teal-700 transition-colors">
                        Doorstep Scrap Pickup
                      </h4>
                      <p className="text-[11px] text-[#365A52] font-semibold">Free home collection for scrap</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Popular Discussion Topics */}
            <div className="glass-panel rounded-3xl p-5 shadow-2xl">
              <h3 className="text-sm font-black text-[#063B32] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Popular Questions</span>
              </h3>
              <div className="space-y-4">
                {PRESET_TOPICS.map((topic) => (
                  <div key={topic.id} className="border-b border-emerald-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{topic.icon}</span>
                      <h4 className="text-xs font-black text-[#063B32]">{topic.title}</h4>
                    </div>
                    <div className="space-y-1 pl-6">
                      {topic.queries.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="block text-left text-[11px] text-[#365A52] hover:text-emerald-700 font-semibold hover:underline transition-all"
                        >
                          • {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EcoBot Knowledge Badge */}
            <div className="p-4 rounded-2xl glass-subcard border border-emerald-200 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#063B32]">CPCB & SWM 2016 Compliant</h4>
                  <p className="text-[11px] text-[#365A52] font-semibold mt-0.5">
                    Trained on Ministry of Environment, Forest and Climate Change (MoEFCC) guidelines.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
