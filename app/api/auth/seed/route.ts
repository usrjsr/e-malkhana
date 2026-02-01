import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  await dbConnect();

  const existing = await User.countDocuments();
  

  const passwordHash = await bcrypt.hash("admin123", 10);

  await User.create({
    username: "admin",
    passwordHash,
    role: "ADMIN",
    officerId: "ADMIN001",
    policeStation: "HEADQUARTERS",
  });

  return NextResponse.json({ success: true });
}
