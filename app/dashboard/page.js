"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import Navigation from "../../components/Navigation"
import StudentDashboard from "../../components/StudentDashboard"
import TeacherDashboard from "../../components/TeacherDashboard"
import AdminDashboard from "../../components/AdminDashboard"
import { useAuth } from "../../hooks/useAuth"
import "../../styles/dash.css"

export default function Dashboard() {
  const user = useAuth()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setRole(userDoc.data().role)
        }
      }
    }

    fetchUserRole()
  }, [user])

  if (!user) {
    return (
      <div className="main">
        <div className="">
          <h1 className="text-3xl font-semibold mb-4">Please log in to view your dashboard</h1>
        </div>
        <Navigation />
      </div>
    )
  }

  return (
    <div>
      <div className="">
        {role === "student" && <StudentDashboard />}
        {role === "teacher" && <TeacherDashboard />}
        {role === "admin" && <AdminDashboard />}
      </div>
    </div>
  )
}
