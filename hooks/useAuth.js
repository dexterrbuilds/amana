import { useState, useEffect } from "react"
import { auth } from "../lib/firebase"

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return user
}

