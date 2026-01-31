import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  await dbConnect()

  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const {
    username,
    password,
    role,
    officerId,
    policeStation
  } = body

  if (
    !username ||
    !password ||
    !role ||
    !officerId ||
    !policeStation
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const existing = await User.findOne({ username })
  if (existing) {
    return NextResponse.json({ error: "User exists" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await User.create({
    username,
    passwordHash,
    role,
    officerId,
    policeStation
  })

  return NextResponse.json({ success: true })
}
