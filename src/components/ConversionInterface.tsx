import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import ExamplesPanel from './ExamplesPanel';
import { processConversion, processReverseConversion } from '../services/conversionService';
import { ChevronDown, ChevronUp, Clipboard, Zap, ArrowLeftRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ConversionHistory from './ConversionHistory';
import OptimizationPanel from './OptimizationPanel';
import { HistoryItem } from '../types';

const ConversionInterface: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [sqlInput, setSqlInput] = useState('');
  const [postgresOutput, setPostgresOutput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isExamplesPanelOpen, setIsExamplesPanelOpen] = useState(false);
  const [conversionHistory, setConversionHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isPostgresToSqlServer, setIsPostgresToSqlServer] = useState(false);
  
  const handleConvert = async () => {
    if (!sqlInput.trim()) return;
    
    setIsConverting(true);
    try {
      const result = isPostgresToSqlServer 
        ? await processReverseConversion(sqlInput)
        : await processConversion(sqlInput);
      
      setPostgresOutput(result);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        sqlServer: isPostgresToSqlServer ? result : sqlInput,
        postgres: isPostgresToSqlServer ? sqlInput : result,
        timestamp: new Date(),
        conversionDirection: isPostgresToSqlServer ? 'postgres-to-sqlserver' : 'sqlserver-to-postgres'
      };
      
      setConversionHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Conversion error:', error);
      setPostgresOutput('Error converting SQL. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(postgresOutput);
  };
  
  const loadFromHistory = (item: HistoryItem) => {
    setSqlInput(item.sqlServer);
    setPostgresOutput(item.postgres);
  };
  
  const toggleExamplesPanel = () => {
    setIsExamplesPanelOpen(prev => !prev);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        {/* Conversion Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left panel - Input */}
            <div className="flex-1">
              <div className="mb-2 flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {isPostgresToSqlServer ? 'PostgreSQL Function' : 'SQL Server Stored Procedure'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPostgresToSqlServer(prev => !prev)}
                    className={`flex items-center text-sm px-3 py-1 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <ArrowLeftRight className="mr-1 h-4 w-4" />
                    {isPostgresToSqlServer ? 'PostgreSQL → SQL Server' : 'SQL Server → PostgreSQL'}
                  </button>
                  <button
                    onClick={toggleExamplesPanel}
                    className={`flex items-center text-sm px-3 py-1 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Examples {isExamplesPanelOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {isExamplesPanelOpen && (
                <ExamplesPanel 
                  onSelectExample={(example) => setSqlInput(example)} 
                  conversionMode={isPostgresToSqlServer ? 'postgres-to-sqlserver' : 'sqlserver-to-postgres'}
                />
              )}
              
              <CodeEditor
                value={sqlInput}
                onChange={setSqlInput}
                language="sql"
                placeholder={isPostgresToSqlServer 
                  ? "Paste your PostgreSQL function here..." 
                  : "Paste your SQL Server stored procedure here..."}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Right panel - Output */}
            <div className="flex-1">
              <h2 className={`mb-2 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {isPostgresToSqlServer ? 'SQL Server Stored Procedure' : 'PostgreSQL Function'}
              </h2>
              <CodeEditor
                value={postgresOutput}
                onChange={setPostgresOutput}
                language="sql"
                placeholder={isPostgresToSqlServer 
                  ? "Converted SQL Server stored procedure will appear here..." 
                  : "Converted PostgreSQL function will appear here..."}
                isDarkMode={isDarkMode}
                isReadOnly={true}
              />
              {postgresOutput && (
                <button 
                  onClick={handleCopyOutput}
                  className={`mt-2 flex items-center gap-1 px-3 py-1 rounded text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Clipboard className="h-4 w-4" /> Copy to Clipboard
                </button>
              )}
            </div>
          </div>
          
          {/* Convert button */}
          <div className="flex justify-center">
            <button
              onClick={handleConvert}
              disabled={isConverting || !sqlInput.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105
                ${isConverting ? 'opacity-70 cursor-not-allowed' : ''}
                ${isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <Zap className="h-5 w-5" />
              {isConverting ? 'Converting...' : isPostgresToSqlServer ? 'Convert to SQL Server' : 'Convert to PostgreSQL'}
            </button>
          </div>
        </div>

        {/* Optimization Panel */}
        <div className="border-t pt-8">
          <OptimizationPanel />
        </div>
        
        {/* Conversion history */}
        {conversionHistory.length > 0 && (
          <div className="mt-8">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowHistory(prev => !prev)}
            >
              <h3 className="text-lg font-semibold">Conversion History</h3>
              {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {showHistory && (
              <ConversionHistory 
                history={conversionHistory} 
                onSelectItem={loadFromHistory}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionInterface;