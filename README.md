# MILQSHAKE

**MILQSHAKE** (Mining Lexicons in Quality SHAred corpora for Knowledge Extraction) is a research-oriented web platform for extracting targeted bilingual and multilingual lexicons from large-scale parallel corpora.  

It was designed specifically to support **low-resource and digitally disadvantaged languages**, leveraging datasets such as **Meta’s NLLB (No Language Left Behind)** and other open-source corpora.  

You can view the live system at **[milqshake.com](https://milqshake.com)**.  

---

## Features

- 📚 **Parallel Corpus Mining** – Extract specific vocabulary (months, days, technical terms, etc.) from aligned bilingual data.  
- 🔍 **Customizable Extraction** – Configure term lists and focus languages for tailored lexicon building.  
- 🌍 **Multilingual Support** – Works across major and low-resource languages.  
- 📊 **Evaluation Dashboard** – Track exact, variant, fuzzy, and incorrect matches across test sets.  
- ⚡ **Next.js + Vercel Stack** – Modern frontend with fast deployment and serverless support.  
- 🎨 **Tailwind Styling** – Clean, responsive UI with easy customization.  

---

## Getting Started

### Prerequisites

Make sure you have one of the following installed:

- [Node.js](https://nodejs.org/) (>=18)  
- npm, yarn, pnpm, or bun as your package manager  

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/milqshake.git
cd milqshake
npm install
# or
yarn install
```

---

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to see the app.
You can start editing the main page by modifying app/page.js. The app supports hot reloading, so changes appear instantly.

---

### Project Structure

```
milqshake/
├── app/               # Next.js app directory
│   ├── page.js        # Main landing page
│   ├── layout.js      # Global layout wrapper
│   └── api/           # API routes (lexicon extraction endpoints)
├── components/        # Reusable UI components
├── lib/               # Utility functions (NLP helpers, evaluation scripts)
├── public/            # Static assets
├── styles/            # Tailwind + global styles
├── README.md
└── package.json
```

---

### Environment Variables

Some features (e.g., GPT-based extraction or corpus uploads) may require environment variables. Create a .env.local file in the root directory:

```
OPENAI_API_KEY=your_api_key
```
⚠️ Never commit .env.local to version control.

---

### Testing

Run unit tests (if configured):

```bash
npm run test
```
```bash
Run lint checks:
```
```bash
npm run lint
```

---

### Deployment

The easiest way to deploy MILQSHAKE is via Vercel:
1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the repo into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Deploy!
For more details, see Next.js deployment docs.

---

### Learn More

Next.js Documentation – Official Next.js features and API reference.
Learn Next.js – Interactive Next.js tutorial.
Vercel Docs – Deployment and hosting details.

---

### Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a new feature branch (git checkout -b feature/my-feature)
3. Commit your changes (git commit -m "Add my feature")
4. Push the branch (git push origin feature/my-feature)
5. Open a Pull Request
Please follow our coding style (Tailwind + JavaScript best practices) and ensure tests/linting pass before submitting.

---

### License
MILQSHAKE is released under the MIT License.
Feel free to use, modify, and distribute with attribution.

---

### Acknowledgments
Developed in collaboration with Stanford SILICON and the Unicode Consortium.
Uses Meta’s NLLB dataset alongside open-source corpora for multilingual evaluation.
Built on Next.js and Tailwind CSS.