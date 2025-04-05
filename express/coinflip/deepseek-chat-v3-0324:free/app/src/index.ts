import express from 'express';
import cors from 'cors';
import { nwc } from '@getalby/sdk';
import path from 'path';
import 'websocket-polyfill';

const app = express();
app.use(cors());
app.use(express.json());

// NWC connection string from task description
const NWC_CONNECTION_STRING = process.env.NWC_URL;

// Initialize NWC client
const nwcClient = new nwc.NWCClient({
  nostrWalletConnectUrl: NWC_CONNECTION_STRING
});

// Track game state per invoice
interface GameState {
  result?: 'heads' | 'tails';
  paid: boolean;
}

const gameStates = new Map<string, GameState>();

// Serve frontend HTML
app.get('/', (async (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
}));

// API Endpoint 1: Request coin flip
app.post('/api/flip', (async (req, res) => {
  try {
    const { rewardInvoice, choice } = req.body;
    
    // Check wallet balance (must have at least 20 sats)
    const balance = await nwcClient.getBalance();
    if (balance.balance < 20000) { // 20 sats in millisats
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate 10 sat invoice
    const invoice = await nwcClient.makeInvoice({
      amount: 10000, // 10 sats in millisats
      description: 'Coin flip game payment'
    });

    // Start polling for payment
    const checkPayment = async () => {
      try {
        const lookup = await nwcClient.lookupInvoice({
          invoice: invoice.invoice
        });

        if (lookup.settled_at) {
          // Stop polling
          clearInterval(interval);
          
          // Store flip result
          const result = Math.random() < 0.5 ? 'heads' : 'tails';
          console.log("Flip result: ",result);
          gameStates.set(invoice.invoice, { result, paid: false });
          
          if (result === choice) {
            // Pay reward invoice if user wins
            await nwcClient.payInvoice({ invoice: rewardInvoice });
            gameStates.set(invoice.invoice, { result, paid: true });
          }
        }
      } catch (err) {
        console.error('Error checking invoice:', err);
        clearInterval(interval);
      }
    };

    const interval = setInterval(checkPayment, 5000); // Check every 5 seconds
    setTimeout(() => clearInterval(interval), 10 * 60 * 1000); // Stop after 10 minutes

    res.json({ invoice: invoice.invoice });
  } catch (err) {
    console.error('Error processing flip request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

// API Endpoint 2: Check coin flip status
app.get('/api/status', (async (req, res) => {
  try {
    const { invoice } = req.query;
    
    if (typeof invoice !== 'string') {
      return res.status(400).json({ error: 'Invalid invoice' });
    }

    const gameState = gameStates.get(invoice);
    if (!gameState) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (gameState.paid) {
      return res.json({ status: 'paid', result: gameState.result });
    }

    const lookup = await nwcClient.lookupInvoice({ invoice });
    if (lookup.settled_at) {
      gameState.paid = true;
      return res.json({ status: 'paid', result: gameState.result });
    }
    return res.json({ status: 'unpaid', result: gameState.result });
  } catch (err) {
    console.error('Error checking status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
