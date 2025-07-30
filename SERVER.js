




// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/charge', async (req, res) => {
  const { token, amountInCents } = req.body;

  if (!token || !amountInCents) {
    return res.status(400).json({ error: "Missing token or amount." });
  }

  try {
    const response = await fetch('https://online.yoco.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency: 'ZAR'
      })
    });

    const result = await response.json();

    if (result.status === 'successful') {
      console.log('✅ Payment successful:', result);
      res.json({ status: 'successful' });
    } else {
      console.log('❌ Payment failed:', result);
      res.status(400).json({ status: 'failed', message: result.message });
    }
  } catch (error) {
    console.error('❗Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on https://localhost:${PORT}`);
});
