# Portfolio Platform

A production-grade full-stack developer portfolio built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Clerk Auth**, and **Resend Email**.

## 🚀 Features

### Public Pages

- **Landing Page** — Animated hero section with typing effect, tech stack showcase, featured projects
- **About** — Bio, skills matrix, current focus, downloadable resume
- **Projects** — Filterable project grid with tech stack filters, detail pages with architecture breakdowns
- **Blog** — Markdown-based blog with tag filtering, syntax highlighting
- **Contact** — Validated form with direct email delivery via Resend API
- **Dark Mode** — Toggle between light/dark themes, persisted in localStorage

### Admin Dashboard

- **Authentication** — Secure admin login via **Clerk** (email, social, OAuth)
- **Projects CRUD** — Create, edit, delete projects with featured toggle
- **Blog CRUD** — Create, edit, delete posts with tags, slugs, publish status
- **Contacts** — View all contact form submissions with timestamps
- **Analytics** — Page views, project clicks, engagement metrics

### Technical Features

- **Clerk Authentication** — Production-grade auth with email/password + social providers
- **Resend Email** — Direct API integration, no middleman
- **InSForge Backend** — Database models for Projects, Blogs, Contacts, Analytics
- **SEO Optimized** — Meta tags, Open Graph, sitemap-ready
- **Responsive Design** — Mobile-first, works on all devices
- **Type-Safe** — Full TypeScript coverage
- **Performance** — Lighthouse-optimized, lazy loading, code splitting

## 🏗 Architecture

```
Frontend (Next.js 14)
     │
     ├─── Clerk Middleware → /admin route protection
     ├─── /api/contact ───→ Resend API (direct)
     └─── REST API Calls ──→ InSForge (database)
```

## 📦 Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend       | Next.js 14 (App Router) |
| Styling        | Tailwind CSS            |
| Animations     | Framer Motion           |
| Markdown       | React Markdown          |
| Authentication | Clerk                   |
| Email          | Resend                  |
| Backend        | InSForge (BaaS)         |
| Validation     | Zod                     |
| Icons          | React Icons             |
| Deployment     | Vercel                  |

## 🛠 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Clerk](https://dashboard.clerk.com/) account (for authentication)
- [InSForge](https://insforge.dev/) account (for database)
- [Resend](https://resend.com/) account (for email)

### Installation

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # InSForge Configuration
   NEXT_PUBLIC_INSFORGE_URL=https://your-project.insforge.app
   INSFORGE_ANON_KEY=your-insforge-anon-key

   # Resend Email
   RESEND_API_KEY=re_your_api_key_here

   # Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up Clerk**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy your publishable and secret keys to `.env.local`
   - Configure sign-in methods (email/password, Google, GitHub, etc.)

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── about/             # About page
│   ├── projects/          # Projects listing + detail pages
│   ├── blog/              # Blog listing + post pages
│   ├── contact/           # Contact form
│   ├── sign-in/           # Clerk sign-in (catch-all route)
│   ├── admin/             # Admin dashboard (protected by Clerk)
│   │   ├── page.tsx       # Admin entry (redirects)
│   │   └── dashboard/     # Full CRUD dashboard
│   ├── api/               # API routes
│   │   ├── contact/       # Contact → Resend email
│   │   └── analytics/     # Event tracking
│   ├── layout.tsx         # Root layout with ClerkProvider + ThemeProvider
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── Navbar.tsx         # Navigation with Clerk UserButton
│   ├── Footer.tsx
│   └── admin/
│       └── Modal.tsx      # Reusable modal for forms
├── context/               # React contexts
│   └── ThemeContext.tsx
├── lib/                   # Utilities and API clients
│   ├── insforge.ts        # InSForge database API
│   ├── analytics.ts       # Analytics tracking
│   └── constants.ts       # App constants, sample data
├── types/                 # TypeScript type definitions
│   └── index.ts
└── middleware.ts          # Clerk route protection
```

## 🔐 Clerk Setup

### 1. Create Clerk Application

1. Sign up at [Clerk](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key** to `.env.local`

### 2. Configure Sign-In Methods

In Clerk Dashboard → User & Authentication:

- Email address + password
- Google, GitHub, or other social providers (optional)

### 3. How Admin Access Works

- Click **Admin** in the navbar
- If not signed in → redirected to `/sign-in`
- After sign-in → redirected to `/admin/dashboard`
- Sign out via `UserButton` in navbar or dashboard header

## 🗄 InSForge Setup

### 1. Create InSForge Project

1. Sign up at [InSForge](https://insforge.dev/)
2. Create a new project
3. Note your API URL and anon key

### 2. Define Data Models

**Projects Model:**

```json
{
  "title": "string",
  "description": "string",
  "techStack": ["string"],
  "githubUrl": "string",
  "liveUrl": "string",
  "featured": "boolean",
  "createdAt": "timestamp"
}
```

**Blogs Model:**

```json
{
  "title": "string",
  "slug": "string",
  "content": "markdown",
  "excerpt": "string",
  "tags": ["string"],
  "coverImage": "string",
  "published": "boolean",
  "createdAt": "timestamp"
}
```

**Contacts Model:**

```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "createdAt": "timestamp"
}
```

**Analytics Model:**

```json
{
  "eventType": "string",
  "page": "string",
  "metadata": "object",
  "createdAt": "timestamp"
}
```

## 📧 Email Setup (Resend)

### 1. Create Resend Account

1. Sign up at [Resend](https://resend.com/)
2. Copy your API key to `.env.local`

### 2. How It Works

- User fills out contact form at `/contact`
- Form validates → POST `/api/contact`
- Route handler calls Resend API directly
- Email delivered to `shankhadeepmondal7@gmail.com` (update the recipient in `src/app/api/contact/route.ts`)

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel deploy --prod
```

Or connect your GitHub repo to Vercel for automatic deployments. Make sure to add all environment variables in Vercel settings.

## 📝 Customization

### Update Personal Info

Edit `src/lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Your Name",
  title: "Your Tagline",
  description: "Your Description",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "your.email@example.com",
  },
};
```

### Update Skills

```typescript
export const SKILLS = [
  { name: "React/Next.js", level: "expert", category: "frontend" },
  // Add your skills...
];
```

### Change Email Recipient

Edit `src/app/api/contact/route.ts`:

```typescript
to: ["your-email@gmail.com"],  // ← Change this
```

### Add Projects

Use the admin dashboard or update `src/lib/constants.ts` for initial sample data.

## 🎨 Design System

### Colors

- Primary: Sky blue (`#0ea5e9`)
- Dark scale: Slate (`#0f172a` to `#f8fafc`)

### Typography

- Sans: Inter
- Mono: Fira Code

### Components

- Cards with subtle borders and shadows
- Gradient text for headings
- Smooth animations with Framer Motion

## 🔒 Security

- Clerk handles all authentication (JWT, sessions, CSRF protection)
- Environment variables for sensitive data
- API route validation with Zod
- Protected admin routes via Clerk middleware
- Input sanitization

## 📊 Performance

- ✅ Lighthouse score > 90
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Static generation where possible

## 🐛 Troubleshooting

### Build fails

- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Clerk 404 on /sign-in

- Ensure the route is a catch-all: `src/app/sign-in/[[...rest]]/page.tsx`
- Verify Clerk keys in `.env.local`

### Clerk development key warning

- The warning "Clerk has been loaded with development keys" is normal in local dev
- Switches to production keys when deployed with production keys

### Email not sending

- Verify `RESEND_API_KEY` in `.env.local`
- Check Resend dashboard for delivery logs
- Check spam folder

### Theme not working

- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

## 📄 License

MIT

## 🤝 Contributing

This is a personal portfolio template. Feel free to fork and customize.

## 📧 Support

For questions or issues, open an issue on GitHub.

---

**Built with ❤️ using Next.js, Tailwind CSS, Clerk, Resend, and InSForge**
