"use client"

import { useState } from "react"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
      try {
          await login(email, password)
          window.location.href="/"
        } catch (err) {
            setError(err.message)
            alert("Login failed: " + err.message)
        }
    }
    console.log(email,password)

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        onChange={e=> setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
