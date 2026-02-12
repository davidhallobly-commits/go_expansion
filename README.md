# GoExpansion CRM System

A modern Commercial Real Estate CRM system built with React, TypeScript, and Supabase. Designed for GoExpansion to manage contacts, properties, deals, and tasks efficiently.

## Features

- **Contact Management**: Track and manage commercial real estate contacts/brokers
- **Property Management**: Store and organize commercial properties and listings
- **Deal Pipeline**: Manage deals and track them through the sales pipeline (prospect → negotiating → won/lost)
- **Customer Relations**: Manage client companies and track which deals are offered to which customers
- **Task Management**: Create, assign, and track tasks linked to deals, contacts, or customers
- **File Attachments**: Upload and store property documents, contracts, and photos
- **Role-Based Access Control**: Admin, Sales Rep, and Viewer roles with appropriate permissions
- **Real-Time Updates**: Supabase-powered real-time database subscriptions
- **Analytics Dashboard**: View pipeline metrics, deal values, and team performance

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **API Client**: Supabase JavaScript SDK
- **Hosting**: Vercel/Netlify (frontend), Supabase (backend)

## Project Structure

```
go_expansion/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Deals, Contacts, etc.)
│   │   ├── services/        # Supabase client and database queries
│   │   ├── context/         # Auth context and state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component with routing
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles with Tailwind CSS
│   ├── .env                 # Local environment variables (not committed)
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── supabase/                # Supabase configuration and migrations
│   ├── migrations/          # SQL migration files
│   │   ├── 001_initial_schema.sql    # Database tables and indexes
│   │   └── 002_rls_policies.sql      # Row Level Security policies
│   └── seed.sql            # Sample data for testing
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free at https://supabase.com)

### 1. Set Up Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. In the Supabase dashboard:
   - Go to **SQL Editor**
   - Create a new query and copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the query
   - Create another query with `supabase/migrations/002_rls_policies.sql`
   - Run the query
   - Create another query with `supabase/seed.sql`
   - Run the query

4. Note your Supabase credentials:
   - Project URL: Found in Settings → General → Project URL
   - Anon Key: Found in Settings → API → Project API keys → anon (public)

### 2. Set Up Frontend

```bash
cd frontend
npm install

# Create .env file with your Supabase credentials
cp .env.example .env

# Edit .env and add your Supabase URL and anon key
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create First Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Create User**
3. Enter an email and password
4. Copy the user ID
5. Go to **SQL Editor** and run:

```sql
INSERT INTO users (id, email, first_name, last_name, role) VALUES
('YOUR_USER_ID_HERE', 'your-email@example.com', 'Admin', 'User', 'admin');
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Login with the admin user credentials you created.

## Usage

### Dashboard
- View pipeline summary with deal counts and values
- See quick stats for contacts, properties, and tasks

### Managing Contacts
- Add new contacts/brokers who source properties
- Store contact details and notes
- Filter and search contacts

### Managing Properties
- Add commercial properties available for sale or lease
- Specify property type, size, and asking price
- Attach documents and photos

### Managing Deals
- Create deals linking properties to source contacts
- Track deal status through the pipeline (prospect → negotiating → won/lost)
- Assign deals to multiple customers
- Set deal values and expected close dates

### Customer Relations
- Manage client companies (bürgermeister, newsoul, lap coffee, beat81, etc.)
- Track which deals are offered to which customers
- Monitor customer status for each deal (interested → negotiating → accepted/rejected)

### Task Management
- Create tasks linked to deals, contacts, or customers
- Assign tasks to team members
- Set due dates and track status
- Filter tasks by priority and due date

### File Attachments
- Upload documents, contracts, and photos to deals and properties
- Attach files to properties for easy access

## User Roles

### Admin
- Full access to all records
- Can manage users and assign roles
- Can view all audit logs

### Sales Rep (Default)
- Can create and edit own records
- Can view all company records
- Can create and manage deals and tasks
- Can assign tasks to other team members

### Viewer
- Read-only access to all records
- Cannot create, edit, or delete anything
- Can only view pipeline and analytics

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

### TypeScript Types

All database entities have TypeScript types defined in `src/types/database.ts`. The types are automatically enforced by the API client.

### Database Queries

Common database operations are available in `src/services/database.ts`:
- `getContacts()`, `createContact()`, `updateContact()`, `deleteContact()`
- `getProperties()`, `createProperty()`, etc.
- `getDeals()`, `createDeal()`, `updateDeal()`, etc.
- `getCustomers()`, `createCustomer()`, etc.
- `getTasks()`, `createTask()`, `updateTask()`, etc.
- `getPipelineSummary()` for analytics

## Deployment

### Frontend Deployment (Vercel - Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
5. Click Deploy

### Custom Server Deployment

```bash
# Build the frontend
npm run build

# Serve the dist folder on your server
# The dist folder contains the static React app
```

### Database Security

- All tables have Row Level Security (RLS) enabled
- Users can only access appropriate records based on their role
- Database policies are defined in `supabase/migrations/002_rls_policies.sql`
- Never expose your Supabase service_role_key in the frontend

## Environment Variables

```
VITE_SUPABASE_URL=        # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=   # Your Supabase anon key (safe to expose)
VITE_APP_NAME=            # Application name (default: "GoExpansion CRM")
```

## API Reference

### Supabase Tables

**users**: Team members with roles (admin, sales_rep, viewer)
- id, email, first_name, last_name, role, created_at

**contacts**: Property source brokers/contacts
- id, first_name, last_name, email, phone, company, address, city, state, zip, notes, created_by, created_at, updated_at

**properties**: Commercial real estate listings
- id, address, city, state, zip, property_type, square_footage, price_ask, description, created_by, created_at, updated_at

**deals**: Deal instances linking properties to customers
- id, property_id, source_contact_id, deal_value, deal_status, expected_close_date, notes, created_by, created_at, updated_at

**deal_customers**: Many-to-many relationship between deals and customers
- id, deal_id, customer_id, offered_date, customer_status

**customers**: Client companies
- id, company_name, contact_person, email, phone, address, city, state, zip, created_at, updated_at

**tasks**: Follow-up tasks and activities
- id, title, description, assigned_to, deal_id, contact_id, customer_id, due_date, status, created_by, created_at, updated_at

**attachments**: Files attached to deals and properties
- id, file_name, file_path, file_type, size, deal_id, property_id, uploaded_by, created_at

## Troubleshooting

### "Missing Supabase environment variables"
- Check that .env file exists in the frontend directory
- Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Variables must start with VITE_ to be accessible in the frontend

### RLS policy errors
- Ensure your user exists in the `users` table with a valid role
- Check that the user ID matches the auth user ID in Supabase
- Row Level Security policies might be blocking your access

### Cannot connect to Supabase
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure you have internet connectivity

## Contributing

When adding new features:
1. Create migrations for any database schema changes
2. Define TypeScript types in `src/types/database.ts`
3. Add database query functions in `src/services/database.ts`
4. Create React components in `src/components/`
5. Create pages in `src/pages/`

## License

This project is proprietary to GoExpansion.

## Support

For issues or questions, contact your development team.
