
import React from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (val: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

  return (
    <div className="relative w-full h-full bg-[#0d1117] font-mono text-sm overflow-hidden flex rounded-b-xl">
      {/* Line Numbers */}
      <div className="w-12 bg-[#0d1117] text-gray-600 text-right pr-3 pt-4 select-none border-r border-white/5 leading-6">
         <pre>{lineNumbers}</pre>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
         <textarea
           value={code}
           onChange={(e) => onChange(e.target.value)}
           className="absolute inset-0 w-full h-full bg-transparent text-gray-300 p-4 leading-6 resize-none outline-none z-10 font-mono"
           spellCheck={false}
           autoCapitalize="off"
         />
         {/* Decoration / Guide lines (Optional visual flair) */}
         <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_1.5rem] mt-4"></div>
      </div>
    </div>
  );
};

export default CodeEditor;