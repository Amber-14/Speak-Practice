
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Calendar, Mic, Square, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { COMMON_TOPICS } from '../constants';
import { Session, AnalysisResult } from '../types';
import { analyzeAudio } from '../services/geminiService';
import AnalysisResultView from './AnalysisResultView';

interface PracticeViewProps {
  onSessionComplete: (session: Session) => void;
  isDarkMode: boolean;
}

const PracticeView: React.FC<PracticeViewProps> = ({ onSessionComplete, isDarkMode }) => {
  const [topic, setTopic] = useState(COMMON_TOPICS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAudioBase64, setCurrentAudioBase64] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // Fix: Use 'any' instead of 'NodeJS.Timeout' to avoid namespace errors in browser environment
  const timerRef = useRef<any>(null);

  const handleShuffle = () => {
    const randomTopic = COMMON_TOPICS[Math.floor(Math.random() * COMMON_TOPICS.length)];
    setTopic(randomTopic);
    resetAnalysis();
  };

  const handleMyDay = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setTopic(`Talk about your day today, ${today}. What went well?`);
    resetAnalysis();
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setCurrentAudioBase64(undefined);
    setError(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setCurrentAudioBase64(base64Audio);
          await processAnalysis(base64Audio);
        };
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setError(null);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone permissions.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAnalysis = async (base64Audio: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeAudio(base64Audio);
      setAnalysisResult(result);
      
      const session: Session = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        topic: topic,
        audioBase64: base64Audio,
        analysis: result
      };
      
      onSessionComplete(session);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <Loader2 size={80} className="text-blue-500 animate-spin" />
          <Sparkles size={32} className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Analyzing your fluency...</h2>
          <p className={isDarkMode ? 'text-zinc-400' : 'text-gray-500'}>Our AI is listening carefully to your pronunciation and grammar.</p>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="space-y-6">
        <button 
          onClick={resetAnalysis}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <span>← Back to Practice</span>
        </button>
        <AnalysisResultView 
          result={analysisResult} 
          topic={topic} 
          isDarkMode={isDarkMode} 
          audioBase64={currentAudioBase64}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Topic Selection Card */}
      <div className={`p-8 rounded-[2rem] transition-all ${isDarkMode ? 'bg-zinc-900 shadow-xl' : 'bg-white shadow-lg border border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Current Topic</span>
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleShuffle}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-400 transition-colors font-medium"
            >
              <RefreshCw size={18} />
              <span>Shuffle</span>
            </button>
            <button 
              onClick={handleMyDay}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-400 transition-colors font-medium"
            >
              <Calendar size={18} />
              <span>My Day</span>
            </button>
          </div>
        </div>
        
        <input 
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`w-full text-2xl md:text-3xl font-bold bg-transparent border-none focus:ring-0 outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          placeholder="Type your own topic here..."
        />
      </div>

      {/* Recording Area */}
      <div className="flex flex-col items-center space-y-8">
        <div className="relative group">
          {isRecording && (
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150 duration-1000"></div>
          )}
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-2xl relative z-10 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording ? <Square size={48} fill="white" /> : <Mic size={48} fill="white" />}
          </button>
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold mb-2">{isRecording ? formatTime(recordingTime) : 'Tap to Speak'}</p>
          <p className={isDarkMode ? 'text-zinc-500' : 'text-gray-400'}>
            {isRecording ? 'Listening...' : 'Share your thoughts on the topic above'}
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeView;
