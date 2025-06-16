import React from 'react';
import { Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface ConversionHistoryProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  isDarkMode: boolean;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({ 
  history, 
  onSelectItem,
  isDarkMode
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className={`mt-2 rounded-lg border ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {history.map((item) => (
          <li 
            key={item.id}
            className={`p-3 cursor-pointer transition-colors hover:bg-opacity-80 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectItem(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 truncate">
                <div className="font-medium">
                  {item.sqlServer.split('\n')[0].substring(0, 40)}
                  {item.sqlServer.split('\n')[0].length > 40 ? '...' : ''}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.postgres.split('\n')[0].substring(0, 40)}
                  {item.postgres.split('\n')[0].length > 40 ? '...' : ''}
                </div>
              </div>
              <div className={`flex items-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(item.timestamp)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversionHistory;