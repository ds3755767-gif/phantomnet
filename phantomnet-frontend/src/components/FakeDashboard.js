import React, { useState, useEffect } from 'react';

const FakeDashboard = () => {
  const [fakeData, setFakeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customToast, setCustomToast] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [deceptionLayer, setDeceptionLayer] = useState("Alpha Shell");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/fake-accounts/')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setFakeData(data); })
      .catch(() => {});
  }, []);

  const forceSystemCrash = () => {
    document.body.innerHTML = `
      <div style="background-color: #0b0f19; color: #f43f5e; font-family: 'Courier New', monospace; 
                  height: 100vh; display: flex; flex-direction: column; justify-content: center; 
                  align-items: center; text-align: center; margin: 0; padding: 20px;">
        <div style="border: 2px dashed #f43f5e; padding: 40px; border-radius: 12px; 
                    box-shadow: 0 0 50px rgba(244, 63, 94, 0.3); max-width: 600px;">
          <h1 style="font-size: 2.3rem; font-weight: 900; margin-bottom: 20px; text-transform: uppercase;">
            🛑 ACCESS DENIED // HARDWARE FIREWALL BLOCK
          </h1>
          <p style="font-size: 1rem; color: #94a3b8; line-height: 1.6; margin-bottom: 25px;">
            Your client socket connection has been permanently blacklisted and isolated by the Enterprise SOC Countermeasure Engine due to Critical Malicious Behavior.
          </p>
          <div style="font-size: 11px; color: #f43f5e; background-color: #020617; padding: 12px; 
                      border: 1px solid #1e293b; border-radius: 6px; letter-spacing: 2px;">
            [RISK INDEX: 100% EXCEEDED // MITRE ATT&CK CONTAINMENT LAYER MET]
          </div>
        </div>
      </div>
    `;
  };

  const triggerDecoyPipeline = async (attackAction, amountField, addedRisk) => {
    setLoading(true);
    setCustomToast(null);

    const updatedScore = riskScore + addedRisk;
    setRiskScore(updatedScore);

    // 🎭 ADVANCED: DECEPTION SHELL ROTATION
    // Agar attacker pehla attack perform kar deta hai, toh hum system ka decoy data randomly change 
    // kar denge taaki use lage ki usne internal variables modify kar diye hain (Bait-and-Switch)
    if (updatedScore >= 45 && updatedScore < 100) {
      setDeceptionLayer("Omega Shell (Shadow Deep Honeypot)");
      setFakeData([
        {"id": 1, "name": "John Doe [SYSTEM_ROOT]", "balance": "75000000"},
        {"id": 2, "name": "Jane Smith [CORE_VAULT]", "balance": "120450000"}
      ]);
    }

    try {
      await fetch('http://127.0.0.1:8000/api/log-attack/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: attackAction, 
          details: { attempted_amount: amountField, telemetry_score: updatedScore } 
        }),
      });

      setLoading(false);

      if (updatedScore >= 100) {
        setCustomToast("🚨 MITRE ATT&CK PROTOCOL TA0010 TRIGGERED! ISOLATING ENDPOINT...");
        setTimeout(() => {
          forceSystemCrash();
        }, 1500);
      } else {
        setCustomToast(`⚠️ Response Choked. [Shell Shift: ${deceptionLayer} // Risk Level: ${updatedScore}%]`);
      }

    } catch (err) {
      setLoading(false);
      if (updatedScore >= 100) forceSystemCrash();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-mono relative">
      
      {/* UEBA Analysis Dashboard Stream Header */}
      <div className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl mb-6 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400">🧠 INTERACTIVE UEBA BEHAVIORAL ANALYSIS MATRIX:</span>
          <span className="text-[10px] text-cyan-400 font-bold">DECOY SHELL ENVIRONMENT: {deceptionLayer}</span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-1/2">
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(riskScore, 100)}%` }}></div>
          </div>
          <span className={`text-xs font-black min-w-[40px] ${riskScore >= 70 ? 'text-rose-500' : 'text-amber-400'}`}>{riskScore}%</span>
        </div>
      </div>

      {customToast && (
        <div className="absolute top-24 right-4 bg-slate-950 border-2 border-rose-500 text-rose-400 px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold animate-pulse max-w-sm">
          {customToast}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
          <p className="text-rose-400 font-bold tracking-widest text-sm animate-pulse">
            ⌛ AI TAR-PIT CAPTURING MALICIOUS TELEMETRY VECTOR...
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-emerald-400">⚡ CENTRAL CORE SUITE</h1>
          <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold tracking-widest">
            SANDBOX MATRIX v4.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {fakeData.map((account) => (
            <div key={account.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden">
              <p className="text-xs text-slate-400 uppercase">Target User Node: {account.name}</p>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300 mt-2">
                ${parseFloat(account.balance).toLocaleString()}.00
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
            <h3 className="text-sm font-bold mb-4 text-slate-400 uppercase">Financial Node Exfiltration</h3>
            <button 
              onClick={() => triggerDecoyPipeline('Unauthorized Withdrawal Attempt', '$250,000.00', 45)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 uppercase tracking-wider text-xs"
            >
              Exfiltrate Decoy Funds (+45% Risk)
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold mb-2 text-slate-400 uppercase">Target Server Directory</h3>
              <p className="text-xs text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 p-2 rounded mb-4">
                📁 Sensitive Trap File: core_db_backup_2026.sql.tar.gz (5.4 GB)
              </p>
            </div>
            <button 
              onClick={() => triggerDecoyPipeline('HoneyToken File Exfiltration Attempt', 'DB_BACKUP_SQL', 60)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 uppercase tracking-wider text-xs"
            >
              📥 Download HoneyToken DB (+60% Risk)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDashboard;