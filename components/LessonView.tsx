import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { Play, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { AITutorModal } from './AITutorModal';

interface Props {
  lesson: Lesson;
  onComplete: (id: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export const LessonView: React.FC<Props> = ({ lesson, onComplete, onNext, isLast }) => {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
    setAnswer('');
    setStatus('idle');
  }, [lesson.id]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(lesson.content.en);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const checkAnswer = () => {
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!]/g, '');
    const isCorrect = normalize(answer) === normalize(lesson.quiz.answer);
    
    if (isCorrect) {
      setStatus('correct');
      onComplete(lesson.id);
      // Optional: Play success sound
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2
            ${lesson.level === 'Basic' ? 'bg-green-900/50 text-green-400' : 
              lesson.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
              lesson.level === 'Advanced' ? 'bg-orange-900/50 text-orange-400' :
              'bg-red-900/50 text-red-400'}`}>
            {lesson.level}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{lesson.title}</h1>
        </div>
        <button 
          onClick={() => setIsAiOpen(true)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
        >
          <Sparkles size={16} /> Explain with AI
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700 mb-8">
        <div className="mb-6 space-y-4">
          <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-indigo-500 pl-4">
            {lesson.content.pt}
          </p>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-start gap-4">
            <button 
              onClick={playAudio}
              className="mt-1 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-all shadow-lg hover:scale-105 flex-shrink-0"
              aria-label="Play Audio"
            >
              <Play size={20} fill="currentColor" />
            </button>
            <div>
              <p className="text-xl md:text-2xl font-medium text-white italic font-serif">
                "{lesson.content.en}"
              </p>
              {lesson.content.grammarNote && (
                <p className="text-slate-400 text-sm mt-2">💡 Note: {lesson.content.grammarNote}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Challenge</h3>
        <p className="text-slate-300 mb-4">{lesson.quiz.question}</p>
        
        {lesson.quiz.options ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {lesson.quiz.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  answer === opt 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input 
            type="text" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer in English..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
          />
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
           <button 
            onClick={checkAnswer}
            disabled={!answer || status === 'correct'}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-bold transition-all ${
              status === 'correct' 
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-white text-slate-900 hover:bg-slate-200'
            }`}
          >
            {status === 'correct' ? 'Completed!' : 'Check Answer'}
          </button>

          {status === 'correct' && !isLast && (
            <button 
              onClick={onNext}
              className="w-full md:w-auto flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold transition-all animate-bounce"
            >
              Next Lesson <ArrowRight size={18} />
            </button>
          )}
        </div>

        {status === 'correct' && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded text-green-400 flex items-center gap-2">
            <CheckCircle size={18} /> Correct! Well done.
          </div>
        )}
        {status === 'incorrect' && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-400 flex items-center gap-2">
            <AlertCircle size={18} /> Incorrect. Try again.
          </div>
        )}
      </div>

      <AITutorModal 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        topic={lesson.topic} 
      />
    </div>
  );
};