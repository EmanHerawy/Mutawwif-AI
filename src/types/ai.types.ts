export type MessageRole = 'user' | 'assistant' | 'system';

export type AnswerSource = 'verified_local' | 'partial_local' | 'claude_api' | 'offline_fallback' | 'damm_lockout';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  source: AnswerSource;
  isStreaming?: boolean;
}

export interface FiqhBridgeResult {
  answer: string;
  source: AnswerSource;
  confidence: number;
  showAskAiChip: boolean; // true when confidence 0.6–0.79
}

export interface QuickAction {
  id: string;
  labelAr: string;
  labelEn: string;
  query: string;
}
