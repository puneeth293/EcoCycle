import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, PageRoute } from '../types';
import Markdown from 'react-markdown';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Upload,
  Truck,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const AIAssistantWidget: React.FC = () => {
  const { currentPage, navigate, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'widget-welcome',
      role: 'assistant',
      content: `👋 **Hi ${user?.name ? user.name.split(' ')[0] : 'there'}!** I'm **EcoBot**.\n\nNeed quick help with **waste segregation**, **electricity bill points redemption**, or **pollution reporting**? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '⚡ Pay Electricity Bill', actionType: 'navigate', target: 'electricity-bill' },
        { label: '📸 Upload Waste Photo', actionType: 'navigate', target: 'upload-waste' }
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If user is already on the dedicated ai-bot page, hide floating widget to avoid redundancy
  if (currentPage === 'ai-bot') {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          userContext: {
            currentPage,
            userName: user?.name || 'User',
            ecoPoints: user?.ecoPoints || 0
          }
        })
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm here to help! Could you rephrase that?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Widget chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `I'm currently running in light mode. You can check which bin an item belongs to, or jump directly to pay your electricity bill with points discount!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '⚡ Pay Electricity Bill', actionType: 'navigate', target: 'electricity-bill' },
          { label: '📸 Upload Waste Photo', actionType: 'navigate', target: 'upload-waste' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: 'navigate' | 'query'; target: string }) => {
    if (action.actionType === 'navigate') {
      navigate(action.target as PageRoute);
      setIsOpen(false);
    } else {
      handleSend(action.target);
    }
  };

  const handleOpenFullPage = () => {
    setIsOpen(false);
    navigate('ai-bot');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      
      {/* Floating Toggle Button with Unique Geometric Faceted Eco-Orb Shape */}
      {!isOpen && (
        <div className="relative flex items-center gap-3">
          
          {/* Subtle Floating Prompt Tooltip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-emerald-950/95 text-white text-[11px] font-bold border border-emerald-500/40 shadow-xl backdrop-blur-md animate-bounce pointer-events-none">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Ask EcoBot AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
            aria-label="Open AI Assistant"
            id="ai-bot-floating-launcher"
          >
            {/* Outer Rotating Glowing Aura */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-[28px] opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500 animate-pulse"></div>

            {/* Custom Unique Faceted Hexagonal-Crystal Capsule */}
            <div className="relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border-2 border-emerald-400/90 shadow-2xl rounded-2xl sm:rounded-3xl hover:border-emerald-300 transition-all overflow-hidden">
              
              {/* Internal Holographic Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>

              {/* Bot Icon with Animated Radar Beacon */}
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-green-300 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-slate-950"></span>
                </span>
              </div>

              {/* Unique Text & Faceted Badge */}
              <div className="flex flex-col text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-300 group-hover:text-white transition-colors">
                    EcoBot
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-400 text-slate-950 shadow-xs">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-emerald-200/80 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Assistance
                </span>
              </div>

            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] max-h-[85vh] bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-tight text-white">EcoBot Assistant</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-bold">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80">Online & Ready to Help</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenFullPage}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-lg transition-colors"
                title="Expand to Full Page"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-lg transition-colors"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-white/15 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleSend('Which bin do plastic containers go in?')}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white shrink-0 font-bold transition-colors"
            >
              🗑️ Bin Colors
            </button>
            <button
              onClick={() => handleSend('How do I discount my electricity bill with points?')}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white shrink-0 font-bold transition-colors"
            >
              ⚡ Electricity Bills
            </button>
            <button
              onClick={() => handleSend('How do I report smoke or water pollution?')}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white shrink-0 font-bold transition-colors"
            >
              📸 Upload Waste
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs scrollbar-thin">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                  <div
                    className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs shadow-xs ${
                      isBot
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                        : 'bg-emerald-600 text-white font-bold'
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : (user?.name?.charAt(0).toUpperCase() || 'U')}
                  </div>

                  <div className={`max-w-[85%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isBot
                          ? 'bg-slate-100 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-emerald-100'
                          : 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      }`}
                    >
                      {isBot ? (
                        <div className="markdown-body prose dark:prose-invert prose-emerald max-w-none text-xs space-y-1.5">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {/* Suggested Actions */}
                    {isBot && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/90 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-emerald-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-slate-100 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 rounded-2xl p-2.5 text-[11px] font-semibold text-slate-600 dark:text-emerald-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-2.5 bg-slate-50 dark:bg-emerald-900/90 border-t border-slate-200 dark:border-emerald-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask EcoBot anything..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-400/60 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 shadow-inner"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-emerald-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
