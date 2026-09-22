import React, { useState } from 'react';
import { Gauge, ArrowDown, ArrowUp, Activity, Database, Smartphone, MessageSquareText, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import MoMoCheckout from './components/MoMoCheckout';

export default function App() {
const [activeTab, setActiveTab] = useState('dashboard');
const [selectedPlan, setSelectedPlan] = useState(null);
const [dataUsed, setDataUsed] = useState(35);
const totalData = 100;
const usagePercentage = (dataUsed / totalData) * 100;

const plans = [
{ id: 1, name: 'Basic Tier', speed: '50 Mbps', data: '50 GB', price: 350 },
{ id: 2, name: 'Standard Tier', speed: '150 Mbps', data: '100 GB', price: 650 },
{ id: 3, name: 'Priority Tier', speed: '250+ Mbps', data: 'Unlimited', price: 1200 },
];

return (
<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
  {/* Navigation Header */}
  <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <span className="font-bold text-xl tracking-wider text-white">STARLINK</span>
      <span className="text-xs bg-yellow-500 text-slate-950 font-bold px-2 py-0.5 rounded">Reseller Portal</span>
    </div>
    <nav className="flex space-x-6 text-sm">
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}
      >
        Dashboard
      </button>
      <button 
        onClick={() => setActiveTab('plans')} 
        className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'plans' ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}
      >
        Buy Data
      </button>
      <button 
        onClick={() => setActiveTab('orders')} 
        className={`hover:text-amber-500 transition-colors cursor-pointer ${activeTab === 'orders' ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}
      >
        Orders
      </button>
    </nav>
  </header>

  {/* Main Content Area */}
  <main className="p-6 max-w-7xl mx-auto space-y-6">
    {activeTab === 'dashboard' && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={<Gauge className="w-5 h-5 text-amber-500"/>} label="Current Speed" value="142.5 Mbps" unit="Download" />
        <MetricCard icon={<Activity className="w-5 h-5 text-emerald-500"/>} label="Connection Status" value="Online" unit="Latency: 28ms" />
        <MetricCard icon={<Database className="w-5 h-5 text-blue-500"/>} label="Data Balance" value={`${totalData - dataUsed} GB`} unit={`Used: ${dataUsed} GB`} />
      </div>
    )}

    {activeTab === 'plans' && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="text-3xl font-extrabold text-amber-500 mt-2">KES {plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>⚡ Speed: {plan.speed}</li>
                <li>📦 Data Allowance: {plan.data}</li>
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan(plan)}
              className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>
    )}

    {activeTab === 'orders' && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-4">Transaction History</h3>
        <div className="text-xs text-slate-400 text-center py-8">
          No recent orders found. Purchased packages will appear here.
        </div>
      </div>
    )}
  </main>

  {/* MoMo Checkout Modal */}
  {selectedPlan && (
    <MoMoCheckout 
      plan={selectedPlan.name} 
      amount={selectedPlan.price} 
      onClose={() => setSelectedPlan(null)} 
      onSuccess={(data) => {
        alert('Package claimed successfully!');
        setSelectedPlan(null);
      }} 
    />
  )}
</div>
);
}

function MetricCard({ icon, label, value, unit }) {
return (
<div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
  <div className="flex justify-between items-center text-slate-400 text-xs">
    <span>{label}</span>
    {icon}
  </div>
  <div className="text-2xl font-bold text-white">{value}</div>
  <div className="text-xs text-slate-500">{unit}</div>
</div>
);
}
