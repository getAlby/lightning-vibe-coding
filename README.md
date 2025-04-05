# Lightning Vibe Coding

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Example prompts to add Bitcoin Lightning payments to your app with vibe coding, that you can adapt to your needs. Adding bitcoin lightning payments can be easy!

## Getting Started

### Prerequisites

- AI code editor (Windsurf/Cursor) or VS Code plugin (Cline/Roo code with a configured LLM provider)
- Copy and paste one of the example prompts below and adapt it to your needs.

## Example Prompts

### Single HTML page

- Paywall Confetti (Shows confetti after successful payment) - [Deepseek](html/paywall-confetti/deepseek-chat-v3-0324:free/README.md) - [Gemini](html/paywall-confetti/gemini-2.5-pro/README.md)

## How it works

Currently most LLMs have trouble with getting up-to-date info which can cause them to "guess" how payments should be implemented. So, we work around this by asking the LLM to fetch the README and read it first.

### LLM Options

1. **Cline + PPQ.ai + Claude 3.7**
   - Get API key from [PPQ.ai](https://ppq.ai/api-docs)
   - Top up with Lightning payments
2. **Cline + Google Gemini 2.5 Pro**
   - Access via [Google AI Studio](https://aistudio.google.com/)
   - Limited free queries, pro plan with Credit card
3. **Cline + Deepseek Chat v3 Free**
   - Available on [OpenRouter](https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free)
   - Free (limited use)
4. **Cline + Claude 3.7**
   - Get API key from [Anthropic Console](https://console.anthropic.com/)
   - Top up with Credit card (No free plan)
5. **Other Editors**
   - [Cursor](https://cursor.com) (Limited free queries, pro plan with credit card)
   - [Windsurf](https://windsurf.com/editor) (Limited free queries, pro plan with credit card)

## Contributing

### Contributing Example Prompts

Pull requests welcome! Please ensure that you follow the current directories as examples:

- put in a folder like `environment`/`demo-short-description`/`model-name` where `environment` can be `html` or `react` or `nodejs` or `nextjs` etc. `demo-short-description` should hint and what the demo is about, and `model-name` should be the exact model name of the LLM.
- All prompts are refined and work with one-shot commands
- Include clear README instructions on what tools were used to execute the prompt, how to view the output, and prompt.txt for each implementation

### Contributing LLM options

Please include ones that you have tested that work OK, and include whether they are free or not and how they can be paid

## License

[MIT](LICENSE)
