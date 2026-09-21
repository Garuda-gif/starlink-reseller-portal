import React, { useState } from 'react';
import { Gauge, ArrowDown, ArrowUp, Activity, Database, Smartphone, MessageSquareText, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';

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
          {['dashboard', 'plans', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize transition ${activeTab === tab ? 'text-yellow-400 font-bold border-b-2 border-yellow-400 pb-1' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            {/* Service Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-xl">
              <div>
                <p className="text-xs text-yellow-400 uppercase tracking-widest font-semibold">Service Status</p>
                <h1 className="text-2xl font-bold mt-1 text-white">Starlink Portal</h1>
                <p className="text-xs text-slate-400 mt-1">Select a package to activate high-speed satellite connectivity.</p>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={<ArrowDown className="text-blue-400" />} label="Download" value="142" unit="Mbps" />
              <MetricCard icon={<ArrowUp className="text-green-400" />} label="Upload" value="28" unit="Mbps" />
              <MetricCard icon={<Activity className="text-yellow-400" />} label="Ping" value="38" unit="ms" />
              <MetricCard icon={<Gauge className="text-purple-400" />} label="Jitter" value="4" unit="ms" />
            </div>

            {/* Data Usage Indicator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Database className="text-yellow-400 w-5 h-5" />
                  <h3 className="font-semibold text-sm">Monthly Data Consumption</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">{usagePercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${usagePercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{dataUsed} GB Used</span>
                <span>{totalData} GB Limit</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-yellow-500/50 transition">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                  <div className="text-3xl font-black text-yellow-400">
                    KES {plan.price} <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 pt-2">
                    <li>• Speed: <b className="text-white">{plan.speed}</b></li>
                    <li>• Allowance: <b className="text-white">{plan.data}</b></li>
                    <li>• Low Latency Satellite Coverage</li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Buy Package
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

      {/* SMS Verification Checkout Modal */}
      {selectedPlan && (
        <SMSVerificationModal selectedPlan={selectedPlan} onClose={() => setSelectedPlan(null)} />
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
      <div className="text-2xl font-bold text-white">
        {value} <span className="text-xs font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function SMSVerificationModal({ selectedPlan, onClose }) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pastedSMS, setPastedSMS] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/momo/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          rawSMS: pastedSMS,
          planName: selectedPlan.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTransactionRef(data.reference);
        setStep(2);
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      setError('Could not connect to verification server.');
    } finally {
      setLoading(false);
    }
  };
const handleInitiatePush = async () => {
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('/api/trigger-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phone,
        amount: selectedPlan?.price || 350,
      }),
    });

    const data = await response.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Could not connect to backend server.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white">Buy {selectedPlan.name}</h3>
            <p className="text-xs text-yellow-400 font-semibold">Total: KES {selectedPlan.price}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white pl-9 text-xs focus:outline-none focus:border-yellow-500"
                  required
                />
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Paste SMS Confirmation Message</label>
              <div className="relative">
                <textarea
                  rows="3"
                  placeholder="Paste the full payment SMS received..."
                  value={pastedSMS}
                  onChange={(e) => setPastedSMS(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-yellow-500 leading-relaxed"
                  required
                />
                <MessageSquareText className="w-4 h-4 text-slate-600 absolute right-3 bottom-3" />
              </div>
            </div>
<button
  type="button"
  onClick={handleInitiatePush}
  disabled={loading}
  className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold py-2.5 rounded-xl text-xs transition mb-2"
>
  {loading ? "Sending..." : "Send STK Push Prompt"}
</button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition flex justify-center items-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Claim Package</span>}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h4 className="font-bold text-white text-lg">Package Activated!</h4>
            <p className="text-xs text-slate-400">Payment verified successfully for <b>{selectedPlan.name}</b>.</p>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-slate-300">
              Ref ID: <span className="text-yellow-400">{transactionRef}</span>
            </div>
            <button onClick={onClose} className="mt-2 bg-slate-800 hover:bg-slate-700 text-white text-xs px-5 py-2 rounded-xl">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
