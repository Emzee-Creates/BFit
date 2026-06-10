// src/components/Auth.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dumbbell } from 'lucide-react';

export default function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setMessage('Registration successful! Check your email for a confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md space-y-6">
        
        {/* Branding Logo Area */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Naija Mass Tracker</h2>
          <p className="text-xs text-slate-400">Maximize your 3-month weight gain phase</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2.5 rounded-r text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 p-2.5 rounded-r text-xs font-medium">
            {message}
          </div>
        )}

        {/* Input Interactive Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value.toLowerCase() /* lower casing email strings helps prevent login match bugs */)} placeholder="e.g. name@domain.com" className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600" />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 rounded-xl shadow-sm cursor-pointer transition-colors disabled:opacity-50">
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* View Toggle Controller */}
        <div className="text-center pt-2">
          <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setMessage(''); }} className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer">
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}