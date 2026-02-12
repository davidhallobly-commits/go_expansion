# GoExpansion CRM - Setup & Deployment Guide

## Project Overview

GoExpansion CRM is a commercial real estate management system built with React, TypeScript, Supabase, and Tailwind CSS. It enables commercial real estate companies to manage contacts, properties, deals, customers, and tasks with a modern, responsive interface.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **State Management**: React Context API
- **Routing**: React Router v6

## Prerequisites

Before setting up the project, ensure you have:

- Node.js 16+ and npm/yarn installed
- A Supabase project account (free at https://supabase.com)
- Git for version control
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Phase 1: Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up or log in
2. Click "New Project"
3. Enter project details:
   - **Name**: GoExpansion CRM
   - **Database Password**: Create a strong password and save it
   - **Region**: Choose closest to your location
4. Wait for project to initialize (2-3 minutes)

### Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them for environment setup):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Key** (public key for frontend)

### Step 3: Create Storage Bucket

1. Go to **Storage** in the sidebar
2. Create a new bucket named `attachments`
3. Set it to **Public** (so files can be downloaded publicly)
4. Leave CORS configured (Supabase defaults are fine)

### Step 4: Run Database Migrations

1. Go to **SQL Editor** in Supabase
2. Create a new query
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it
4. Create another new query
5. Copy the contents of `supabase/migrations/002_rls_policies.sql` and run it
6. (Optional) Create another query and run `supabase/seed.sql` for sample data

**Note**: If you can't access SQL files, here's what the migrations do:
- **001_initial_schema.sql**: Creates 9 tables (users, contacts, properties, deals, deal_customers, customers, tasks, attachments, audit_logs) with proper relationships
- **002_rls_policies.sql**: Sets up Row Level Security policies for admin/sales_rep/viewer roles
- **seed.sql**: Populates with sample customers and properties

## Phase 2: Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase URL and anon key from Phase 1, Step 2.

### Step 3: Verify Setup

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You should see the GoExpansion CRM login page.

## Phase 3: Initial User Setup

### Create Admin User

1. On the login page, click "Sign Up"
2. Enter credentials:
   - **Email**: admin@goexpansion.com (or your email)
   - **Password**: Create a strong password
3. Submit the form
4. You'll be logged in automatically

**Note**: First user is automatically created. You can create additional users by:
1. Logging in as the first user
2. Sharing the login page URL with team members
3. They can sign up with their own email

### Set User Roles (Admin Only)

1. In Supabase, go to **SQL Editor**
2. Run this query to set your user as admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@goexpansion.com';
```

Available roles:
- `admin` - Full access to all features and all users' data
- `sales_rep` - Can create/edit own records and shared deals
- `viewer` - Read-only access to all data

## Phase 4: Local Development

### Run Development Server

```bash
cd frontend
npm run dev
```

Server will run at http://localhost:5173 with hot module reloading.

### Build for Production

```bash
npm run build
```

Creates optimized build in `frontend/dist/` directory.

### Run Tests (if applicable)

```bash
npm run test
```

### Lint Code

```bash
npm run lint
```

## Testing Checklist

### Authentication Testing
- [ ] Sign up with new email/password
- [ ] Login with valid credentials
- [ ] Logout redirects to login page
- [ ] Verify session persists on page reload
- [ ] Invalid login shows error message
- [ ] Already logged-in user can't access /login

### Dashboard Testing
- [ ] Dashboard loads with all cards visible
- [ ] Top stats cards display correctly:
  - Total Deals count
  - Pipeline Value in thousands
  - Win Rate percentage
  - Active Tasks count
- [ ] Pipeline breakdown shows correct counts for each status
- [ ] Task status summary displays pending/in_progress/completed/overdue
- [ ] Quick stats show: Total Contacts, Due This Week, Avg Deal Size
- [ ] Top Customers card shows top 3 by value
- [ ] Recent Deals feed shows last 5 deals created/modified
- [ ] Recent Tasks feed shows last 5 tasks
- [ ] Quick Action buttons navigate to correct pages

### Contacts Management
- [ ] List displays all contacts
- [ ] Search filters by first/last name or email
- [ ] Create new contact form works
- [ ] All fields save correctly (name, email, phone, company, address, notes)
- [ ] Edit contact updates data
- [ ] Delete contact removes from list
- [ ] Created by/date fields are populated automatically

### Properties Management
- [ ] List displays all properties
- [ ] Search filters by address, city, state
- [ ] Create new property form works
- [ ] Property type dropdown has options (commercial_space, office, retail, etc.)
- [ ] Square footage formats with commas
- [ ] Asking price formats with dollar sign and commas
- [ ] Edit and delete work correctly

### Customers Management
- [ ] List displays all customers
- [ ] Search filters by company name or contact person
- [ ] Create new customer works
- [ ] All fields save correctly
- [ ] Sample customers appear (bürgermeister, newsoul, lap coffee, beat81)

### Deals Management
- [ ] List displays all deals
- [ ] Search filters by address, contact name, or deal value
- [ ] Status filter shows only selected status
- [ ] Pipeline summary cards show count and total value per status
- [ ] Create new deal form works
- [ ] Can select property and source contact
- [ ] Deal value, status, and expected close date save
- [ ] Deal status badge colors: blue (prospect), yellow (negotiating), green (won), red (lost)
- [ ] Edit deal works
- [ ] Delete deal works with confirmation

### Deal-Customer Assignment (Many-to-Many)
- [ ] Click "Customers" button on deal opens modal
- [ ] Modal shows all assigned customers with their offered date
- [ ] Modal shows customer status dropdown (interested/negotiating/accepted/rejected/expired)
- [ ] Can add new customer from dropdown (shows only unassigned customers)
- [ ] Duplicate customer validation prevents adding same customer twice
- [ ] Status changes update without page reload
- [ ] Remove button unassigns customer from deal
- [ ] Modal closes and deal refreshes after assigning/removing customers

### Tasks Management
- [ ] List displays all tasks
- [ ] Columns visible: Title, Assigned To, Status, Due Date, Actions
- [ ] Search filters by task title
- [ ] Filter by status (pending/in_progress/completed) works
- [ ] Color-coded status badges
- [ ] Create new task form works
- [ ] Can assign to team members (dropdown)
- [ ] Can link task to deal/contact/customer
- [ ] Due date picker works
- [ ] Edit and delete work correctly
- [ ] Overdue tasks display with red highlighting

### File Attachments
- [ ] Deals page shows attachment upload section on each deal
- [ ] Drag-and-drop upload works
- [ ] File selection with file picker works
- [ ] Files upload to Supabase Storage
- [ ] Attachment list displays uploaded files
- [ ] File type icons show correctly (PDF, Word, Excel, images)
- [ ] File size displays correctly (formatted as Bytes/KB/MB)
- [ ] Download button generates valid download link
- [ ] Delete button removes file from storage and database
- [ ] Properties page also has attachment upload
- [ ] File size validation (10MB max) works

### Role-Based Access Control (RBAC)

**Admin User:**
- [ ] Can see all records
- [ ] Can create records
- [ ] Can edit all records (own and others')
- [ ] Can delete records
- [ ] Can access all pages

**Sales Rep User:**
- [ ] Can see all records
- [ ] Can create own records
- [ ] Can edit own created records
- [ ] Can edit shared deals (RLS allows viewing, but deletion blocked for others' records)
- [ ] Cannot delete other sales reps' records

**Viewer User:**
- [ ] Can see all records (read-only)
- [ ] Cannot create records
- [ ] Cannot edit records
- [ ] Cannot delete records
- [ ] View-only buttons on all pages

### Mobile Responsiveness
- [ ] Pages display correctly on mobile (320px width)
- [ ] Navigation switches to hamburger menu on mobile
- [ ] All forms are readable and usable on mobile
- [ ] Tables/lists adapt to mobile layout
- [ ] Buttons are clickable (min 44px height)
- [ ] No horizontal scrolling on mobile
- [ ] Modals display properly on mobile

### Performance & Error Handling
- [ ] Pages load within 2-3 seconds
- [ ] Loading spinners display while fetching data
- [ ] Error messages display for failed operations
- [ ] Network errors show appropriate error messages
- [ ] Form validation prevents invalid submissions
- [ ] Duplicate entries handled gracefully
- [ ] Large datasets paginate or virtualize correctly

## Deployment to Vercel (Recommended)

### Step 1: Prepare GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: GoExpansion CRM"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/go_expansion.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Select your `go_expansion` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy"

Vercel will automatically deploy on every push to `main`.

### Step 3: Configure Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., crm.goexpansion.com)
3. Follow DNS setup instructions from your domain registrar

## Deployment to Netlify (Alternative)

1. Go to https://netlify.com and sign up
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variables under "Build & deploy" → "Environment"
6. Deploy

## Deployment to Docker (Optional)

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:

```bash
docker build -t goexpansion-crm .
docker run -p 3000:3000 goexpansion-crm
```

## Monitoring & Maintenance

### Monitor Supabase Usage

1. In Supabase, go to **Reports** → **API Usage**
2. Monitor requests per day
3. Check database storage usage

### View Real-Time Logs

1. Go to **Logs** in Supabase
2. View recent queries and authentications
3. Check for errors

### Backup Database

Supabase includes automatic daily backups. To export manually:
1. Go to **Database** → **Backups**
2. Click "Request backup"
3. Wait for completion and download

## Troubleshooting

### Login Issues

**Problem**: "Invalid credentials" error on valid password
- Clear browser cookies for the site
- Check that user exists in Supabase Auth
- Verify email address is correct

**Problem**: Session expires immediately
- Check if Supabase URL and anon key are correct in `.env.local`
- Verify browser allows localStorage and cookies

### File Upload Issues

**Problem**: Upload fails with permission denied
- Check that `attachments` storage bucket is set to Public
- Verify user has write permissions (check RLS policies)

**Problem**: File appears uploaded but not visible in list
- Refresh the page
- Check browser console for errors
- Verify file actually uploaded in Supabase Storage

### Database Issues

**Problem**: Tables don't exist after migration
- Verify migrations ran without errors in SQL Editor
- Check for error messages in the output
- Re-run migration from scratch if needed

**Problem**: RLS policies blocking access
- Check user role is set to `admin` for full access
- Verify RLS policies are enabled in Database settings
- Run sample data tests with admin account first

### Performance Issues

**Problem**: Slow load times
- Check network tab in browser dev tools
- Verify Supabase API response times (Supabase dashboard)
- Consider adding React Query for better caching

**Problem**: Memory leaks
- Check for cleanup in useEffect hooks
- Verify no infinite loops in dependencies
- Profile with React DevTools

## Next Steps

1. **User Training**: Prepare documentation for end users
2. **Custom Branding**: Update logo and colors in Navigation.tsx
3. **Additional Features**:
   - Email notifications for tasks
   - Document templates for deals
   - Advanced reporting and analytics
   - Mobile app version
4. **Security Hardening**:
   - Set up 2FA for admin users
   - Configure backup policies
   - Implement audit logging
5. **Performance Optimization**:
   - Set up CDN for static assets
   - Implement caching strategies
   - Monitor database query performance

## Support & Resources

- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev

## License

This project is proprietary software for GoExpansion. Unauthorized copying or distribution is prohibited.

## Version History

- **v1.0.0** (2026-02-12): Initial release with core CRM functionality
  - Authentication system
  - Contact, property, customer, deal, and task management
  - Deal-customer many-to-many relationships
  - File attachment support
  - Role-based access control
  - Analytics dashboard
  - Responsive UI with Tailwind CSS
