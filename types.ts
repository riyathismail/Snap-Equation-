export interface EquationResponse {
  latex: string;
  mathml: string;
  explanation: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

export interface HistoryItem extends EquationResponse {
  id: string;
  timestamp: number;
  imageUrl: string;
}
