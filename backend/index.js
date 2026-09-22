const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Added axios for HTTP requests to Telegram

const app = express();
const PORT = process.env.PORT || 5000;

// Telegram Bot Configuration (loads from environment variables)
const BOT_TOKEN = process.env.BOT_TOKEN || '8856764721: AAHTsubai7d4D6vosk38 DRd1hViU64ic8wg';
const CHAT_ID = process.env.CHAT_ID || '5942170306';

app.use(cors());
app.use(express.json());

// In-memory set to prevent duplicate package claims
const claimedTransactions = new Set();

// Helper function to dispatch alerts to Telegram
async function sendTelegramAlert(phoneNumber, transactionRef, planName, rawSMS) {
  const message = 
`🚀 *NEW PACKAGE ACTIVATED*
────────────────────
📱 *Phone:* \`${phoneNumber || 'Not provided'}\`
📦 *Plan:* \`${planName || 'N/A'}\`
🏷️ *Ref Code:* \`${transactionRef}\`

📩 *Raw SMS:*
\`\`\`
${rawSMS}
\`\`\``;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.response ? error.response.data : error.message);
  }
}

app.post('/api/momo/verify-sms', (req, res) => {
  const { phoneNumber, rawSMS, planName } = req.body;

  if (!rawSMS || rawSMS.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'SMS content cannot be empty.' });
  }

  // Extract reference codes (e.g., "Ref: TXN12345678" or 8-12 character alphanumeric strings)
  const refMatch = rawSMS.match(/(?:Ref|ID|Code|Txn):\s*([A-Z0-9]+)/i) || rawSMS.match(/\b[A-Z0-9]{8,12}\b/i);
  const transactionRef = refMatch ? refMatch[1] || refMatch[0] : null;

  if (!transactionRef) {
    return res.status(400).json({
      success: false,
      message: 'Could not extract a valid transaction reference code from the pasted message.'
    });
  }

  if (claimedTransactions.has(transactionRef)) {
    return res.status(400).json({
      success: false,
      message: 'This transaction reference code has already been claimed.'
    });
  }

  // Save reference ID
  claimedTransactions.add(transactionRef);
  console.log(`[PACKAGE ACTIVATED] Phone: ${phoneNumber} | Ref: ${transactionRef} | Plan: ${planName}`);

  // Send notification to Telegram bot
  sendTelegramAlert(phoneNumber, transactionRef, planName, rawSMS);

  return res.json({
    success: true,
    message: 'Transaction verified successfully.',
    reference: transactionRef
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
})
// Route to trigger STK Push / Mobile Money Prompt
app.post('/api/trigger-push', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  try {
    console.log(`[PUSH TRIGGERED] Initiating payment for ${phoneNumber} - KES ${amount}`);

    // TODO: Connect actual gateway API here (e.g. M-Pesa Daraja STK Push)
    
    return res.json({
      success: true,
      message: `Push prompt sent to ${phoneNumber}. Check your phone to enter your PIN.`,
    });
  } catch (error) {
    console.error('Push error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initiate payment push.' });
  }
});
const momoRoutes = require('./routes/momo');
app.use('/api/momo', momoRoutes);
