
import React, { useState, useEffect } from 'react';
import { AppTab, Session } from './types';
import PracticeView from './components/PracticeView';
import HistoryView from './components/HistoryView';
import { LayoutGrid, History, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PRACTICE);
  const [history, setHistory] = useState<Session[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('fluentcheck_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('fluentcheck_history', JSON.stringify(history));
  }, [history]);

  const addSession = (session: Session) => {
    setHistory(prev => [session, ...prev]);
  };

  const deleteSession = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-zinc-800'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {activeTab === AppTab.PRACTICE ? (
          <PracticeView onSessionComplete={addSession} isDarkMode={isDarkMode} />
        ) : (
          <HistoryView history={history} onDelete={deleteSession} isDarkMode={isDarkMode} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-gray-200'} px-6 py-3 z-50`}>
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button 
            onClick={() => setActiveTab(AppTab.PRACTICE)}
            className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === AppTab.PRACTICE ? 'text-blue-500 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LayoutGrid size={24} />
            <span className="text-xs">Practice</span>
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.HISTORY)}
            className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === AppTab.HISTORY ? 'text-blue-500 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <History size={24} />
            <span className="text-xs">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
