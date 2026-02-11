
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, MessageSquareQuote, Quote, Play, Pause, Volume2 } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  topic: string;
  isDarkMode: boolean;
  audioBase64?: string;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, topic, isDarkMode, audioBase64 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.ontimeupdate = () => setCurrentTime(audioRef.current?.currentTime || 0);
      audioRef.current.onloadedmetadata = () => setDuration(audioRef.current?.duration || 0);
    }
  }, [audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Audio Player */}
      {audioBase64 && (
        <div className={`p-6 rounded-3xl flex flex-col space-y-4 ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Volume2 size={20} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg">Your Recording</h3>
            </div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all text-white shrink-0 shadow-lg shadow-blue-500/20"
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
            </button>
            <input 
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <audio ref={audioRef} src={`data:audio/wav;base64,${audioBase64}`} className="hidden" />
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Fluency</p>
          <div className="flex items-end space-x-1">
            <span className={`text-4xl font-bold ${getScoreColor(result.fluencyScore)}`}>{result.fluencyScore}</span>
            <span className={isDarkMode ? 'text-zinc-600 mb-1' : 'text-gray-400 mb-1'}>%</span>
          </div>
          <div className={`h-1.5 w-full rounded-full mt-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${result.fluencyScore >= 80 ? 'bg-green-500' : result.fluencyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${result.fluencyScore}%` }}
            ></div>
          </div>
        </div>
        <div className={`p-6 rounded-3xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Vocabulary</p>
          <div className="flex items-end space-x-1">
            <span className={`text-4xl font-bold ${getScoreColor(result.vocabScore)}`}>{result.vocabScore}</span>
            <span className={isDarkMode ? 'text-zinc-600 mb-1' : 'text-gray-400 mb-1'}>%</span>
          </div>
          <div className={`h-1.5 w-full rounded-full mt-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${result.vocabScore >= 80 ? 'bg-green-500' : result.vocabScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${result.vocabScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquareQuote size={20} className="text-blue-500" />
          <h3 className="font-bold text-lg">Your Speaking Transcript</h3>
        </div>
        <div className="relative">
          <Quote size={40} className={`absolute -top-4 -left-4 opacity-10 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`} />
          <p className={`text-lg leading-relaxed italic ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
            "{result.transcript}"
          </p>
        </div>
      </div>

      {/* Grammar Corrections */}
      <div className="space-y-4">
        <h3 className="font-bold text-xl px-2">Grammar & Corrections</h3>
        {result.grammarErrors.length === 0 ? (
          <div className={`p-6 rounded-3xl flex items-center space-x-4 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <CheckCircle2 className="text-green-500" size={24} />
            <p className="text-green-500 font-medium">Perfect grammar! No mistakes detected.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {result.grammarErrors.map((error, idx) => (
              <div key={idx} className={`p-6 rounded-[1.5rem] border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="text-yellow-500 mt-1 shrink-0" size={18} />
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Original</p>
                    <p className="line-through text-red-500/80 decoration-red-500 decoration-2">{error.original}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-4">
                  <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={18} />
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Suggested</p>
                    <p className="text-green-500 font-bold">{error.correction}</p>
                  </div>
                </div>
                <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-50'}`}>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                    <span className="font-bold text-blue-500">Why? </span>
                    {error.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="text-blue-500" size={24} />
          <h3 className="font-bold text-xl text-blue-500">Expert Tips</h3>
        </div>
        <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
          {result.generalSuggestions}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResultView;
