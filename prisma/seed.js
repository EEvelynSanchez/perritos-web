/*
 Seed script for creating a test user with a hashed password.
 Usage: npm run seed
*/

// Load environment variables from .env
require('dotenv/config')

const { Client } = require('pg')
let bcrypt
try {
  bcrypt = require('bcrypt')
} catch (err) {
  console.error("Please install 'bcrypt' first: npm i bcrypt")
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('Please set DATABASE_URL in your environment (e.g., in a .env file)')
  process.exit(1)
}

const client = new Client({ connectionString: process.env.DATABASE_URL })

async function main() {
  await client.connect()

  const email = 'test@test.com'
  const plain = '1234'
  const hashed = await bcrypt.hash(plain, 10)

  const sql = `INSERT INTO "User" (email, password, name) VALUES ($1, $2, $3)
    ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name
    RETURNING id, email, name`

  const res = await client.query(sql, [email, hashed, 'Evelyn'])
  const user = res.rows[0]

  console.log('Seeded user:', { id: user.id, email: user.email, name: user.name })

  await client.end()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
