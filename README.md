#  portfolio website

portfolio website built with next.js and tailwind css, featuring smooth animations with a clean design :)

## 📋 features

- dark/light mode
- smooth page transitions
- dynamic project showcase
- database-driven content management
- interactive ui elements
- animated components
- responsive design

## 🛠️ technologies used

- next.js - react framework
- tailwind css - styling
- framer-motion - animations
- lucide-react - icons
- typescript - type safety
- prisma - database orm
- mongodb - database

## 📥 installation

ensure you have node.js installed on your system.

1. clone or download the repository
2. set up environment variables:
   - create a `.env` file in the root directory
   - add `DATABASE_URL` for your mongodb connection
   - add `ADMIN_CODE` for admin authentication
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
├── data/             # data files and models
├── lib/              # utility functions
└── scripts/          # utility scripts
prisma/               # database schema (at root level)
```

## 💾 data management

projects are stored in mongodb and managed through prisma orm:

```
model Project {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  content     String
  technologies String[]
  githubUrl   String?
  createdAt   DateTime @default(now())
  files       File[]
}
```

## 🔐 admin authentication

this project includes an admin authentication system that protects administrative functions:

set the `ADMIN_CODE` environment variable with a secure password

the admin authentication is used for content management operations like creating or updating projects.

## 🔧 production deployment

this portfolio is production-ready and can be deployed to platforms like vercel or netlify:

1. connect your repository to your preferred hosting platform
2. configure all required environment variables in the hosting platform
   - `DATABASE_URL` for mongodb connection
   - `ADMIN_CODE` for admin authentication
3. deploy the application

for optimal performance, ensure your mongodb instance is properly configured and accessible from your hosting environment.