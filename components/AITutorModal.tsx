import React, { useState } from 'react';
import { X, Sparkles, Loader2, Send } from 'lucide-react';
import { askAITutor } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export const AITutorModal: React.FC<Props> = ({ isOpen, onClose, topic }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const answer = await askAITutor(topic, query);
    setResponse(answer);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles size={20} />
            <h3 className="font-bold text-lg">AI Tutor</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {!response && !isLoading && (
            <div className="text-center text-slate-400 mt-4">
              <p className="mb-2">Tenho dúvidas sobre <strong>{topic}</strong>.</p>
              <p className="text-sm">Pergunte qualquer coisa! Ex: "Me dê mais exemplos disso" ou "Como uso isso no passado?"</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-400 animate-pulse">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>Thinking...</p>
            </div>
          )}

          {response && (
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={isLoading || !query.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};