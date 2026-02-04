# Seeding the database ✅

This project includes a small seed script that creates a test user for local development.

Prerequisites
- Ensure you have Node.js and the project dependencies installed: `npm install`
- Create a `.env` file with your database connection:

  DATABASE_URL="postgresql://user:pass@host:port/dbname"

- Install required packages if not already installed:

  npm i bcrypt pg

Quick seed for local development

- Run migrations and seed in one command:

  npm run seed:dev

- Alternatively run them separately:

  npx prisma migrate dev --name init
  npm run seed

Notes
- The seed creates a test user: `test@test.com` with password `1234` (stored hashed).
- The `.env` file is ignored by Git; do not commit secret credentials.

If you want, I can add a `npm run seed:ci` script for CI-friendly seeding using a SQLite DB.