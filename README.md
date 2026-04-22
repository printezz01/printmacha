# PrintMacha — Premium 3D Printed Art & Decor

Production-grade ecommerce platform for PrintMacha, a 3D print products brand serving the Indian market.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Payments**: Cashfree
- **Analytics**: Google Analytics 4
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cashfree account (for payments)
- Google Analytics 4 property (for tracking)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/printmacha01-dotcom/printmacha01.git
   cd printmacha01
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required values in `.env.local`.

4. **Database setup**
   - Create a new Supabase project
   - Go to SQL Editor and run:
     1. `supabase/schema.sql` — Creates all tables, indexes, RLS policies, functions
     2. `supabase/seed.sql` — Inserts sample products, categories, reviews, coupons

5. **Create admin user**
   - Create a user in Supabase Auth (email/password)
   - Update their profile role to 'admin':
     ```sql
     UPDATE user_profiles SET role = 'admin' WHERE user_id = 'YOUR_USER_UUID';
     ```

6. **Supabase Storage**
   - Create a `product-images` bucket (public)
   - Create a `custom-uploads` bucket (private)

7. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

8. **Production build**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── app/
│   ├── (store)/           # Public storefront (route group)
│   │   ├── page.tsx       # Home
│   │   ├── shop/          # Shop all products
│   │   ├── category/      # Category pages
│   │   ├── product/       # Product detail
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   ├── wishlist/       # Wishlist
│   │   ├── search/         # Search
│   │   ├── account/        # Customer account
│   │   ├── login/          # Customer login
│   │   ├── signup/         # Customer signup
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── faq/            # FAQ
│   │   ├── policies/       # Shipping, returns, privacy, terms
│   │   └── inquiry/        # Bulk/custom orders
│   ├── admin/
│   │   ├── login/          # Admin login
│   │   └── (dashboard)/    # Protected admin routes
│   │       ├── page.tsx    # Dashboard
│   │       ├── products/   # Product CRUD
│   │       ├── categories/ # Category management
│   │       ├── orders/     # Order management
│   │       ├── customers/  # Customer list
│   │       ├── reviews/    # Review moderation
│   │       ├── coupons/    # Coupon management
│   │       ├── content/    # Homepage content
│   │       └── settings/   # Store settings
│   ├── api/
│   │   ├── checkout/       # Order creation
│   │   ├── payment/verify/ # Payment verification
│   │   └── webhooks/       # Cashfree webhooks
│   └── not-found.tsx       # 404 page
├── components/
│   └── store/
│       ├── ProductCard.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── cashfree/           # Cashfree integration
│   ├── analytics/          # GA4 tracking
│   ├── utils.ts            # Utility functions
│   └── sample-data.ts      # Demo data
├── types/
│   └── database.ts         # TypeScript types
└── middleware.ts            # Route protection
```

## Features

### Public Storefront
- Premium home page with hero, categories, best sellers, new arrivals, value props, testimonials
- Shop page with filters and sorting
- Category browsing
- Product detail with variants, reviews, related products
- Search with popular terms
- Cart with coupon codes
- Guest + authenticated checkout
- Wishlist
- Account management (orders, addresses, profile)
- Order tracking
- Contact form
- Bulk/custom inquiry form
- FAQ page
- Policy pages (shipping, returns, privacy, terms)
- WhatsApp floating support button
- Mobile-first responsive design

### Admin Dashboard
- Stats overview (revenue, orders, products, customers)
- Product CRUD with all fields
- Category management
- Order management with tracking updates
- Customer list
- Review moderation
- Coupon management
- Homepage content management
- Store settings

### Security
- Middleware-based route protection for admin and account pages
- Server-side admin role verification
- Row Level Security (RLS) on all database tables
- Server-side payment creation and verification
- Webhook signature verification
- Service role key never exposed to client

### Integrations
- Cashfree payment gateway (prepaid + COD)
- Google Analytics 4 with full ecommerce tracking
- WhatsApp support with contextual messages
- Supabase Auth with OTP flow

## Database

Full relational schema with 17 tables:
- `user_profiles`, `addresses`
- `categories`, `products`, `product_images`, `product_variants`
- `carts`, `cart_items`, `wishlist_items`
- `reviews`
- `orders`, `order_items`, `payments`
- `coupons`, `coupon_usages`
- `homepage_sections`, `site_settings`, `custom_inquiries`

All tables have:
- UUID primary keys
- Proper indexes
- Foreign keys with cascading
- `created_at` / `updated_at` timestamps
- RLS policies
- Auto-updating `updated_at` triggers

## Environment Variables

See `.env.example` for all required variables.

## Design System

- **Brand Colors**: Orange (#E8722A) + Black + Warm Neutrals
- **Typography**: Outfit (headings) + Inter (body)
- **Theme**: Light mode, warm off-white surfaces
- **Style**: Premium-minimal, crafted, modern

## TODO / Intentionally Stubbed

### Requires Credentials
- [ ] Supabase connection (add real project URL + keys)
- [ ] Cashfree payment processing (add real API credentials)
- [ ] GA4 tracking (add Measurement ID)
- [ ] WhatsApp number (update to real business number)

### Future Implementation
- [ ] Full Supabase data fetching (currently uses sample data)
- [ ] Cart/wishlist state management with context/store
- [ ] Real-time stock validation
- [ ] Actual OTP auth flow (Supabase Phone Auth)
- [ ] Image upload to Supabase Storage
- [ ] Email notifications (Resend/SMTP)
- [ ] Custom order workflow
- [ ] GST/invoice generation
- [ ] Sitemap generation
- [ ] Structured data (JSON-LD)
- [ ] Admin mobile responsive sidebar
- [ ] Pagination for product lists
- [ ] Advanced search with filters

## License

Private — All rights reserved by PrintMacha.
