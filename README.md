# modern portfolio website

a modern, responsive portfolio website built with next.js and tailwind css, featuring smooth animations and a clean design.

## 📋 features

- responsive design
- dark/light mode
- smooth page transitions
- dynamic project showcase
- github integration
- contact form
- interactive ui elements
- animated components
- seo optimized

## 🛠️ technologies used

- next.js - react framework
- tailwind css - styling
- framer-motion - animations
- lucide-react - icons
- typescript - type safety
- github api - project data
- react-hook-form - form handling
- nodemailer - email handling

## 📥 installation

ensure you have node.js installed on your system.

clone the repository:

```bash
git clone https://github.com/0sum-git/portfolio
```

install dependencies:

```bash
npm install
```

## 🚀 how to run

development mode:

```bash
npm run dev
```

build for production:

```bash
npm run build
```

start production server:

```bash
npm start
```

## 📝 project structure

```
src/
├── app/              # app router pages
├── components/       # react components
├── lib/             # utility functions
├── styles/          # global styles
└── types/           # typescript types
```

## 💾 data management

projects are fetched from github api and stored in a structured format:

```typescript
interface project {
  name: string;
  description: string;
  stars: number;
  language: string;
  topics: string[];
  updated_at: string;
}
```

## 🎨 design features

- minimalistic design
- smooth transitions
- interactive cards
- responsive layout
- custom animations
- consistent typography
- accessible color scheme
