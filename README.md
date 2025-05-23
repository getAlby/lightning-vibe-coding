# Lightning Vibe Coding

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Example prompts to add Bitcoin Lightning payments to your app with vibe coding, that you can adapt to your needs. Adding bitcoin lightning payments can be easy!

## Getting Started

- A [NWC](https://nwc.dev)-enabled lightning wallet. Get one in minutes by connecting to [Alby Hub](https://albyhub.com/), [coinos](https://coinos.io/apps/new), [Primal](https://primal.net/downloads), [lnwallet.app](https://lnwallet.app/), [Yakihonne](https://yakihonne.com/), [or other NWC-enabled wallets](https://github.com/getAlby/awesome-nwc?tab=readme-ov-file#nwc-wallets).
- Online agent editor ([Genspark.ai](https://www.genspark.ai/) - frontend apps only), or local agent code editor (Windsurf/Cursor) or VS Code agent plugin (Cline/Roo code with a configured LLM provider)
- Copy and paste one of the example prompts below and adapt it to your needs.

## Example Prompts

### Single HTML page

- Paywall Confetti (Shows confetti after successful payment) - [Deepseek](html/paywall-confetti/deepseek-chat-v3-0324:free/README.md) - [Gemini](html/paywall-confetti/gemini-2.5-pro-exp-03-025/README.md)
  - Features: Bitcoin Connect, Lightning Tools
- Endless Runner game (Pay to continue playing after player dies) - [Deepseek](html/endless-runner-game/deepseek-chat-v3-0324:free/README.md)  - [Gemini](html/endless-runner-game/gemini-2.5-pro-exp-03-025/README.md)
  - Features: Bitcoin Connect, Lightning Tools
- Snake game (Pay to continue playing after player dies) - [Genspark.ai](html/snake-game/genspark.ai/README.md)
  - Features: Bitcoin Connect, Lightning Tools
- Nostr TODO app - [Gemini](https://github.com/rolznz/todostr)
  - Features: Nostr Zaps, window.nostr and window.webln

### React app

- 2048 game with paid undo - [Replit Agent](react/2048/replit/README.md)
  - Features: Bitcoin Connect, Lightning Tools

### Express app

- Coinflip game (Pay 10 sats but earn 20 if you guess correctly) - [Deepseek](express/coinflip/deepseek-chat-v3-0324:free/README.md)
  - Features: Nostr Wallet Connect, Bitcoin Connect

### NodeJS app

- NWC CLI (connect a wallet and interact with it via CLI) - [Quasar Alpha](node/nwc-cli/quasar-alpha/README.md)
  - Features: Nostr Wallet Connect, Nostr Wallet Auth

## How it works

Currently most LLMs have trouble with getting up-to-date info which can cause them to "guess" how payments should be implemented. So, we can work around this by one of the following:

- downloading the NPM package and asking them to read it (e.g. `install @getalby/sdk@4.1.0 and then read the package to understand how the NWCClient works`)
- asking the LLM to fetch the README and read it first (e.g. `fetch https://raw.githubusercontent.com/getAlby/js-sdk/refs/heads/master/README.md`)
- ask it to read the latest esm.sh e.g. (`fetch https://esm.sh/@getalby/sdk@4.1.0/es2022/sdk.mjs`)

### Agent / LLM Options

1. **Cline + PPQ.ai + Claude 3.7**
   - Get API key from [PPQ.ai](https://ppq.ai/api-docs)
   - Top up with Lightning payments
2. **Cline + Google Gemini 2.5 Pro**
   - Access via [Google AI Studio](https://aistudio.google.com/)
   - Limited free queries, pro plan with Credit card
3. **Cline + Deepseek Chat v3 Free**
   - Available on [OpenRouter](https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free)
   - Free (limited use)
4. **Roo Code + Quasar Alpha**
   - Available on [OpenRouter](https://openrouter.ai/openrouter/quasar-alpha)
   - Free (limited use)
5. **Cline + Claude 3.7**
   - Get API key from [Anthropic Console](https://console.anthropic.com/)
   - Top up with Credit card (No free plan)
6. **Other Editors**
   - [Cursor](https://cursor.com) (Limited free queries, pro plan with credit card)
   - [Windsurf](https://windsurf.com/editor) (Limited free queries, pro plan with credit card)
   - [Genspark.ai](https://genspark.ai) (Web app, Limited free credits, paid plan with credit card. NOTE: only works to make client-side apps)
   - [Replit Agent v2](https://replit.com) (Web app, Limited free credits, paid plan with credit card NOTE: currently it is does not work well and makes many bugs)
   - [VSCode Copilot](https://code.visualstudio.com/docs/copilot/overview) (Limited free credits, paid plan with credit card)
   - [Lovable.dev](https://lovable.dev/) (Limited free credits, paid plan with credit card. NOTE: cannot do requests to fetch README content, you must paste it into the prompt. Can do full stack apps using Supabase integration)
   - [Firebase studio](https://studio.firebase.google.com/) NOTE: seems to not work well currently, needs more testing

## Contributing

### Contributing Example Prompts

Pull requests welcome! Please ensure that you follow the current directories as examples:

- put in a folder like `environment`/`demo-short-description`/`model-name` where `environment` can be `html` or `react` or `express` or `nextjs` etc. `demo-short-description` should hint and what the demo is about, and `model-name` should be the exact model name of the LLM.
- All prompts are refined and work with one-shot commands unless specified
- Include clear README instructions on what tools were used to execute the prompt, how to view the output, and prompt.txt for each implementation

### Contributing LLM/Agent options

Please include ones that you have tested that work OK, and include whether they are free or not and how they can be paid

### Need an Idea or want an idea built?

- create an app that uses nostr for identity
- create an app that uses nostr relays for simple backend storage
- create autonomous ai agents performing machine to machine payments using lightning
- create a lightning lotto app where each satoshi paid increases the time before the winner is drawn
- create an app like [github star history](https://github.com/star-history) but for V4V payments
- create an AI workflow triggered by a received payment using an NWC receive-only connection
- create an in-game store where users can buy vanity items with lightning
- create a lightning prism app powered by NWC
- build an MCP server that requires payments (such as a Stacker news client), that can be paid by [nwc-mcp-server](https://github.com/getalby/nwc-mcp-server)
- build an N8N workflow for an AI zapvertising agent
- build an N8N NWC node
- build a vibe coding platform centered around Bitcoin and Nostr
- build an anonymous app hosting platform paid for with a single lightning payment
- Build an app that can summarize github repositories (or multiple repositories) into a single-pager that you can feed to AI to consume.
- Build the same app with a new agent software or LLM. It's cool to see what works and what doesn't!
- Submit your ideas here and maybe someone else will build them!

## License

[MIT](LICENSE)
