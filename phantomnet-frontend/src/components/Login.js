import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // <-- Ye line missing hai, ise add karo!
      });

      const data = await response.json();

      if (response.ok || data.is_attacker) {
        // Agar response ok hai YA fir wo attacker flag ke saath aaya hai (Honeypot trigger)
        onLoginSuccess(data);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server se connect nahi ho pa raha h!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-black text-center text-emerald-400 mb-6 tracking-wide">
          SECURE BANK LOGIN
        </h2>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-3 rounded-xl mb-4 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 mt-2 shadow-lg shadow-emerald-500/20"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;