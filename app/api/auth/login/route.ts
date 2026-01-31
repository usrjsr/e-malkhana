import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { signToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  await dbConnect()

  const body = await req.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }

  const user = await User.findOne({ username })

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
    officerId: user.officerId
  })

  const response = NextResponse.json({ success: true })

  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  })

  return response
}
