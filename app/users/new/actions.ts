"use server"

import dbConnect from "@/lib/db"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function createUser(formData: {
  username: string
  password: string
  role: string
  officerId: string
  policeStation: string
}) {
  const token = (await cookies()).get("token")?.value
  if (!token) {
    throw new Error("Unauthorized")
  }

  const payload = verifyToken(token)
  if (payload.role !== "ADMIN") {
    throw new Error("Only admins can create users")
  }

  await dbConnect()

  const existing = await User.findOne({ username: formData.username })
  if (existing) {
    throw new Error("Username already exists")
  }

  const passwordHash = await bcrypt.hash(formData.password, 10)

  const newUser = new User({
    username: formData.username,
    passwordHash,
    role: formData.role,
    officerId: formData.officerId,
    policeStation: formData.policeStation
  })

  await newUser.save()
  return { success: true }
}
