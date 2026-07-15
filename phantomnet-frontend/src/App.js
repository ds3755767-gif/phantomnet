import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import RealDashboard from './components/RealDashboard';
import FakeDashboard from './components/FakeDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Component load hote hi url query bypass check karega
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('view') === 'admin') {
      setIsAdminView(true);
    }
  }, []);

  // 1. Agar admin parameter active hai, toh direct telemetry load hogi
  if (isAdminView) {
    return <AdminDashboard />;
  }

  // 2. Agar session empty hai, toh login render hoga
  if (!session) {
    return <Login onLoginSuccess={(data) => setSession(data)} />;
  }

  // 3. Main Honeypot Route Execution
  return (
    <div>
      <div className="bg-slate-950 text-slate-400 text-center py-2 text-xs font-mono border-b border-slate-800">
        Logged in as: <span className="text-white font-bold">{session.user}</span> | 
        Detection Status: {session.is_attacker ? (
          <span className="text-rose-400 font-bold ml-1">ATTACKER FLAGGED (HONEYPOT)</span>
        ) : (
          <span className="text-emerald-400 font-bold ml-1">CLEAN SESSION</span>
        )}
      </div>

      {session.is_attacker ? <FakeDashboard /> : <RealDashboard />}
    </div>
  );
}

export default App;