# EcoMeds - Pharmaceutical Circular Economy Platform

A B2B web application that redistributes near-expiry pharmaceuticals from donors to verified recipients, combating medicine waste and supporting global health initiatives aligned with UN SDGs 3 & 12.

## Features

### Donor Portal (`/donor`)
- Inventory management with expiry tracking
- Color-coded shelf-life indicators (Critical, Urgent, Eligible)
- Multi-step medication listing form
- Donation request management
- Tax benefit tracking

### Recipient Portal (`/recipient`)
- Medication search and discovery
- Urgent request engine
- Delivery confirmation system

### Impact Dashboard (`/impact`)
- Real-time sustainability metrics
- Financial value saved
- CO2 prevented
- Sustainability leaderboard

### Admin Compliance (`/admin`)
- Organization verification
- Registration review
- Compliance monitoring

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query
- **Notifications**: Sonner (toast notifications)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Supabase credentials in `.env` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_KEY`
4. Run the development server: `npm run dev`

## Database Schema

The application uses the following tables:
- `profiles` - User organizations (donors, recipients, admins)
- `medications` - Pharmaceutical inventory
- `donation_requests` - Transfer requests
- `impact_metrics` - Sustainability metrics

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT