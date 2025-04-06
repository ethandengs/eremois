import * as fs from "fs-extra";
import * as path from "node:path";

const DOCS_DIR = path.resolve(__dirname, "../../docs");

const CONFIG_FILE = `
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "erēmois",
  description: "AI self-adaptive time managing APP",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Architecture', link: '/architecture/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Timeline', link: '/guide/timeline' },
            { text: 'Tasks', link: '/guide/tasks' },
            { text: 'AI Assistant', link: '/guide/ai-assistant' }
          ]
        }
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Frontend', link: '/architecture/frontend' },
            { text: 'Backend', link: '/architecture/backend' },
            { text: 'AI Integration', link: '/architecture/ai-integration' }
          ]
        }
      ]
    }
  }
})
`;

const INDEX_MD = `
---
layout: home

hero:
  name: erēmois
  text: AI self-adaptive time managing APP
  tagline: Empower your time management with AI
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/eremois

features:
  - icon: ⏰
    title: Smart Timeline
    details: Intelligent circular timeline with adaptive scheduling
  - icon: 🤖
    title: AI Assistant
    details: Self-learning AI that adapts to your preferences
  - icon: 📋
    title: Task Management
    details: Efficient organization of events, tasks, and projects
---
`;

async function setupDocs() {
  try {
    // Create docs directory structure
    const docsDirs = ["guide", "api", "architecture", ".vitepress"];

    for (const dir of docsDirs) {
      await fs.ensureDir(path.join(DOCS_DIR, dir));
    }

    // Create VitePress config
    await fs.writeFile(
      path.join(DOCS_DIR, ".vitepress/config.ts"),
      CONFIG_FILE
    );

    // Create index page
    await fs.writeFile(path.join(DOCS_DIR, "index.md"), INDEX_MD);

    // Create initial documentation files
    await createInitialDocs();

    console.log("Documentation system set up successfully!");
  } catch (error) {
    console.error("Error setting up documentation:", error);
    process.exit(1);
  }
}

async function createInitialDocs() {
  const docs = {
    "guide/quick-start.md": `
# Quick Start

## Prerequisites
- Node.js 16 or higher
- npm or yarn

## Installation

\`\`\`bash
git clone https://github.com/yourusername/eremois.git
cd eremois
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`
    `,
    "architecture/overview.md": `
# Architecture Overview

erēmois is built with a modern, scalable architecture:

- Frontend: Next.js with TypeScript
- Backend: Node.js with Express
- AI: TensorFlow.js for intelligent scheduling
- Database: MongoDB for flexible data storage
    `,
  };

  for (const [file, content] of Object.entries(docs)) {
    await fs.writeFile(path.join(DOCS_DIR, file), content);
  }
}

setupDocs();
