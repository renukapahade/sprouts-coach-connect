# 🏋️‍♂️ CoachConnect - Coach Booking Platform

A modern, full-stack Next.js application for booking fitness and nutrition coaches with integrated payment processing. Built with Indian coaches and cultural context in mind.

## ✨ Features

### 🎯 **Core Functionality**
- **Coach Discovery** - Browse certified fitness trainers and nutrition experts
- **Package-Based Booking** - Training packages
- **Secure Payments** - Integrated Cashfree Payment Gateway
- **User Dashboard** - Track subscriptions and package progress by Email

### 🔧 **Technical Features**
- **Next.js 14** with App Router
- **TypeScript**
- **MongoDB**
- **Zod** validation for runtime type checking
- **Tailwind CSS** with shadcn/ui components
- **Cashfree Integration** - Popular Indian payment gateway

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd coach-booking-app
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Environment Setup**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Visit `http://localhost:3000` to see the application! 🎉

## 📁 Project Structure

\`\`\`
coach-booking-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── coaches/              # Coach management
│   │   ├── users/                # User management
│   │   ├── subscriptions/        # Package bookings
│   │   ├── payments/             # Payment processing
│   │   └── admin/                # Admin utilities
│   ├── coaches/                  # Coach pages
│   ├── booking/                  # Booking flow
│   ├── dashboard/                # User dashboard
│   └── admin/                    # Admin interface
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── coach-card.tsx           # Coach display card
│   └── package-card.tsx         # Package display card
├── lib/                         # Utilities and configurations
│   ├── mongodb.ts               # Database connection
│   ├── cashfree.ts              # Payment integration
│   ├── validations.ts           # Zod schemas
│   └── api-client.ts            # API client
├── types/                       # TypeScript definitions
└── public/                      # Static assets
\`\`\`

## 🔌 API Endpoints

### **Coaches**
- `GET /api/coaches` - List coaches with filtering
- `GET /api/coaches/[id]` - Get coach details
- `POST /api/coaches` - Create new coach (admin)

### **Users**
- `POST /api/users` - Create/get user
- `GET /api/users/[email]` - Get user by email

### **Subscriptions (Package Bookings)**
- `POST /api/subscriptions` - Book a package
- `GET /api/subscriptions?userEmail=email` - Get user subscriptions
- `GET /api/subscriptions/[id]` - Get subscription details

### **Payments**
- `POST /api/payments/create-session` - Create Cashfree payment session
- `POST /api/payments/verify` - Verify payment status

### **Admin**
- `POST /api/admin/seed` - Seed database with sample data
