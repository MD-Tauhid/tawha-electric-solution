# Tawha Electrical Solution — Development Prompts

This document contains the prompts to give the coding agent
phase by phase.

---

# PHASE 1 — Foundation

Read AGENTS.md first.

Build PHASE 1 ONLY.

Tasks:

1. Inspect the current repository.
2. Set up the Next.js application structure.
3. Configure TypeScript.
4. Configure Tailwind CSS.
5. Configure shadcn/ui.
6. Configure Lucide React.
7. Configure Prisma.
8. Configure PostgreSQL environment variables.
9. Create the initial Prisma schema.
10. Create the initial migration.
11. Create the basic application folder structure.
12. Create basic public layout.
13. Create basic admin layout foundation.
14. Create .env.example.
15. Configure ESLint and formatting if required.

Do NOT implement:

- Authentication
- Customer CRUD
- Service CRUD
- Projects
- Proposals
- Bills
- Payments
- Dashboard analytics
- Complete public landing page

After implementation:

- Run typecheck.
- Run lint.
- Run production build.
- Fix all errors.

Do not start Phase 2.

---

# PHASE 2 — Authentication

Read AGENTS.md first.

Inspect the existing Phase 1 implementation.

Implement authentication and authorization.

Tasks:

1. Configure Auth.js.
2. Create User model if not already implemented.
3. Create admin authentication.
4. Create login page.
5. Protect /admin routes.
6. Protect admin server actions/API routes.
7. Implement logout.
8. Handle unauthenticated users.
9. Handle unauthorized users.
10. Add secure password handling if credentials authentication
   is implemented.

Do not implement customer/project/billing features yet.

After implementation:

- Run typecheck.
- Run lint.
- Run production build.
- Fix all errors.

Do not start Phase 3.

---

# PHASE 3 — Admin Foundation

Read AGENTS.md first.

Build the admin dashboard foundation.

Implement:

- Admin sidebar
- Admin navbar
- User menu
- Breadcrumbs where useful
- Dashboard shell
- Responsive mobile navigation
- Page loading states
- Error states
- Empty states
- Confirmation dialog system
- Toast/notification system

Do not implement business CRUD yet.

Run typecheck, lint, and build.

Do not start Phase 4.

---

# PHASE 4 — Customers and Services

Read AGENTS.md first.

Implement customer and service management.

Customers:

- List
- Create
- View
- Edit
- Delete
- Search
- Filter
- Pagination

Services:

- List
- Create
- Edit
- Delete
- Change rate
- Enable/disable
- Featured/unfeatured

Use:

- React Hook Form
- Zod
- Server-side validation
- Prisma

Make sure service rate changes do not modify historical
project/proposal/bill values.

Run typecheck, lint, and build.

Do not start Phase 5.

---

# PHASE 5 — Projects

Read AGENTS.md first.

Implement project management.

Project features:

- Create project
- Select customer
- Add project items/services
- Store applicable service rate
- Area/quantity
- Calculate project value
- Project status
- Start date
- Expected completion date
- Actual completion date
- Notes
- Project details page
- Edit project
- Project item management

Historical rates MUST be preserved.

Run typecheck, lint, and build.

Do not start Phase 6.

---

# PHASE 6 — Proposals

Read AGENTS.md first.

Implement proposal management.

Admin must be able to:

- Create proposal
- Select customer
- Enter To section
- Enter address
- Add proposal items
- Enter rates
- Enter quantities/areas
- Add additional charges
- Add discount
- Add terms
- Save proposal
- View proposal
- Edit proposal
- Generate/download PDF

Proposal PDFs must preserve the values stored when the proposal
was created.

Run typecheck, lint, and build.

Do not start Phase 7.

---

# PHASE 7 — Bills

Read AGENTS.md first.

Implement bill generation for projects.

Bill generation must support:

- Running project
- Area
- Rate
- Percentage to pay
- Total amount
- Payable amount

Formula:

Total Amount = Area × Rate

Payable Amount = Total Amount × Percentage / 100

Example:

Area = 5000
Rate = 120
Percentage = 30

Total Amount = 600000
Payable Amount = 180000

Calculations must happen on the server.

The generated bill must preserve the values used at generation time.

Implement:

- Bill creation
- Bill list
- Bill details
- Bill status
- Bill PDF/download if applicable

Run typecheck, lint, and build.

Do not start Phase 8.

---

# PHASE 8 — Payments

Read AGENTS.md first.

Implement payment management.

Admin must be able to:

- Record payment
- Select bill/project
- Enter payment amount
- Select payment method
- Enter payment date
- Enter reference
- Add notes
- View payment history
- View total paid
- View outstanding amount

Use database transactions.

Prevent invalid overpayments.

Automatically determine bill payment status:

DRAFT
ISSUED
PARTIALLY_PAID
PAID
CANCELLED

Run typecheck, lint, and build.

Do not start Phase 9.

---

# PHASE 9 — Dashboard

Read AGENTS.md first.

Build the admin dashboard analytics.

Display:

- Total customers
- Total projects
- Ongoing projects
- Completed projects
- Total project value
- Total billed
- Total collected
- Total outstanding

Add useful charts:

- Monthly revenue
- Projects by status
- Payment overview

Add recent activity.

All dashboard calculations should use server-side/database
queries.

Run typecheck, lint, and build.

Do not start Phase 10.

---

# PHASE 10 — Public Website

Read AGENTS.md first.

Build the public Tawha Electrical Solution website.

Sections:

1. Navbar
2. Hero
3. About
4. Services
5. Featured Services
6. Why Choose Us
7. Customers/Clients
8. Projects/Portfolio
9. CTA
10. Contact
11. Footer

Services and company information should come from the database
where appropriate.

Make the website:

- Professional
- Responsive
- SEO-friendly
- Accessible
- Fast

Add:

- Metadata
- Sitemap
- robots.txt
- Open Graph metadata where appropriate

Run typecheck, lint, and build.

Do not start Phase 11.

---

# PHASE 11 — Company Settings

Read AGENTS.md first.

Implement company settings.

Admin can update:

- Company name
- Phone
- Email
- Address
- WhatsApp
- Facebook
- Instagram
- Google Maps URL
- Business hours

The public website must use the updated information.

Run typecheck, lint, and build.

Do not start Phase 12.

---

# PHASE 12 — Final Review

Read AGENTS.md first.

Perform a complete production-readiness review.

Check:

- Authentication
- Authorization
- Database relationships
- Validation
- Financial calculations
- Historical rates
- Payment calculations
- Error handling
- Loading states
- Empty states
- Responsive UI
- Accessibility
- SEO
- Security
- Performance
- TypeScript
- ESLint
- Production build

Find and fix actual problems.

Do not rewrite working features without a reason.

After the review, provide:

1. Issues found
2. Issues fixed
3. Remaining issues
4. Production deployment requirements
5. Environment variables required
6. Database migration requirements
