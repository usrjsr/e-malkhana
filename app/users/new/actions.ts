"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function createUser(formData: {
  username: string;
  password: string;
  role: string;
  officerId: string;
  policeStation: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  if ((session.user as any)?.role !== "ADMIN") {
    throw new Error("Only admins can create users");
  }

  await dbConnect();

  const existing = await User.findOne({ username: formData.username });
  if (existing) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(formData.password, 10);

  const newUser = new User({
    username: formData.username,
    passwordHash,
    role: formData.role,
    officerId: formData.officerId,
    policeStation: formData.policeStation,
  });

  await newUser.save();
  return { success: true };
}
