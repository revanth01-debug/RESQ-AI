import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  HelpCircle,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { soundManager } from '../utils/audio';

interface AIAssistantWidgetProps {
  language: LanguageCode;
  currentRole: UserRole;
  soundEnabled: boolean;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  language,
  currentRole,
  soundEnabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: `Hello! I am RESQ AI, your active tactical emergency copilot. Operating under role: ${currentRole.toUpperCase()}. Ask for situation summaries, disaster advice, first aid steps, or evacuation directives.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setInputText('');
    setChatLog((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    if (soundEnabled) soundManager.playBeep(780);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language,
          role: currentRole,
        }),
      });
      const data = await res.json();
      const aiReply =
        data.reply ||
        'Emergency response directive active. Ensure all personnel maintain UHF radio contact on channel 1.';
      setChatLog((prev) => [...prev, { role: 'ai', text: aiReply }]);

      if (soundEnabled) {
        soundManager.playBeep(880);
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Tactical guidance: Lowlands Sector 4 is under active mandatory evacuation. Report all distress beacons to command immediately.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInputText(q);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          id="ai-assistant-floating-toggle-btn"
          onClick={() => {
            if (soundEnabled) soundManager.playBeep(900);
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-cyan-500/40 border border-cyan-400/40 transition-transform transform hover:scale-105 active:scale-95 cursor-pointer group"
          title="Open AI Emergency Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline">AI Emergency Copilot</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">LIVE</span>
        </button>
      ) : (
        <div className="w-[90vw] sm:w-96 rounded-3xl bg-slate-950 border border-cyan-500/50 shadow-2xl shadow-cyan-950/80 flex flex-col justify-between overflow-hidden max-h-[550px] animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  RESQ AI Tactical Copilot
                  <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300">
                    GEMINI
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Role: {currentRole.toUpperCase()} • Lang: {language}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-3.5 space-y-3 overflow-y-auto max-h-72 custom-scrollbar flex-1 bg-slate-950/90 text-xs">
            {chatLog.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  item.role === 'user'
                    ? 'ml-auto bg-cyan-600 text-white rounded-br-none'
                    : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div>{item.text}</div>
                {item.role === 'ai' && (
                  <button
                    onClick={() => soundManager.speak(item.text, 'en-US')}
                    className="mt-1.5 text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak Audio</span>
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-mono flex items-center gap-2 mr-auto animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI analyzing incident telemetry...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[10px] text-slate-300">
            <button
              onClick={() => handleQuickQuestion('Summarize current critical risk zones')}
              className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 whitespace-nowrap"
            >
              Risk summary?
            </button>
            <button
              onClick={() => handleQuickQuestion('What is the safest evacuation route right now?')}
              className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 whitespace-nowrap"
            >
              Evac routes?
            </button>
            <button
              onClick={() => handleQuickQuestion('Give me step-by-step CPR instructions')}
              className="px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 whitespace-nowrap"
            >
              CPR steps?
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask safety queries or tactical orders..."
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
