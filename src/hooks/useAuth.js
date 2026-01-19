"use client"

import { authLib } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"

import { useEffect, useState } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(authLib, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { user, loading }
}
