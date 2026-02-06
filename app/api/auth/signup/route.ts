import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional()
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { email, password, name } = parsed.data

  // Check existing user
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 409 })

  // Hash password
  const { hash } = await import("bcrypt")
  const hashed = await hash(password, 10)

  const user = await prisma.user.create({ data: { email, password: hashed, name } })

  return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
}