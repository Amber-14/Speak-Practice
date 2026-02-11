
import React, { useState } from 'react';
import { Session } from '../types';
import { ChevronRight, Trash2, Calendar, FileText, BarChart3, History } from 'lucide-react';
import AnalysisResultView from './AnalysisResultView';

interface HistoryViewProps {
  history: Session[];
  onDelete: (id: string) => void;
  isDarkMode: boolean;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onDelete, isDarkMode }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  if (selectedSession) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedSession(null)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <span>← Back to History</span>
        </button>
        <AnalysisResultView 
          result={selectedSession.analysis!} 
          topic={selectedSession.topic} 
          isDarkMode={isDarkMode} 
          audioBase64={selectedSession.audioBase64}
        />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-200'}`}>
          <History size={48} className={isDarkMode ? 'text-zinc-600' : 'text-gray-400'} />
        </div>
        <h2 className="text-xl font-bold mb-2">No history yet</h2>
        <p className={isDarkMode ? 'text-zinc-500' : 'text-gray-500'}>Complete your first speaking practice to see your progress here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-2">Your Past Sessions</h2>
      <div className="grid gap-4">
        {history.map((session) => (
          <div 
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className={`group p-5 rounded-2xl transition-all cursor-pointer border ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' 
                : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2 text-xs font-medium text-blue-500 mb-2">
                  <Calendar size={14} />
                  <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-500 transition-colors">
                  {session.topic}
                </h3>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-1.5">
                    <BarChart3 size={14} className="text-zinc-500" />
                    <span className="text-sm font-medium">Fluency: {session.analysis?.fluencyScore}%</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <FileText size={14} className="text-zinc-500" />
                    <span className="text-sm font-medium">{session.analysis?.grammarErrors.length} Errors</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-500/20 text-zinc-600 hover:text-red-500' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={20} className={isDarkMode ? 'text-zinc-700' : 'text-gray-300'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
