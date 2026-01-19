import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, LayoutDashboard, Activity, Lock, User, Terminal, Zap, ShieldCheck, Mail, LogOut, Search, Download, ShieldX
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const chartData = [
  { name: '10:00', fraud: 4 }, { name: '11:00', fraud: 7 }, { name: '12:00', fraud: 2 },
  { name: '13:00', fraud: 15 }, { name: '14:00', fraud: 8 }, { name: '15:00', fraud: 10 }, { name: '16:00', fraud: 12 },
];

// --- LOGIN COMPONENT ---
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess();
      } else { alert(data.msg || "Invalid Credentials"); }
    } catch (err) { alert("Backend Offline!"); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full bg-[#121212] border border-gray-800 p-8 rounded-2xl shadow-2xl shadow-red-900/20">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-[#ff003c] w-12 h-12 mb-4" />
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">SECURE<span className="text-[#ff003c]">SOC</span></h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative"><Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" /><input type="email" placeholder="ACCESS_ID" className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-12 text-white focus:border-[#ff003c] outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="relative"><Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" /><input type="password" placeholder="ENCRYPTED_PASS" className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-12 text-white focus:border-[#ff003c] outline-none transition" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button type="submit" className="w-full bg-[#ff003c] py-3 rounded-lg font-black uppercase tracking-[0.2em] hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-600/20 text-xs">Initialize System</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- DASHBOARD COMPONENT ---
const Dashboard = ({ onLogout }) => {
  const [amount, setAmount] = useState('');
  const [freq, setFreq] = useState('');
  const [result, setResult] = useState(null);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (isBlacklisted) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/analyze-txn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), freq: Number(freq), time: new Date().getHours() })
      });
      
      const data = await response.json();
      
      if (response.status === 403) {
        setIsBlacklisted(true);
        setResult({ status: 'TERMINATED', risk_score: 100, verdict: 'IP_BLACKLISTED_BY_AI' });
      } else {
        setResult(data);
        if (data.status === 'TERMINATED') setIsBlacklisted(true);
      }
    } catch (err) { alert("Security Engine Connection Lost!"); }
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/export-report', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-gray-100 font-mono">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#121212] border-r border-gray-800 p-6 flex flex-col fixed h-full shadow-2xl">
        <div className="flex items-center gap-3 mb-10"><ShieldAlert className="text-[#ff003c] w-8 h-8" /><h1 className="text-xl font-black uppercase italic text-white tracking-tighter">Secure<span className="text-[#ff003c]">AI</span></h1></div>
        <nav className="flex-1 space-y-2">
          <div className="bg-[#ff003c]/10 text-[#ff003c] p-3 rounded-xl border border-[#ff003c]/20 flex items-center gap-2 font-bold cursor-pointer transition"><LayoutDashboard size={20}/> Overview</div>
          <div onClick={handleExport} className="p-3 flex items-center gap-2 text-gray-500 hover:text-[#39ff14] cursor-pointer transition uppercase text-xs font-bold tracking-widest"><Download size={18}/> Export Audit</div>
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-3 p-3 text-gray-500 hover:text-red-500 transition border border-transparent hover:border-red-900/30 rounded-xl font-bold uppercase text-[10px] tracking-widest"><LogOut size={16} /> Log Out System</button>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBlacklisted ? 'bg-red-600' : 'bg-[#39ff14]'} animate-pulse`}></div>
            <h2 className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase italic">
                {isBlacklisted ? 'SESSION_TERMINATED' : 'AI_NODE_01_ACTIVE'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-[#39ff14] uppercase bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
            {user.username}
          </div>
        </header>

        {/* AI PREDICTOR SECTION */}
        <section className={`p-6 rounded-2xl mb-8 border transition-all duration-500 ${isBlacklisted ? 'bg-red-950/20 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-[#121212] border-gray-800 shadow-2xl'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[#39ff14]"><Search size={18} /> <h3 className="text-sm font-black uppercase tracking-widest">Autonomous Anomaly Predictor</h3></div>
            {isBlacklisted && <div className="flex items-center gap-2 text-red-500 text-[10px] font-black border border-red-500 px-2 py-1 rounded animate-bounce"><ShieldX size={14}/> SECURITY LOCK ACTIVE</div>}
          </div>
          
          <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="number" placeholder="TXN_AMOUNT" className="bg-black border border-gray-800 p-3 rounded-lg text-white focus:border-[#ff003c] outline-none transition disabled:opacity-50" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isBlacklisted} required />
            <input type="number" placeholder="TXN_FREQUENCY" className="bg-black border border-gray-800 p-3 rounded-lg text-white focus:border-[#ff003c] outline-none transition disabled:opacity-50" value={freq} onChange={(e) => setFreq(e.target.value)} disabled={isBlacklisted} required />
            <button type="submit" disabled={isBlacklisted} className={`font-black rounded-lg transition uppercase text-[10px] tracking-widest ${isBlacklisted ? 'bg-gray-800 text-gray-500' : 'bg-[#ff003c] hover:bg-red-700 active:scale-95 shadow-lg shadow-red-600/20'}`}>
               Analyze Pattern
            </button>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-4 rounded-lg border-2 ${result.status === 'SAFE' ? 'border-green-600 bg-green-900/10' : 'border-red-600 bg-red-900/20'}`}>
              <div className="flex justify-between items-center">
                <p className="font-black uppercase text-[12px] tracking-tighter">AI_VERDICT: <span className={result.status === 'SAFE' ? 'text-green-500' : 'text-red-500'}>{result.status}</span></p>
                <span className="text-[10px] font-bold text-gray-500 uppercase italic">Conf: 94.2%</span>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${result.risk_score > 70 ? 'bg-red-600' : 'bg-green-600'}`} style={{ width: `${result.risk_score}%` }}></div>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[9px] text-gray-400 uppercase font-bold">Risk Level: {result.risk_score}/100</p>
                <p className={`text-[9px] font-black uppercase italic ${result.status === 'SAFE' ? 'text-green-600' : 'text-red-600'}`}>{result.verdict || 'Anomalous Entry Detected'}</p>
              </div>
            </motion.div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#121212] border border-gray-800 rounded-2xl p-6 h-[350px] shadow-2xl relative overflow-hidden">
            <div className="flex justify-between mb-4"><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live_Anomlay_Trend</span><span className="text-[#ff003c] text-[10px] animate-pulse font-bold tracking-tighter uppercase italic">Secure_Connection</span></div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}><CartesianGrid stroke="#1a1a1a" vertical={false}/><XAxis dataKey="name" hide/><Tooltip contentStyle={{backgroundColor:'#000', border:'1px solid #333', fontSize:'10px'}}/><Area type="monotone" dataKey="fraud" stroke="#ff003c" fill="url(#colorFraud)" strokeWidth={3}/><defs><linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff003c" stopOpacity={0}/></linearGradient></defs></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col">
             <div className="flex items-center gap-2 mb-4 text-[#39ff14] border-b border-gray-800 pb-2"><Terminal size={14}/><span className="text-[9px] font-black uppercase tracking-widest italic">Live_Neural_Logs</span></div>
             <div className="space-y-3 text-[10px] font-mono flex-1 overflow-y-auto pr-2 custom-scroll">
                <p className="text-gray-500">[16:01] <span className="text-red-500 italic uppercase">Anomaly confirmed node_04</span></p>
                <p className="text-gray-400">[15:58] Kernel sync: success</p>
                <p className="text-gray-400">[15:45] API analysis heartbeat active</p>
                <p className="text-gray-600 text-[8px] uppercase tracking-tighter">-- end of encrypted logs --</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); };
  return isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
}