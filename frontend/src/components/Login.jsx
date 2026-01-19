import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abhi ke liye temporary bypass
    if(email === "admin@secure.ai" && password === "admin123") {
        onLoginSuccess();
    } else {
        alert("Invalid Credentials! Try: admin@secure.ai / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#121212] border border-gray-800 p-8 rounded-2xl shadow-2xl shadow-red-900/20"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-red-900/20 rounded-full mb-4">
            <ShieldCheck className="text-[#ff003c] w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black tracking-widest uppercase italic text-white">
            Secure<span className="text-[#ff003c]">Auth</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 tracking-tighter uppercase">Enter credentials to access terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="ACCESS_ID (EMAIL)"
              className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff003c] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input 
              type="password" 
              placeholder="ENCRYPTED_PASS"
              className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff003c] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#ff003c] hover:bg-red-700 text-white font-bold py-3 rounded-lg tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            INITIALIZE SESSION
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-900 text-center">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">
            Warning: Unauthorized access is logged by AI.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;