# Coinflip

This was created using VSCode Cline plugin using deepseek via OpenRouter.

[See the prompt](./prompt.txt)

To install open the app folder, then run:

```bash
  npm i
```

To run: (make sure to update your NWC url)

```bash
  NWC_URL="nostr+walletconnect://..." npm start
```

This required a few back & forward

- The AI got mixed up between NWCClient and NostrWebLNProvider in Alby JS SDK and got the description (defaultMemo) parameter wrong when generating an invoice (documentation could be improved here)

- The AI figure out express typescript issues due to writing v4 code but installing v5

- The AI installed the wrong version of websocket-polyfill
