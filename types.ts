
export type FeatureID = 'dashboard' | 'market' | 'aiScreener' | 'chartAnalysis' | 'earningsPrediction' | 'marketSignal' | 'advancedAnalysis' | 'chatbot' | 'secIntelligence' | 'warriorScanner';

export interface TimeSeriesDataPoint {
  date: string;
  close: number;
}

export interface StockQuote {
  symbol: string;
  name?: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
