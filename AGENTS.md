# Tawha Electrical Solution — Agent Instructions

## 1. Project Overview

Tawha Electrical Solution is a full-stack business management application for an electrical services company.

The company provides electrical planning, wiring, circuit planning, lighting, installation, maintenance, and other electrical solutions for residential, commercial, industrial, restaurant, and other locations.

The application has two main areas:

* Public company website
* Private admin management system

The admin system will manage:

* Customers
* Services and service rates
* Projects
* Proposals
* Bills
* Payments
* Company/contact information
* Dashboard analytics

---

## 2. Technology

Use the latest stable versions available when development starts.

### Core

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

Use Next.js as the full-stack framework.

Prefer:

* Server Components
* Server Actions
* Route Handlers
* Server-side business logic

Do **not** create a separate Express backend.

### Database

* PostgreSQL
* Prisma ORM

PostgreSQL is preferred because the application contains strongly related business and financial data.

### Other

* Auth.js for authentication
* React Hook Form + Zod for forms and validation
* TanStack Table for complex tables
* Recharts for dashboard charts
* Server-side PDF generation for proposals and bills

---

## 3. Architecture

Keep the application modular and maintainable.

Separate:

* UI
* Business logic
* Database access
* Validation
* Calculations
* Authentication/authorization
* PDF generation

A structure similar to the following is preferred:

```text
app/
components/
lib/
prisma/
types/
public/
```

The exact structure can be improved when there is a clear architectural reason.

Prefer Server Components by default.

Use Client Components only when client-side interactivity requires them.

Avoid unnecessary:

* `useEffect`
* `useState`
* global state
* API requests
* dependencies
* abstractions

---

## 4. Database

The main business entities are:

```text
User
Customer
Service
Project
ProjectItem
Proposal
ProposalItem
Bill
Payment
CompanySettings
ActivityLog
```

Maintain proper:

* Relationships
* Foreign keys
* Indexes
* Unique constraints
* Timestamps

Use stable IDs and Prisma Decimal for monetary values.

Never use floating-point database fields for money.

---

## 5. Historical Financial Data

This is a critical business rule.

Service rates can change over time.

Changing the current service rate must **never change historical projects, proposals, or bills**.

When a service is used in a project or proposal:

* Store the applicable rate as a snapshot.
* Preserve the financial values used by generated documents.

Old financial records must remain historically accurate even after service rates change.

---

## 6. Financial Calculations

Financial calculations must be centralized and performed on the server.

Typical calculations include:

```text
Project Total
Bill Total
Payable Amount
Paid Amount
Outstanding Amount
```

Example:

```text
Total Amount = Area × Rate

Payable Amount = Total Amount × Percentage / 100
```

Never trust totals submitted by the browser.

The server must recalculate and validate financial values.

Use database transactions for payment and other important financial operations.

---

## 7. Public Website

The public website is available at:

```text
/
```

It should eventually contain:

* Navbar
* Hero
* About
* Services
* Featured Services
* Why Choose Us
* Customers/Clients
* Projects/Portfolio
* Call to Action
* Contact
* Footer

The design should look professional, trustworthy, modern, and appropriate for an electrical service company rather than a generic SaaS application.

Database-driven information should not be unnecessarily hard-coded.

---

## 8. Customers

Customers should support:

* Personal/company information
* Contact information
* Address
* Customer type
* Notes
* Related projects
* Payment history

Customer types:

```text
RESIDENTIAL
COMMERCIAL
INDUSTRIAL
RESTAURANT
OTHER
```

Admin should be able to create, view, edit, delete, search, and filter customers.

---

## 9. Services

Services should be database-driven.

Admin should be able to:

* Create services
* Edit services
* Delete services
* Change rates
* Update descriptions
* Activate/deactivate services
* Feature/unfeature services

Featured services are displayed on the public website.

---

## 10. Projects

Projects belong to customers and can contain multiple services.

A project should track information such as:

* Project number
* Name
* Description
* Customer
* Location
* Status
* Dates
* Project value
* Billing
* Payments

Project statuses:

```text
PLANNED
ONGOING
COMPLETED
CANCELLED
```

Project details should provide a financial summary including:

* Total project value
* Total billed
* Total collected
* Total outstanding

---

## 11. Proposals

Admin should be able to create proposals containing:

* Customer/recipient information
* Address
* Project information
* Services
* Quantity/area
* Rates
* Additional charges
* Discount
* Terms
* Notes

Proposals must support professional PDF generation and downloading.

Generated proposals must preserve their historical financial values.

---

## 12. Bills

Admin can generate a bill for a specific project.

Bill calculation:

```text
Total Amount = Area × Rate

Payable Amount =
Total Amount × Percentage / 100
```

Bills must preserve the values used when they were generated.

Bill statuses:

```text
DRAFT
ISSUED
PARTIALLY_PAID
PAID
CANCELLED
```

Bills should support viewing, PDF generation, and payment tracking.

---

## 13. Payments

Payments belong to bills/projects.

Track:

* Payment amount
* Payment date
* Payment method
* Reference
* Notes
* Payment history
* Total paid
* Outstanding amount

Payment methods:

```text
CASH
BANK_TRANSFER
MOBILE_BANKING
CHEQUE
OTHER
```

Do not allow invalid payments that exceed the outstanding amount unless an explicit overpayment feature is implemented.

Use database transactions.

---

## 14. Admin Dashboard

The dashboard should eventually display real database data such as:

* Total customers
* Total projects
* Ongoing projects
* Completed projects
* Total project value
* Total billed
* Total collected
* Total outstanding

Useful analytics include:

* Monthly revenue
* Projects by status
* Payment overview
* Recent activity

Do not use fake numbers in the production dashboard.

---

## 15. Company Settings

Admin should be able to manage company information such as:

* Company name
* Phone
* Email
* Address
* WhatsApp
* Facebook
* Instagram
* Google Maps URL
* Business hours

The public website should retrieve this information dynamically.

---

## 16. Authentication & Security

Use secure authentication with Auth.js.

Initially support:

```text
ADMIN
```

Design authorization so additional roles can be added later.

Admin routes and operations must be protected server-side.

Never rely only on frontend UI restrictions.

Validate user input on the server.

Never expose:

```text
DATABASE_URL
AUTH_SECRET
```

## or other private secrets to the browser.

## 17. UI Guidelines

Use shadcn/ui consistently.

The application should be:

* Professional
* Clean
* Responsive
* Accessible
* Consistent

Important pages should handle:

* Loading states
* Error states
* Empty states
* Success feedback

Destructive actions should require confirmation.

---

## 18. SEO & Performance

Use Next.js correctly.

Public pages should include appropriate:

* Metadata
* Open Graph information
* Sitemap
* robots.txt
* Semantic HTML

Optimize the public website for electrical-service-related searches.

Avoid unnecessary client-side rendering and requests.

---

## 19. Development Rules

**Never build the entire application in one uncontrolled pass.**

Build it phase by phase.

Before modifying the project:

1. Inspect the existing implementation.
2. Understand the current architecture.
3. Reuse working code.
4. Avoid unnecessary rewrites.

After every phase:

1. Run type checking.
2. Run linting.
3. Run the production build.
4. Fix all errors.
5. Verify the affected functionality.
6. Preserve previously completed functionality.

Do not automatically start the next phase.

Do not create fake implementations just to satisfy a requirement.

Do not use temporary hacks where a clean extension point is possible.

---

## 20. Code Quality

Write production-quality TypeScript.

Prefer:

* Strong typing
* Small reusable components
* Clear naming
* Reusable business logic
* Centralized validation
* Centralized calculations
* Maintainable database queries

Avoid:

* `any` without a strong reason
* Duplicate logic
* Giant components
* Giant functions
* Unnecessary dependencies
* Unnecessary abstractions
* Hard-coded database-driven information

---

## 21. Final Principle

Make implementation decisions as a senior full-stack engineer would for a real business application.

Prioritize:

1. Correctness
2. Data integrity
3. Security
4. Maintainability
5. Performance
6. User experience

When requirements are ambiguous, choose the solution that is scalable and appropriate for a real production business application.

Do not silently remove or simplify important business requirements.
