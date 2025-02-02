import { useState, useEffect } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../lib/firebase"
import { useAuth } from "../hooks/useAuth"
import {
  Search,
  Bell,
  Settings,
  Sun,
  Home,
  Users,
  BookOpen,
  ClipboardList,
  BarChart2,
  Cog,
  MessageSquare,
  LogOut,
  Download,
} from "lucide-react"
import styles from "../styles/TeacherDashboard.module.css"

export default function TeacherDashboard() {
  const user = useAuth()
  const [teacherData, setTeacherData] = useState([])
  const [timetable, setTimetable] = useState([])
  const [assignments, setAssignments] = useState([])
  const [newAssignment, setNewAssignment] = useState({ subject: "", description: "", dueDate: "" })
  const [file, setFile] = useState(null)
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (user) {
        // Fetch Teacher
          const teacherSnapshot = await getDocs(collection(db, "users"));
          const teacher = teacherSnapshot.docs.find((doc) => doc.data().teacherId === user.uid);
          setTeacherData(teacher ? { id: teacher.id, ...teacher.data() } : null);

        // Fetch timetable
        const timetableQuery = query(collection(db, "timetables"), where("teacherId", "==", user.uid))
        const timetableSnapshot = await getDocs(timetableQuery)
        setTimetable(timetableSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        // Fetch assignments
        const assignmentsQuery = query(collection(db, "assignments"), where("teacherId", "==", user.uid))
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        setAssignments(assignmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      }
    }

    fetchTeacherData()
  }, [user])

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault()
    if (user) {
      try {
        await addDoc(collection(db, "assignments"), {
          ...newAssignment,
          teacherId: user.uid,
        })
        setNewAssignment({ subject: "", description: "", dueDate: "" })
        // Refresh assignments
        const assignmentsQuery = query(collection(db, "assignments"), where("teacherId", "==", user.uid))
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        setAssignments(assignmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        console.error("Error adding assignment: ", error)
      }
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const storageRef = ref(storage, `teacher_files/${user.uid}/${file.name}`)
      try {
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log("File available at", downloadURL)
        // You could save this URL to Firestore if needed
      } catch (error) {
        console.error("Error uploading file: ", error)
      }
    }
  }

  return (
    <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <nav className={styles.sidebar}>
          <div className={styles.logo}>
            <img src="amana.jpg" alt="AMANA"/>
          </div>

          <a className={`${styles.navItem} ${tab === "dashboard" ? styles.active : ""}`} onClick={() => setTab("dashboard")}>
            <Home size={20} />
            <span>Dashboard</span>
          </a>

          <a className={`${styles.navItem} ${tab === "students" ? styles.active : ""}`} onClick={() => setTab("students")}>
            <Users size={20} />
            <span>Students</span>
          </a>

          <a className={`${styles.navItem} ${tab === "classes" ? styles.active : ""}`} onClick={() => setTab("classes")}>
            <BookOpen size={20} />
            <span>Classes</span>
          </a>

          <a className={`${styles.navItem} ${tab === "records" ? styles.active : ""}`} onClick={() => setTab("records")}>
            <ClipboardList size={20} />
            <span>Records</span>
          </a>

          <a className={`${styles.navItem} ${tab === "statistics" ? styles.active : ""}`} onClick={() => setTab("statistics")}>
            <BarChart2 size={20} />
            <span>Statistics</span>
          </a>

          <a className={`${styles.navItem} ${tab === "settings" ? styles.active : ""}`} onClick={() => setTab("settings")}>
            <Cog size={20} />
            <span>Settings</span>
          </a>

          <a className={`${styles.navItem} ${tab === "staffroom" ? styles.active : ""}`} onClick={() => setTab("staffroom")}>
            <MessageSquare size={20} />
            <span>Staff Room</span>
            <span className={styles.badge}>4</span>
          </a>

          <a href="/logout" className={`${styles.navItem} ${styles.signOut}`}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </a>
      </nav>
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input type="text" placeholder="Search Class, Documents, Activities..." className={styles.searchInput} />
          </div>

          <div className={styles.headerActions}>
            <Sun size={20} />
            <Bell size={20} />
            <Settings size={20} />
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className={styles.profileImage}
            />
          </div>
        </header>

        {/* Welcome Banner */}
        <section className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Welcome back, {teacherData?.name}</h1>
            <div><h3>Assigned Class</h3>{teacherData?.assignedClasses}</div>
            <p className={styles.welcomeText}>
              You have 27 new students added to your domain. Please reach out to the Head Teacher if you want them
              excluded from your domain.
            </p>
          </div>
          <img
            src="teacher.png"
            alt=""
            width={367}
            height={188}
            className={styles.welcomeIllustration}
          />
        </section>

        {/* Grid Layout */}
        <div className={styles.gridContainer}>
          {/* Student Statistics */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Student Statistic</h2>
              <div className={styles.cardActions}>
                <span>Sept 2022</span>
              </div>
            </div>
            {/* Placeholder for bar chart */}
            <div style={{ height: "300px", background: "#f0f0f0" }}></div>
          </div>

          {/* Class Progress */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Class Progress</h2>
            </div>
            <div className={styles.progressList}>
              {[
                { name: "Class A", registered: "78 Registered", progress: 32 },
                { name: "Class B", registered: "60 Registered", progress: 43 },
                { name: "Class C", registered: "80 Registered", progress: 67 },
                { name: "Class D", registered: "104 Registered", progress: 56 },
              ].map((classItem) => (
                <div key={classItem.name} className={styles.progressItem}>
                  <div className={styles.progressInfo}>
                    <div className={styles.progressTitle}>{classItem.name}</div>
                    <div className={styles.progressSubtitle}>{classItem.registered}</div>
                  </div>
                  <div className={styles.progressBar}>{classItem.progress}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Room */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Staff Room</h2>
              <a href="/staff-room" className={styles.seeAll}>
                See all
              </a>
            </div>
            <div className={styles.staffList}>
              {[
                {
                  name: "Adepoju Ademola",
                  message: "Hello, Mr John. I am yet to get your class to res...",
                  time: "10:25 am",
                },
                {
                  name: "Badiru Pomile",
                  message: "Please schedule your class test",
                  time: "12:35 pm",
                },
              ].map((staff) => (
                <div key={staff.name} className={styles.staffItem}>
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.staffAvatar}
                  />
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{staff.name}</div>
                    <div className={styles.staffMessage}>{staff.message}</div>
                  </div>
                  <div className={styles.staffTime}>{staff.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Documents</h2>
              <a href="/documents" className={styles.seeAll}>
                See all
              </a>
            </div>
            <div className={styles.documentList}>
              {[
                {
                  title: "Class A 1st semester result",
                  date: "04 May, 09:20AM",
                },
                {
                  title: "Kelvin college application",
                  date: "01 Aug, 04:30PM",
                },
              ].map((doc) => (
                <div key={doc.title} className={styles.documentItem}>
                  <Download className={styles.documentIcon} size={20} />
                  <div className={styles.documentInfo}>
                    <div className={styles.documentTitle}>{doc.title}</div>
                    <div className={styles.documentDate}>{doc.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Activities */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Activities</h2>
            <a href="/activities" className={styles.seeAll}>
              See all
            </a>
          </div>
          <div className={styles.activityList}>
            {[
              {
                date: "31",
                title: "Meeting with the VC",
                time: "10 A.M - 11A.M",
                status: "Due soon",
              },
              {
                date: "04",
                title: "Meeting with the J.S",
                time: "10 A.M - 11A.M",
                status: "Upcoming",
              },
            ].map((activity) => (
              <div key={activity.title} className={styles.activityItem}>
                <div className={styles.activityDate}>
                  <div>{activity.date}</div>
                </div>
                <div className={styles.activityInfo}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
                <span className={`${styles.activityStatus} ${styles.statusUpcoming}`}>{activity.status}</span>
              </div>
            ))}
          </div>
        </section>
        <div>
          <h2 className="text-2xl font-semibold">Your Timetable</h2>
          {timetable.map((entry) => (
            <p key={entry.id} className="text-gray-700">
              {entry.day}: {entry.subject} at {entry.time}
            </p>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Your Assignments</h2>
          {assignments.map((assignment) => (
            <p key={assignment.id} className="text-gray-700">
              {assignment.subject}: {assignment.description} (Due: {assignment.dueDate})
            </p>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-medium">Add New Assignment</h3>
          <form onSubmit={handleAssignmentSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <input
                type="text"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Due Date</label>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
              Add Assignment
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-medium">Upload File</h3>
          <input type="file" onChange={handleFileUpload} className="mt-2" />
        </div>
      </main>
    </div>
  )
}
