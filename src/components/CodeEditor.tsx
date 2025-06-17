import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  isDarkMode: boolean;
  isReadOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder,
  isDarkMode,
  isReadOnly = false
}) => {
  return (
    <div 
      className={`relative border rounded-lg overflow-hidden border-gray-700 bg-custom-bg`}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={isReadOnly}
        className={`w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none bg-custom-bg text-gray-200 placeholder-gray-500
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-neutral-700
          [&::-webkit-scrollbar-thumb]:bg-neutral-500
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:rounded-full
        ${isReadOnly ? 'cursor-default' : ''}`}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;