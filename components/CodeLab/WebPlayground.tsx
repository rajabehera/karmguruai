
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Smartphone, Monitor, Tablet } from 'lucide-react';

const WebPlayground: React.FC = () => {
  const [html, setHtml] = useState('<h1>Hello KarmGuru</h1>\n<div class="card">\n  <p>Luxury UI Demo</p>\n</div>');
  const [css, setCss] = useState(`body { \n  background: #f9f8f6; \n  color: #2c3729; \n  display: flex; \n  justify-content: center; \n  align-items: center; \n  height: 100vh; \n  font-family: sans-serif;\n}\n.card {\n  background: white;\n  padding: 2rem;\n  border-radius: 1rem;\n  border: 1px solid #c3c9c0;\n  box-shadow: 0 10px 20px rgba(0,0,0,0.05);\n}`);
  const [js, setJs] = useState('console.log("Welcome to Nexus Code Lab");');
  const [srcDoc, setSrcDoc] = useState('');
  const [viewMode, setViewMode] = useState<'MOBILE' | 'TABLET' | 'DESKTOP'>('DESKTOP');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <style>${css}</style>
          <body>${html}</body>
          <script>${js}</script>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between px-4 py-2 glass-panel rounded-lg border border-karm-sage bg-white">
         <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-mono text-green-600">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 LIVE PREVIEW
             </div>
         </div>
         <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setViewMode('MOBILE')} className={`p-2 rounded ${viewMode === 'MOBILE' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('TABLET')} className={`p-2 rounded ${viewMode === 'TABLET' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Tablet className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('DESKTOP')} className={`p-2 rounded ${viewMode === 'DESKTOP' ? 'bg-white text-karm-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor className="w-4 h-4" /></button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
         <div className="flex flex-col gap-4 min-h-0">
             <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden border border-karm-sage bg-white">
                 <div className="bg-gray-50 px-4 py-2 text-xs font-mono text-orange-600 font-bold border-b border-gray-200">HTML5</div>
                 <textarea 
                   className="flex-1 bg-white p-4 text-sm font-mono text-gray-800 resize-none focus:outline-none"
                   value={html}
                   onChange={(e) => setHtml(e.target.value)}
                   spellCheck={false}
                 />
             </div>
             <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden border border-karm-sage bg-white">
                 <div className="bg-gray-50 px-4 py-2 text-xs font-mono text-blue-600 font-bold border-b border-gray-200">CSS3</div>
                 <textarea 
                   className="flex-1 bg-white p-4 text-sm font-mono text-gray-800 resize-none focus:outline-none"
                   value={css}
                   onChange={(e) => setCss(e.target.value)}
                   spellCheck={false}
                 />
             </div>
             <div className="flex-1 flex flex-col glass-panel rounded-xl overflow-hidden border border-karm-sage bg-white">
                 <div className="bg-gray-50 px-4 py-2 text-xs font-mono text-yellow-600 font-bold border-b border-gray-200">JavaScript</div>
                 <textarea 
                   className="flex-1 bg-white p-4 text-sm font-mono text-gray-800 resize-none focus:outline-none"
                   value={js}
                   onChange={(e) => setJs(e.target.value)}
                   spellCheck={false}
                 />
             </div>
         </div>

         <div className="glass-panel rounded-xl p-4 flex items-center justify-center bg-gray-100 border border-karm-sage overflow-hidden relative">
            <div className={`transition-all duration-500 bg-white shadow-xl overflow-hidden ${
                viewMode === 'MOBILE' ? 'w-[375px] h-[667px] rounded-[30px] border-8 border-gray-800' :
                viewMode === 'TABLET' ? 'w-[768px] h-[1024px] rounded-[20px] border-8 border-gray-800' :
                'w-full h-full rounded-lg border border-gray-200'
            }`}>
               <iframe 
                 srcDoc={srcDoc}
                 title="preview"
                 className="w-full h-full"
                 sandbox="allow-scripts"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default WebPlayground;