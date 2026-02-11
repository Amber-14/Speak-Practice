
export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
}

export interface AnalysisResult {
  transcript: string;
  fluencyScore: number;
  vocabScore: number;
  grammarErrors: GrammarError[];
  generalSuggestions: string;
}

export interface Session {
  id: string;
  timestamp: number;
  topic: string;
  audioBase64?: string;
  analysis?: AnalysisResult;
}

export enum AppTab {
  PRACTICE = 'practice',
  HISTORY = 'history'
}
