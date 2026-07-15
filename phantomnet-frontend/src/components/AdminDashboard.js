import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_attacks: 0, unique_attackers: 0, recent_logs: [] });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin-stats/');
      const data = await response.json();
      setStats({
        total_attacks: data.total_attacks || 0,
        unique_attackers: data.unique_attackers || 0,
        recent_logs: data.recent_logs || []
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const exportForensicReport = () => {
    const reportData = {
      incident_signature: "PHANTOMNET-SIEM-MITRE-AUDIT-2026",
      generated_at: new Date().toISOString(),
      threat_telemetry_summary: {
        total_breach_attempts: stats.total_attacks,
        isolated_nodes: stats.unique_attackers,
        compliance_standard: "MITRE_ATTACK_v13_MAPPED"
      },
      forensic_packet_logs: stats.recent_logs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "phantomnet_mitre_forensic_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) return <div className="p-8 text-rose-500 font-mono text-center animate-pulse">CONNECTING TO THREAT INTELLIGENCE APPLIANCE HUB...</div>;

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 p-6 font-mono selection:bg-cyan-500">
      
      {/* Header Container Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-500">
            🛡️ PHANTOMNET // ADVANCED SOC THREAT MATRIX
          </h1>
          <p className="text-[10px] text-slate-500 mt-1">MITRE ATT&CK STANDARD COMPLIANT INTERACTIVE SIEM DASHBOARD</p>
        </div>
        
        <button 
          onClick={exportForensicReport}
          className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 text-xs font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)] transition duration-200 uppercase tracking-widest"
        >
          📥 Export MITRE Compliance Audit
        </button>
      </div>

      {/* Grid: 3 Metric Cards & Visual Threat Map Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
        {/* Left Stats Cards Block Stack */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f1423] p-5 rounded-xl border border-slate-800 shadow-xl">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Mitigated Actions</p>
            <h2 className="text-4xl font-black text-rose-500 mt-2">{stats.total_attacks}</h2>
          </div>
          <div className="bg-[#0f1423] p-5 rounded-xl border border-slate-800 shadow-xl">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Isolated Threat Vectors</p>
            <h2 className="text-4xl font-black text-amber-500 mt-2">{stats.unique_attackers}</h2>
          </div>
        </div>

        {/* 🗺️ PREMIUM VISUAL THREAT MAP SIMULATOR NODE */}
        <div className="bg-[#0f1423] p-5 rounded-xl border border-slate-800 shadow-xl lg:col-span-2 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-2 z-10">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider">🌍 GLOBAL REAL-TIME THREAT INTEL MATRIX MAP</span>
            <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-black animate-pulse border border-rose-500/20">GRID FEEDS: ONLINE</span>
          </div>
          
          {/* Simulated Tactical Visual Grid Map Blocks */}
          <div className="h-full my-3 border border-slate-800/60 rounded bg-slate-950/60 p-4 flex flex-wrap gap-4 items-center justify-around relative select-none">
            {stats.recent_logs.length === 0 ? (
              <div className="text-xs text-slate-600 text-center w-full uppercase tracking-widest animate-pulse">Monitoring Global Network Nodes Matrix...</div>
            ) : (
              stats.recent_logs.slice(0, 4).map((node, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#121b36] border border-cyan-500/20 px-3 py-1.5 rounded-lg shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <div className="flex flex-col text-[9px]">
                    <span className="text-slate-300 font-bold">{node.geo_ip.split(" ")[0]} {node.geo_ip.split(" ")[1]}</span>
                    <span className="text-slate-500 font-mono tracking-tighter text-[8px]">{node.geo_coords}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Main SIRE MITRE Threat intel Table Stream */}
      <div className="bg-[#0f1423] rounded-xl border border-slate-800 p-5 shadow-2xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800/60 pb-2">
          Honeypot Exfiltration Trace Matrix (MITRE Framework v13 Mapped)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500 font-bold bg-slate-950/50">
                <th className="py-3 px-2">INTRUDER IP</th>
                <th className="py-3">THREAT REGION</th>
                <th className="py-3">CYBER DNA</th>
                <th className="py-3">MITRE ID TECHNIQUE</th> {/* <-- 🛡️ MITRE Heading */}
                <th className="py-3">TACTIC ANALYSIS</th>
                <th className="py-3 text-right pr-2">COUNTERMEASURE INDEX</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono">
              {stats.recent_logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-600 tracking-widest">NO DECEPTION SHELL INTERFACE LOGGED IN CURRENT RADAR CYCLE.</td>
                </tr>
              ) : (
                stats.recent_logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/30 hover:bg-[#131b32]/40 transition-colors">
                    <td className="py-3 px-2 text-amber-400 font-bold">{log.ip_address}</td>
                    <td className="py-3 text-emerald-400 font-bold flex flex-col">
                      <span>{log.geo_ip}</span>
                      <span className="text-[9px] text-slate-500 font-normal tracking-tighter">{log.geo_coords}</span>
                    </td>
                    <td className="py-3">
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.cyber_dna}
                      </span>
                    </td>
                    {/* MITRE Framework columns badges data inject code 👇 */}
                    <td className="py-3 text-cyan-400 font-black tracking-widest">⚙️ {log.mitre_id}</td>
                    <td className="py-3 text-slate-300 font-medium">{log.mitre_tactic}</td>
                    <td className="py-3 text-right pr-2">
                      <span className="text-rose-400 bg-rose-950/40 border border-rose-900/40 px-2.5 py-1 rounded font-black text-[9px] tracking-wider">
                        AUTO_SANDBOX_DROP
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;