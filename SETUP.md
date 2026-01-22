# Setup Instructions

## 1. Install Dependencies

```bash
cd advert-master-client
npm install
```

## 2. Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_MAP_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Status

✅ **Completed:**
- Next.js 15 + TypeScript setup
- Tailwind CSS configuration
- shadcn/ui components (Button, Card, Input)
- Redux Toolkit + React Query setup
- Basic layout and Header
- Homepage with categories (using lucide-react icons)
- API client configuration
- Minimalistic design system

🚧 **Next Steps:**
- Create authentication pages (Login/Register)
- Create advert listing pages
- Create advert detail page
- Add search functionality
- Add favorites functionality
- Add user profile pages

## Design Philosophy

- **Minimalistic:** Clean, simple, focused on content
- **Modern:** Latest design trends and best practices
- **Accessible:** WCAG compliant components
- **Responsive:** Mobile-first approach
- **Fast:** Optimized performance

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit
- React Query
- Lucide React (icons)
