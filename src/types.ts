export interface HistoryItem {
  id: string;
  sqlServer: string;
  postgres: string;
  timestamp: Date;
  isOptimized?: boolean;
  conversionDirection?: 'sqlserver-to-postgres' | 'postgres-to-sqlserver';
}

export interface Example {
  title: string;
  snippet: string;
  full: string;
}