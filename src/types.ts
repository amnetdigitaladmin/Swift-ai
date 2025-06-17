export interface HistoryItem {
  id: string;
  sqlServer: string;
  postgres: string;
  timestamp: Date;
  isOptimized?: boolean;
  conversionDirection: string;
}

export interface Example {
  title: string;
  snippet: string;
  full: string;
}
