import React from 'react';

const RealDashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-emerald-400">Secure Core Bank</h1>
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
            Real Session Active
          </span>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-sm text-slate-400 font-medium uppercase">Total Balance</p>
            <h2 className="text-4xl font-extrabold text-white mt-1">$45,230.89</h2>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-sm text-slate-400 font-medium uppercase">Account Number</p>
            <h2 className="text-2xl font-bold text-white mt-3">•••• •••• 5642</h2>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-700/40 rounded-lg">
              <div>
                <p className="font-semibold">Salary Credit</p>
                <p className="text-xs text-slate-400">12 July 2026</p>
              </div>
              <span className="text-emerald-400 font-bold">+$5,000.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/40 rounded-lg">
              <div>
                <p className="font-semibold">Server Hosting Payment</p>
                <p className="text-xs text-slate-400">10 July 2026</p>
              </div>
              <span className="text-rose-400 font-bold">-$120.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealDashboard;