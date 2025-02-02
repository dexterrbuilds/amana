import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../hooks/useAuth"
import styles from "../styles/Student.module.css"
import { Bell, Newspaper, BookA, Home } from "lucide-react"

export default function StudentDashboard() {
  const user = useAuth()
  const [studentData, setStudentData] = useState([])
  const [results, setResults] = useState([])
  const [timetable, setTimetable] = useState([])
  const [assignments, setAssignments] = useState([])
  const [tab, setTab] = useState("dashboard");
  const [currentDate, setCurrentDate] = useState(getDate());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      {isSidebarOpen && (
      <nav className={`${styles.sidebar} ${styles.open}`}>
        <img src="amana.jpg" alt="Logo" width={64} height={64} className={styles.logo} />

        <div className={`${styles.sidebarLink} ${tab === "dashboard" ? styles.sidebarLinkActive : ""}`} onClick={() => setTab("dashboard")}>
              <Home size={20} />
              <span>Dashboard</span>
        </div>

        <div className={`${styles.sidebarLink} ${tab === "news" ? styles.sidebarLinkActive : ""}`} onClick={() => setTab("news")}>
              <Newspaper size={20} />
              <span>News</span>
        </div>

        <div className={`${styles.sidebarLink} ${tab === "assignments" ? styles.sidebarLinkActive : ""}`} onClick={() => setTab("assignments")}>
              <BookA size={20} />
              <span>Assignment</span>
        </div>

        {/* Add other navigation items */}
      </nav>
      )}
      <div className={styles.hamburgerMenu} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <input type="search" placeholder="Search" className={styles.searchBar} />

          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{studentData?.name}</div>
              <div className={styles.userYear}>{studentData?.class}</div>
            </div>
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className={styles.userAvatar}
            />
            <Bell size={20} />
          </div>
        </header>

        {/* Welcome Banner */}
        <section className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeDate}>{currentDate}</div>
            <div>
              <h1 className={styles.welcomeTitle}>Welcome back, {studentData?.name}</h1>
              <p className={styles.welcomeSubtitle}>Always stay updated in your student portal</p>
            </div>
          </div>
          <img
            src="student.png"
            alt="Welcome Illustrations"
            className={styles.welcomeIllustrations}
          />
        </section>

        {/* Finance Section */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Profile</h2>
          </div>

          <div className={styles.profileCard}>
            <div className=""><h3>Name:</h3> {studentData?.name}</div>
            <div className=""><h3>Class Teacher:</h3> {studentData?.assignedTeacher}</div>
            <div className=""><h3>Teacher's Phone No.:</h3> {studentData?.teacherPhone}</div>
          </div>
        </section>

        {/* Enrolled Courses */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Enrolled Courses</h2>
            <a href="/courses" className={styles.seeAll}>
              See all
            </a>
          </div>

          <div className={styles.courseCards}>
            <div className={`${styles.courseCard} ${styles.active}`}>
              <div className={styles.courseInfo}>
                <h3>Object oriented programming</h3>
                <button className={styles.viewButton}>View</button>
              </div>
              <img src="/placeholder.svg?height=80&width=80" alt="" width={80} height={80} />
            </div>

            <div className={styles.courseCard}>
              <div className={styles.courseInfo}>
                <h3>Fundamentals of database systems</h3>
                <button className={styles.viewButton}>View</button>
              </div>
              <img src="/placeholder.svg?height=80&width=80" alt="" width={80} height={80} />
            </div>
          </div>
        </section>

        {/* Course Instructors */}
        <section className={styles.instructorsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Course Instructors</h2>
            <a href="/instructors" className={styles.seeAll}>
              See all
            </a>
          </div>

          <div className={styles.instructorAvatars}>
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src="/placeholder.svg?height=48&width=48"
                alt={`Instructor ${i}`}
                width={48}
                height={48}
                className={styles.instructorAvatar}
              />
            ))}
          </div>

          {/* Daily Notice */}
          <div className={styles.noticeCard}>
            <h3 className={styles.noticeTitle}>Prelim payment due</h3>
            <p className={styles.noticeText}>Norem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <a href="/notices" className={styles.seeMore}>
              See more
            </a>
          </div>

          <div className={styles.noticeCard}>
            <h3 className={styles.noticeTitle}>Exam schedule</h3>
            <p className={styles.noticeText}>
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
              aliquet odio mattis.
            </p>
            <a href="/schedule" className={styles.seeMore}>
              See more
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}