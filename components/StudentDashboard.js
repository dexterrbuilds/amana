import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../hooks/useAuth"
import "../styles/Student.css"
import { Bell, Newspaper, BookA, Home } from "lucide-react"

export default function StudentDashboard() {
  const user = useAuth()
  const [studentData, setStudentData] = useState([])
  const [results, setResults] = useState([])
  const [timetable, setTimetable] = useState([])
  const [assignments, setAssignments] = useState([])
  const [tab, setTab] = useState("dashboard");
  const [currentDate, setCurrentDate] = useState(getDate());

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user) {
        // Fetch Student 
        const studentSnapshot = await getDocs(collection(db, "users"));
        const student = studentSnapshot.docs.find((doc) => doc.data().studentId === user.uid);
        setStudentData(student ? { id: student.id, ...student.data() } : null);
        console.log(studentData)

        // Fetch results
        const resultsQuery = query(collection(db, "results"), where("studentId", "==", user.uid))
        const resultsSnapshot = await getDocs(resultsQuery)
        setResults(resultsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        // Fetch timetable
        const timetableQuery = query(collection(db, "timetables"), where("studentId", "==", user.uid))
        const timetableSnapshot = await getDocs(timetableQuery)
        setTimetable(timetableSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        // Fetch assignments
        const assignmentsQuery = query(collection(db, "assignments"), where("studentId", "==", user.uid))
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        setAssignments(assignmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      }
    }

    fetchStudentData()
  }, [user])

  function getDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <img src="amana.jpg" alt="Logo" width={64} height={64} className="logo" />

        <div className={`sidebarLink ${tab === "dashboard" ? "sidebarLinkActive" : ""}`} onClick={() => setTab("dashboard")}>
              <Home size={20} />
              <span>Dashboard</span>
        </div>

        <div className={`sidebarLink ${tab === "news" ? "sidebarLinkActive" : ""}`} onClick={() => setTab("dashboard")}>
              <Newspaper size={20} />
              <span>News</span>
        </div>

        <div className={`sidebarLink ${tab === "news" ? "sidebarLinkActive" : ""}`} onClick={() => setTab("dashboard")}>
              <BookA size={20} />
              <span>Assignment</span>
        </div>

        {/* Add other navigation items */}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <input type="search" placeholder="Search" className="search-bar" />

          <div className="user-profile">
            <div className="user-info">
              <div className="user-name">{studentData?.name}</div>
              <div className="user-year">{studentData?.class}</div>
            </div>
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className="user-avatar"
            />
            <Bell size={20} />
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-date">{currentDate}</div>
            <div>
              <h1 className="welcome-title">Welcome back, {studentData?.name}</h1>
              <p className="welcome-subtitle">Always stay updated in your student portal</p>
            </div>
          </div>
          <img
            src="student.png"
            alt="Welcome Illustrations"
            className="welcome-illustrations"
          />
        </section>

        {/* Finance Section */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Profile</h2>
          </div>

          <div className="profile-card">
            <div className=""><h3>Name:</h3> {studentData?.name}</div>
            <div className=""><h3>Class Teacher:</h3> {studentData?.assignedTeacher}</div>
            <div className=""><h3>Teacher's Phone No.:</h3> {studentData?.teacherPhone}</div>
          </div>
        </section>

        {/* Enrolled Courses */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Enrolled Courses</h2>
            <a href="/courses" className="see-all">
              See all
            </a>
          </div>

          <div className="course-cards">
            <div className="course-card active">
              <div className="course-info">
                <h3>Object oriented programming</h3>
                <button className="view-button">View</button>
              </div>
              <img src="/placeholder.svg?height=80&width=80" alt="" width={80} height={80} />
            </div>

            <div className="course-card">
              <div className="course-info">
                <h3>Fundamentals of database systems</h3>
                <button className="view-button">View</button>
              </div>
              <img src="/placeholder.svg?height=80&width=80" alt="" width={80} height={80} />
            </div>
          </div>
        </section>

        {/* Course Instructors */}
        <section className="instructors-section">
          <div className="section-header">
            <h2 className="section-title">Course Instructors</h2>
            <a href="/instructors" className="see-all">
              See all
            </a>
          </div>

          <div className="instructor-avatars">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src="/placeholder.svg?height=48&width=48"
                alt={`Instructor ${i}`}
                width={48}
                height={48}
                className="instructor-avatar"
              />
            ))}
          </div>

          {/* Daily Notice */}
          <div className="notice-card">
            <h3 className="notice-title">Prelim payment due</h3>
            <p className="notice-text">Norem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <a href="/notices" className="see-more">
              See more
            </a>
          </div>

          <div className="notice-card">
            <h3 className="notice-title">Exam schedule</h3>
            <p className="notice-text">
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis.
            </p>
            <a href="/schedule" className="see-more">
              See more
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
