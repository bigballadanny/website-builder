# Pocket Marketer Website Builder

AI-powered website builder designed specifically for marketing agencies. Build stunning, conversion-optimized websites through natural conversation.

## ✨ Features

- **Conversational Building** — Describe what you want, watch it appear in real-time
- **Live Preview** — See changes instantly as the AI builds your site
- **Marketing-Focused Templates** — Pre-built sections for landing pages, lead gen, portfolios
- **Color Scheme System** — One-click professional color palettes
- **Component Library** — Hero sections, testimonials, CTAs, pricing tables, and more
- **Export Ready** — Download clean HTML/CSS or deploy directly
- **WebContainer Runtime** — Full development environment in your browser

## 🛠 Tech Stack

- **Framework:** [Remix](https://remix.run/) + React
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [UnoCSS](https://unocss.dev/)
- **Runtime:** [WebContainer](https://webcontainers.io/) (StackBlitz)
- **AI:** Multi-provider support (OpenAI, Anthropic, Google, etc.)
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/bigballadanny/website-builder.git
cd website-builder

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Add your API keys to .env.local
# Required: At least one AI provider (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to start building.

## 📁 Project Structure

```
├── app/
│   ├── components/     # React components
│   │   ├── chat/       # Chat interface
│   │   ├── pm/         # Pocket Marketer specific
│   │   ├── ui/         # Shared UI components
│   │   └── workbench/  # Code editor & preview
│   ├── lib/
│   │   ├── pm/         # PM-specific utilities
│   │   ├── runtime/    # Action runner & parser
│   │   └── stores/     # State management
│   └── routes/         # Remix routes & API
├── public/             # Static assets
└── scripts/            # Build scripts
```

## 🎨 Usage

1. **Start a conversation** — "Build me a landing page for a dental clinic"
2. **Refine the design** — "Make the hero section taller with a blue gradient"
3. **Add sections** — "Add a testimonials carousel and pricing table"
4. **Adjust colors** — Use the color scheme picker or ask "Make it more modern with dark mode"
5. **Export** — Download the files or deploy to your hosting

## 🔑 Environment Variables

Create `.env.local` with your API keys:

```env
# AI Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
```

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built on top of [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) by StackBlitz Labs.

---

**Pocket Marketer** — Making website building as easy as having a conversation.
