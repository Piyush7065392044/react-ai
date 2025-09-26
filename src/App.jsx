import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Gemini_api } from "./constant";
import MarkdownRenderer from "./MarkdownRenderer";
import { FiEdit2, FiTrash2, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const payload = { contents: [{ parts: [{ text: question }] }] };

  const askQuestion = async () => {
    if (!question.trim()) return;
    const res = await fetch(Gemini_api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    const ans = json.candidates[0].content.parts[0].text;
    setResult((r) => [...r, { type: "q", text: question }, { type: "a", text: ans }]);
    setHistory((h) => [...h, question]);
    setQuestion("");
  };

  // scroll whole page to bottom when new message arrives
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [result]);

  const deleteHistoryItem = (i) => setHistory((h) => h.filter((_, idx) => idx !== i));
  const startEditing = (i) => { setEditingIndex(i); setEditText(history[i]); };
  const saveEdit = (i) => { const h = [...history]; h[i] = editText; setHistory(h); setEditingIndex(null); };
  const cancelEdit = () => setEditingIndex(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white grid grid-cols-6">
      {/* ---------- Sidebar ---------- */}
      <aside className="col-span-1 bg-gray-900/90 backdrop-blur-sm p-4 border-r border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">History</h2>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{history.length}</span>
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {history.map((q, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {editingIndex === i ? (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm outline-none" onKeyDown={(e) => { if (e.key === "Enter") saveEdit(i); if (e.key === "Escape") cancelEdit(); }} />
                    <div className="flex gap-2 mt-2"><button onClick={() => saveEdit(i)} className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded">Save</button><button onClick={cancelEdit} className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded">Cancel</button></div>
                  </div>
                ) : (
                  <div className="group relative bg-gray-800/50 hover:bg-gray-700/70 p-3 rounded-lg border border-transparent hover:border-gray-600"><p className="text-sm truncate pr-8">{q}</p><div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"><button onClick={() => startEditing(i)} className="p-1 hover:bg-gray-600 rounded"><FiEdit2 size={14} /></button><button onClick={() => deleteHistoryItem(i)} className="p-1 hover:bg-red-600/20 text-red-400 rounded"><FiTrash2 size={14} /></button></div></div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {history.length === 0 && <p className="text-gray-500 text-sm text-center mt-8">No history yet. Start chatting!</p>}
      </aside>

      {/* ---------- Chat Window ---------- */}
      <main className="col-span-5 p-6">
        <div className="max-w-4xl mx-auto space-y-6 mb-32">
          <AnimatePresence>
            {result.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${item.type === "q" ? "justify-end" : "justify-start"}`}>
                <div className={`relative group max-w-3xl shadow-lg ${item.type === "q" ? "bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl rounded-br-lg" : "bg-gray-700/80 rounded-3xl rounded-bl-lg border border-gray-600/50"}`}>
                  <div className="p-4">{item.type === "a" ? <div className="prose prose-invert max-w-none"><MarkdownRenderer content={item.text} /></div> : <span className="whitespace-pre-wrap text-sm">{item.text}</span>}</div>
                  {item.type === "a" && <button onClick={() => navigator.clipboard.writeText(item.text)} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600 hover:bg-gray-500 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ---------- Sticky Input Bar ---------- */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 p-4">
          <div className="max-w-4xl mx-auto">
            {/* //  piyush  */}
            <div className="flex items-center bg-gray-800/80 rounded-2xl p-2 shadow-2xl border border-gray-700/50 focus-within:border-blue-500 transition-colors">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askQuestion()} className="flex-1 bg-transparent outline-none text-white px-4 py-3 placeholder-gray-400" placeholder="Type your message here..." />
              <button onClick={askQuestion} disabled={!question.trim()} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"><FiSend size={18} /><span className="hidden sm:inline">Send</span></button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Powered by [P I Y U S H  ] </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

//  piyush 