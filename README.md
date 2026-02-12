# GoExpansion CRM System

A modern commercial real estate customer relationship management (CRM) system built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

- **Contact Management**: Track property brokers, agents, and sources with detailed information
- **Property Management**: Catalog commercial real estate listings with details (address, type, square footage, asking price)
- **Deal Pipeline**: Track commercial real estate deals through stages (prospect → negotiating → won/lost)
- **Customer Management**: Manage client companies and their information
- **Deal-Customer Assignment**: Offer same deal to multiple customers and track their status (interested → negotiating → accepted/rejected/expired)
- **Task Management**: Create and assign follow-up tasks linked to deals, contacts, or customers
- **File Attachments**: Upload property documents, deal files, and other attachments to Supabase Storage
- **Analytics Dashboard**: View pipeline metrics, win rates, task summaries, and team performance
- **Role-Based Access Control**: Admin, Sales Rep, and Viewer roles with different permission levels
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| State Management | React Context API |
| Routing | React Router v6 |

## Project Structure

```
go_expansion/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Deals, etc.)
│   │   ├── services/        # Supabase database queries
│   │   ├── context/         # React Context (Auth)
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main app component
│   ├── index.html           # HTML entry point
│   ├── package.json         # Dependencies and scripts
│   └── vite.config.ts       # Vite configuration
├── supabase/                # Database migrations
│   ├── migrations/          # SQL migration files
│   └── seed.sql            # Sample data
├── SETUP_AND_DEPLOYMENT.md  # Detailed setup and deployment guide
└── README.md               # This file
```

## Quick Start

### 1. Supabase Setup
- Create project at https://supabase.com
- Copy Project URL and Anon Key from Settings → API
- Run database migrations in SQL Editor (see SETUP_AND_DEPLOYMENT.md)

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Configure Environment
Create `frontend/.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 and sign up for an account.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # Run TypeScript compiler
```

## Pages & Features

### Dashboard
- 4 top metric cards (Total Deals, Pipeline Value, Win Rate, Active Tasks)
- Pipeline breakdown by status with counts and values
- Task status summary with overdue count
- Quick stats (total contacts, due this week, avg deal size)
- Top 3 customers by total deal value
- Recent deals and tasks activity feed
- Quick action buttons

### Contacts
- List all contacts with search and filter
- Create, edit, delete contacts
- Store: name, email, phone, company, address, city, state, zip, notes

### Properties
- List commercial real estate listings
- Create, edit, delete properties
- Store: address, city, state, zip, type, square footage, asking price, description
- Upload property documents as attachments

### Customers
- Manage client companies (e.g., bürgermeister, newsoul, lap coffee, beat81)
- Create, edit, delete customer records
- Store: company name, contact person, email, phone, address, city, state, zip

### Deals
- View sales pipeline with status filtering
- Summary cards showing count and value per status
- Create, edit, delete deals
- Assign multiple customers to same deal (many-to-many)
- Track customer status independently per deal (interested → negotiating → accepted/rejected/expired)
- Upload deal documents as attachments
- Link to property and source contact

### Tasks
- List all tasks with columns: title, assigned to, status, due date
- Filter by status, assignee, or date range
- Search tasks by title
- Create, edit, delete tasks
- Assign to team members
- Link to deal, contact, or customer
- Color-coded status badges
- Overdue task highlighting

## Authentication & Roles

### Roles
- **Admin**: Full access to all features and all users' data
- **Sales Rep**: Can create/view all records, but can only edit own records
- **Viewer**: Read-only access to all records

### How It Works
- Authentication via Supabase Auth (email/password)
- Roles enforced at database level with Row Level Security (RLS)
- Session persists automatically in browser

## Database Schema

The system includes 9 PostgreSQL tables:

| Table | Purpose |
|-------|---------|
| users | Team members and their roles |
| contacts | Property brokers and deal sources |
| properties | Commercial real estate listings |
| deals | Specific deal instances |
| deal_customers | Many-to-many relationship between deals and customers |
| customers | Client companies |
| tasks | Follow-up tasks and assignments |
| attachments | Uploaded files metadata |
| audit_logs | Activity logs for compliance |

See `supabase/migrations/` for full schema definitions.

## File Attachments

The system supports uploading files (documents, images, spreadsheets) to deals and properties:
- Drag-and-drop upload interface
- 10MB file size limit
- File type icons (PDF, Word, Excel, images, etc.)
- Download and delete functionality
- Files stored in Supabase Storage
- Metadata tracked in database

## Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables
4. Auto-deploys on push to main

### Option 2: Netlify
Similar process - connect GitHub repo, set env vars, auto-deploys.

### Option 3: Docker
Dockerfile provided for containerized deployment.

See **SETUP_AND_DEPLOYMENT.md** for detailed deployment instructions.

## Testing

Comprehensive testing checklist provided in SETUP_AND_DEPLOYMENT.md:
- Authentication tests
- Dashboard functionality
- CRUD operations for all entities
- Deal-customer assignment
- File attachments
- Role-based access control
- Mobile responsiveness
- Performance and error handling

## Troubleshooting

See the **Troubleshooting** section in SETUP_AND_DEPLOYMENT.md for solutions to common issues:
- Login and session problems
- File upload issues
- Database migration errors
- RLS policy problems
- Performance issues

## Future Enhancements

- Email notifications for tasks and deals
- Advanced reporting and data visualization
- Document templates for deals
- CRM integrations (Slack, email)
- Mobile app version
- Two-factor authentication (2FA)
- Email verification for new users

## License

Proprietary software for GoExpansion. Unauthorized copying or distribution is prohibited.

## Support

For setup help, refer to SETUP_AND_DEPLOYMENT.md which includes:
- Phase-by-phase setup instructions
- Environment configuration
- Testing checklist
- Deployment guides
- Troubleshooting section
- Monitoring and maintenance
- Support links and resources

---

**Version 1.0.0** | Created Feb 2026 | GoExpansion CRM
