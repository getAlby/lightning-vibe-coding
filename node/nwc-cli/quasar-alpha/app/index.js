#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { nwc, nwa } = require('@getalby/sdk');
require('websocket-polyfill');
const qrcode = require('qrcode-terminal');

const secretFile = path.join(__dirname, '.nwc_secret');

let client = null;
let unsubscribe;

// Initialize client if secret exists
if (fs.existsSync(secretFile)) {
  const nwcUrl = fs.readFileSync(secretFile, 'utf8').trim();
  if (nwcUrl) {
    client = new nwc.NWCClient({ nostrWalletConnectUrl: nwcUrl });
  }
}

async function startRepl() {
  program
  .exitOverride((err) => {
    // suppress exit in REPL
    throw err; // still throw so parseAsync rejects, but don't exit
  });
  console.log('Welcome to NWC CLI interactive shell!');
  if (!client) console.log('Please login using: login <nwc_url>');
  console.log('Type "help" for a list of commands. Type "exit" to quit.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }
    if (input === 'exit') {
      rl.close();
      return;
    }
    const args = input.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    try {
      await program.parseAsync([...args], { from: 'user' });
    } catch (err) {
      if (err.exitCode !== 0) {
        console.error('Error:', err.message);
      }
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}

const program = new Command();

program
  .name('nwc-cli')
  .description('Nostr Wallet Connect CLI Tool')
  .version('1.0.0');

program
  .command('login')
  .description('Login with NWC URL string or via scanning QR code')
  .argument('[nwc_url]', 'NWC connection URL (optional)')
  .action(async (nwc_url) => {
    if (nwc_url) {
      fs.writeFileSync(secretFile, nwc_url.trim());
      client = new nwc.NWCClient({ nostrWalletConnectUrl: nwc_url.trim() });
      console.log('Logged in and NWC URL saved.');
    } else {
      console.log('No NWC URL provided. Generating a new connection.');
      const nwaClient = new nwa.NWAClient({
        name: "NWC CLI",
        relayUrl: 'wss://relay.getalby.com/v1',
        requestMethods: [
          'get_info',
          'get_balance',
          'get_budget',
          'pay_invoice',
          'list_transactions',
          'lookup_invoice',
          'make_invoice',
        ],
        notificationTypes: ["payment_received", "payment_sent"],
        isolated: true,
      });
      const uri = nwaClient.connectionUri;
      console.log('Scan this QR code with your wallet app to connect:');
      qrcode.generate(uri, { small: true });
      console.log('Or use this wallet auth URL:');
      console.log(uri);
      console.log("To use an existing NWC URL, exit and pass it as an argument.")
      await nwaClient.subscribe({
        onSuccess: (nwcClient) => {
          const url = nwcClient.getNostrWalletConnectUrl();
          fs.writeFileSync(secretFile, url);
          client = nwcClient;
          console.log('Logged in and NWC URL saved.');
        }
      });
    }
  });

program
  .command('logout')
  .description('Logout and remove saved NWC URL')
  .action(() => {
    if (fs.existsSync(secretFile)) {
      fs.unlinkSync(secretFile);
      console.log('Logged out and secret removed.');
    } else {
      console.log('No secret found.');
    }
    client = null;
  });

program
  .command('make_invoice')
  .description('Create an invoice')
  .option('--amount <msat>', 'Amount in millisatoshis')
  .option('--amount_sat <sat>', 'Amount in satoshis (overrides msat)')
  .option('--description <desc>', 'Invoice description')
  .option('--description_hash <hash>', 'Description hash (hex)')
  .option('--expiry <seconds>', 'Invoice expiry in seconds')
  .option('--metadata <json>', 'Additional metadata as JSON string')
  .action(async (opts) => {
    if (!client) return console.log('Please login first.');
    let amountMsat = opts.amount;
    if (opts.amount_sat) amountMsat = parseInt(opts.amount_sat) * 1000;
    if (!amountMsat) return console.log('Please provide --amount or --amount_sat');
    const req = { amount: amountMsat };
    if (opts.description) req.description = opts.description;
    if (opts.description_hash) req.description_hash = opts.description_hash;
    if (opts.expiry) req.expiry = parseInt(opts.expiry);
    if (opts.metadata) {
      try {
        req.metadata = JSON.parse(opts.metadata);
      } catch {
        console.error('Invalid JSON for metadata');
        return;
      }
    }
    try {
      const invoice = await client.makeInvoice(req);
      console.log('Invoice:', invoice);
    } catch (err) {
      console.error('Error creating invoice:', err.message);
    }
  });

program
  .command('pay_invoice')
  .description('Pay a lightning invoice')
  .argument('<bolt11>', 'BOLT11 invoice string')
  .option('--amount <msat>', 'Amount in millisatoshis (optional override)')
  .option('--amount_sat <sat>', 'Amount in satoshis (optional override, converted to msat)')
  .option('--metadata <json>', 'Additional metadata as JSON string')
  .action(async (bolt11, opts) => {
    if (!client) return console.log('Please login first.');
    const req = { invoice: bolt11 };
    if (opts.amount_sat) req.amount = parseInt(opts.amount_sat) * 1000;
    else if (opts.amount) req.amount = parseInt(opts.amount);
    if (opts.metadata) {
      try {
        req.metadata = JSON.parse(opts.metadata);
      } catch {
        console.error('Invalid JSON for metadata');
        return;
      }
    }
    try {
      const result = await client.payInvoice(req);
      console.log('Payment result:', result);
    } catch (err) {
      console.error('Error paying invoice:', err.message);
    }
  });

program
  .command('get_info')
  .description('Get wallet info')
  .action(async () => {
    if (!client) return console.log('Please login first.');
    try {
      const info = await client.getInfo();
      console.log('Info:', info);
    } catch (err) {
      console.error('Error getting info:', err.message);
    }
  });

program
  .command('get_balance')
  .description('Get wallet balance')
  .action(async () => {
    if (!client) return console.log('Please login first.');
    try {
      const balance = await client.getBalance();
      console.log('Balance:', balance);
    } catch (err) {
      console.error('Error getting balance:', err.message);
    }
  });

program
  .command('list_transactions')
  .description('List transactions')
  .option('--from <timestamp>', 'Start timestamp (seconds since epoch)')
  .option('--until <timestamp>', 'End timestamp (seconds since epoch)')
  .option('--limit <number>', 'Limit number of transactions')
  .option('--offset <number>', 'Offset for pagination')
  .option('--unpaid', 'Filter unpaid transactions')
  .option('--unpaid_outgoing', 'Filter unpaid outgoing transactions')
  .option('--unpaid_incoming', 'Filter unpaid incoming transactions')
  .option('--type <type>', 'Transaction type: incoming or outgoing')
  .action(async (opts) => {
    if (!client) return console.log('Please login first.');
    const req = {};
    if (opts.from) req.from = parseInt(opts.from);
    if (opts.until) req.until = parseInt(opts.until);
    if (opts.limit) req.limit = parseInt(opts.limit);
    if (opts.offset) req.offset = parseInt(opts.offset);
    if (opts.unpaid) req.unpaid = true;
    if (opts.unpaid_outgoing) req.unpaid_outgoing = true;
    if (opts.unpaid_incoming) req.unpaid_incoming = true;
    if (opts.type) req.type = opts.type;
    try {
      const txs = await client.listTransactions(req);
      console.log('Transactions:', txs);
    } catch (err) {
      console.error('Error listing transactions:', err.message);
    }
  });



program
  .command('keysend')
  .description('Send keysend payment')
  .argument('<pubkey>', 'Destination pubkey')
  .option('--amount <msat>', 'Amount in millisatoshis')
  .option('--amount_sat <sat>', 'Amount in satoshis (overrides msat)')
  .option('--preimage <hex>', 'Optional preimage in hex')
  .option('--tlv_records <json>', 'Optional TLV records as JSON array [{type:number,value:string}]')
  .action(async (pubkey, opts) => {
    if (!client) return console.log('Please login first.');
    let amountMsat = opts.amount;
    if (opts.amount_sat) amountMsat = parseInt(opts.amount_sat) * 1000;
    if (!amountMsat) return console.log('Please provide --amount or --amount_sat');
    const req = { pubkey, amount: amountMsat };
    if (opts.preimage) req.preimage = opts.preimage;
    if (opts.tlv_records) {
      try {
        req.tlv_records = JSON.parse(opts.tlv_records);
      } catch {
        console.error('Invalid JSON for tlv_records');
        return;
      }
    }
    try {
      const result = await client.payKeysend(req);
      console.log('Keysend result:', result);
    } catch (err) {
      console.error('Error sending keysend:', err.message);
    }
  });


program
  .command('sign_message')
  .description('Sign a message')
  .argument('<message>', 'Message to sign')
  .action(async (message) => {
    if (!client) return console.log('Please login first.');
    try {
      const result = await client.signMessage({ message });
      console.log('Signature:', result);
    } catch (err) {
      console.error('Error signing message:', err.message);
    }
  });


program
  .command('lookup_invoice')
  .description('Lookup an invoice')
  .option('--payment_hash <hash>', 'Payment hash')
  .option('--invoice <bolt11>', 'BOLT11 invoice string')
  .action(async (opts) => {
    if (!client) return console.log('Please login first.');
    const req = {};
    if (opts.payment_hash) req.payment_hash = opts.payment_hash;
    if (opts.invoice) req.invoice = opts.invoice;
    if (!req.payment_hash && !req.invoice) {
      console.error('Please provide at least --payment_hash or --invoice');
      return;
    }
    try {
      const result = await client.lookupInvoice(req);
      console.log('Invoice lookup result:', result);
    } catch (err) {
      console.error('Error looking up invoice:', err.message);
    }
  });

program
  .command('get_budget')
  .description('Get wallet budget info')
  .action(async () => {
    if (!client) return console.log('Please login first.');
    try {
      const result = await client.getBudget();
      console.log('Budget info:', result);
    } catch (err) {
      console.error('Error getting budget info:', err.message);
    }
  });

program
  .command('get_wallet_service_info')
  .description('Get wallet service info')
  .action(async () => {
    if (!client) return console.log('Please login first.');
    try {
      const result = await client.getWalletServiceInfo();
      console.log('Wallet service info:', result);
    } catch (err) {
      console.error('Error getting wallet service info:', err.message);
    }
  });

program
  .command('subscribe')
  .description('Subscribe to wallet notifications')
  .option('--types <types>', 'Comma-separated list of notification types to subscribe to (e.g., payment_received,payment_sent)')
  .action(async (opts) => {
    if (!client) {
      console.log('Please login first.');
      return;
    }

    unsubscribe?.();

    let notificationTypes;
    if (opts.types) {
      notificationTypes = opts.types.split(',').map(s => s.trim());
    }

    console.log('Subscribing to wallet notifications. Press "q" to stop subscription.');

    
    try {
      unsubscribe = await client.subscribeNotifications(
        (notification) => {
          console.log('Received notification:', notification);
        },
        notificationTypes
      );
    } catch (err) {
      console.error('Failed to subscribe:', err.message);
      return;
    }
  });

program
  .command('unsubscribe')
  .description('Unsubscribe from wallet notifications')
  .action(() => {
    if (unsubscribe) {
      unsubscribe();
      console.log("unsubscribed");
      unsubscribe = undefined;
    } else {
      console.log("not subscribed")
    }
  });

program
  .command('get_pubkey')
  .description('Get client public key')
  .action(async () => {
    if (!client) return console.log('Please login first.');
    try {
      const pubkey = await client.getPublicKey();
      console.log('Client pubkey:', pubkey);
    } catch (err) {
      console.error('Error getting pubkey:', err.message);
    }
  });

// If no command-line args, launch REPL
if (process.argv.length <= 2) {
  startRepl();
} else {
  (async () => {
    await program.parseAsync(process.argv);
    process.exit(0);
  })();
}