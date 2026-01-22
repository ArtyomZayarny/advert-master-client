# AdvertMaster Client

Modern classified ads platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Redux Toolkit + React Query
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
advert-master-client/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components
│   ├── pages/       # Page components
│   ├── category/    # Category components
│   └── advert/      # Advert components
├── lib/             # Utilities and configurations
│   ├── api/         # API clients
│   └── store/       # Redux store
└── public/          # Static assets
```

## Features

- ✅ Modern minimalistic design
- ✅ Responsive layout
- ✅ Category browsing
- ✅ Ad search and filtering
- ✅ User authentication
- ✅ Favorites management
- ✅ Multi-language support (planned)

## License

Private
