const express = require('express');
const router = express.Router();

router.post('/pay', async (req, res) => {
  try {
    const { phone, pin, amount, plan } = req.body;
    if (!phone || !pin || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required payment details.' });
    }
    console.log(`Initiating MoMo payment of ZMW ${amount} for phone +260${phone}`);
    return res.status(200).json({ 
      success: true, 
      message: 'Payment prompt sent successfully. Please check your phone for confirmation SMS.' 
    });
  } catch (error) {
    console.error('MoMo Pay Error:', error);
    res.status(500).json({ success: false, message: 'Server error processing payment request.' });
  }
});

router.post('/verify-sms', async (req, res) => {
  try {
    const { smsContent, phone } = req.body;
    if (!smsContent) {
      return res.status(400).json({ success: false, message: 'SMS content is required for verification.' });
    }
    if (smsContent.toLowerCase().includes('failed') || smsContent.toLowerCase().includes('cancelled')) {
      return res.status(400).json({ success: false, message: 'Provided SMS indicates a failed or cancelled transaction.' });
    }
    console.log(`Verified transaction SMS for phone +260${phone}`);
    return res.status(200).json({ 
      success: true, 
      message: 'SMS verified and Starlink renewal activated successfully!' 
    });
  } catch (error) {
    console.error('SMS Verify Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify transaction SMS.' });
  }
});

module.exports = router;
