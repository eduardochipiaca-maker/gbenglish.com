import React, { useState, useEffect } from 'react';
import { Lesson, UserProgress, LEVELS } from './types';
import { curriculum } from './services/curriculum';
import { LessonView } from './components/LessonView';
import { ProgressBar } from './components/ProgressBar';
import { BookOpen, Trophy, Menu, X, Star } from 'lucide-react';

const App: React.FC = () => {
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('efz_progress');
    if (saved) {
      const parsed: UserProgress = JSON.parse(saved);
      setCompletedLessons(parsed.completedLessons || []);
      // Optional: Restore last lesson, or stay at 1 if user wants to review
      if (parsed.currentLessonId) setCurrentLessonId(parsed.currentLessonId);
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    const progress: UserProgress = {
      currentLessonId,
      completedLessons
    };
    localStorage.setItem('efz_progress', JSON.stringify(progress));
  }, [currentLessonId, completedLessons]);

  const handleCompleteLesson = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonId < 100) {
      setCurrentLessonId(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const currentLesson = curriculum.find(l => l.id === currentLessonId) || curriculum[0];
  const progressPercentage = completedLessons.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <span className="text-2xl">🇬🇧</span> English<span className="text-blue-500">Zero</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="px-2">
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Progress</p>
             <ProgressBar completed={completedLessons.length} total={100} />
          </div>

          {LEVELS.map(level => {
            const levelLessons = curriculum.filter(l => l.level === level);
            const isLevelLocked = level !== 'Basic' && 
                                  !completedLessons.includes(levelLessons[0].id - 1) && 
                                  currentLessonId < levelLessons[0].id;

            return (
              <div key={level} className={isLevelLocked ? 'opacity-50 pointer-events-none' : ''}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                  {level} 
                  {isLevelLocked && <span className="text-[10px] bg-slate-800 px-1 rounded">LOCKED</span>}
                </h3>
                <div className="space-y-1">
                  {levelLessons.map(lesson => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isActive = lesson.id === currentLessonId;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLessonId(lesson.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors
                          ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 
                            isCompleted ? 'text-green-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                        `}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border flex-shrink-0
                          ${isCompleted ? 'bg-green-500/20 border-green-500' : 
                            isActive ? 'bg-white/20 border-white' : 'border-slate-600'}
                        `}>
                          {isCompleted ? '✓' : lesson.id}
                        </div>
                        <span className="truncate">{lesson.topic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between lg:hidden">
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg">Lesson {currentLessonId}</span>
           <div className="w-6" /> {/* Spacer for centering */}
        </header>

        <div className="pb-20">
          <LessonView 
            lesson={currentLesson} 
            onComplete={handleCompleteLesson} 
            onNext={handleNextLesson}
            isLast={currentLessonId === 100}
          />
        </div>
      </main>

    </div>
  );
};

export default App;