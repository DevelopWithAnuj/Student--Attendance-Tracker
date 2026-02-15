# Student Attendance Tracker

## Overview
A comprehensive web application designed to efficiently manage student data and track attendance. Built with Next.js, this application provides features for student registration, attendance marking, and insightful dashboards.

## Features
- **Student Management**: Add, edit, and delete student records.
- **Attendance Tracking**: Mark and view student attendance.
- **Dashboard**: Visualize attendance data and key metrics (e.g., using charts).
- **User Authentication**: Secure access provided by KindeAuth.
- **Responsive Design**: Accessible on various devices.

## Technologies Used
- **Frontend**:
    - [Next.js](https://nextjs.org/) (React Framework)
    - [Tailwind CSS](https://tailwindcss.com/) (Styling)
    - [shadcn/ui](https://ui.shadcn.com/) (UI Components)
    - [Ag-Grid](https://www.ag-grid.com/) (Data Grids)
    - [Recharts](https://recharts.org/en-US/) (Charting Library)
    - [React Hook Form](https://react-hook-form.com/) (Form Management)
    - [Sonner](https://sonner.emilkowal.ski/) (Toasts)
    - [Lucide React](https://lucide.dev/) (Icons)
- **Backend**:
    - [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
    - [Drizzle ORM](https://orm.drizzle.team/) (TypeScript ORM for SQL)
    - [PostgreSQL](https://www.postgresql.org/) (Database)
- **Authentication**:
    - [KindeAuth](https://kinde.com/) (Authentication as a Service)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn/pnpm/bun
*   PostgreSQL database

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url] # Replace with your actual repository URL
    cd student-attendance-tracker
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    # or bun install
    ```
3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root of your project and add the following environment variables. Replace the placeholder values with your actual credentials.

    ```env
    # KindeAuth Configuration
    KINDE_CLIENT_ID=your_kinde_client_id
    KINDE_CLIENT_SECRET=your_kinde_client_secret
    KINDE_ISSUER_URL=https://your_kinde_domain.kinde.com
    KINDE_SITE_URL=http://localhost:3000
    KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
    KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

    # PostgreSQL Database Configuration (for Drizzle ORM)
    DATABASE_URL="postgresql://user:password@host:port/database"
    # Example: postgresql://postgres:password@localhost:5432/attendance_tracker_db
    ```
    *   **KindeAuth**: You will need to set up an application on [Kinde](https://kinde.com/) to get your `KINDE_CLIENT_ID`, `KINDE_CLIENT_SECRET`, and `KINDE_ISSUER_URL`. Make sure to configure `KINDE_SITE_URL`, `KINDE_POST_LOGOUT_REDIRECT_URL`, and `KINDE_POST_LOGIN_REDIRECT_URL` appropriately in your Kinde application settings as well.
    *   **PostgreSQL**: Ensure your `DATABASE_URL` points to your PostgreSQL instance.

4.  **Run Database Migrations**:
    Apply your Drizzle migrations to set up the database schema.
    ```bash
    npx drizzle-kit push:pg
    ```
    *(Note: This command is based on common Drizzle setup. Refer to `drizzle.config.js` and `package.json` for exact commands if this doesn't work.)*

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the file.

### Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.