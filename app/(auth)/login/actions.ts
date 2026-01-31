"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function loginUser(credentials: { username: string; password: string }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })

  if (!res.ok) {
    throw new Error("Invalid username or password")
  }

  
  const setCookieHeader = res.headers.get("set-cookie")
  
  if (setCookieHeader) {
    const cookieStore = await cookies()
    
    
    const cookieParts = setCookieHeader.split(";")
    const tokenPart = cookieParts[0].trim() 
    
    if (tokenPart.startsWith("token=")) {
      const tokenValue = tokenPart.substring(6) 
      
      if (tokenValue) {
        cookieStore.set("token", tokenValue, {
          httpOnly: true,
          sameSite: "lax",
          path: "/"
        })
      }
    }
  }

  redirect("/dashboard")
}
