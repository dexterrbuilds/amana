import { useState, useEffect, Image } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth"
import { signOut } from "firebase/auth"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from "../styles/AdminDashboard.module.css";
import {
  Search,
  Bell,
  Mail,
  ChevronDown,
  Users,
  GraduationCap,
  UserPlus,
  DollarSign,
  Home,
  Book,
  Bus,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react"


export default function AdminDashboard() {
  const user = useAuth()
  const [users, setUsers] = useState([])
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [news, setNews] = useState([])
  const [newNewsItem, setNewNewsItem] = useState({ title: "", content: "" })
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student", gender: "", class: "", subjects: [], teacher: "", phone: "" })
  const [toast, setToast] = useState(null)
  const [value, onChange] = useState(new Date());
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const classOptions = [
    "Pre-Nursery", "Nursery 1", "Nursery 2",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "JSS1", "JSS2", "JSS3",
    "SSS1", "SSS2"
  ]

  const stats = [
    { label: "Students", value: "1260", icon: Users },
    { label: "Teachers", value: "224", icon: GraduationCap },
    { label: "Parents", value: "840", icon: UserPlus },
    { label: "Earnings", value: "$54000", icon: DollarSign },
  ]

  const notices = [
    {
      id: 1,
      title: "Inter-school competition",
      subtitle: "(sports/singing/drawing/drama)",
      date: "10 Feb, 2023",
      views: "7k",
    },
    {
      id: 2,
      title: "Disciplinary action if school",
      subtitle: "discipline is not followed",
      date: "6 Feb, 2023",
      views: "7k",
    },
    {
      id: 3,
      title: "School Annual function",
      subtitle: "celebration 2023-24",
      date: "2 Feb, 2023",
      views: "7k",
    },
    {
      id: 4,
      title: "Returning library books timely",
      subtitle: "(Usually pinned on notice...)",
      date: "31 Jan, 2023",
      views: "7k",
    },
  ]

  useEffect(() => {
    const fetchAdminData = async () => {
      // Fetch users
      const studentsSnapshot = await getDocs(collection(db, "users"));
      setStudents(studentsSnapshot.docs.filter((doc) => doc.data().role === "student"));
      console.log(students)

      const usersSnapshot = await getDocs(collection(db, "users"))
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      console.log(users)

      const teachersSnapshot = await getDocs(collection(db, "users"));
      setTeachers(teachersSnapshot.docs.filter((doc) => doc.data().role === "teacher"));

      const classesSnapshot = await getDocs(collection(db, "classes"));
      setClasses(classesSnapshot.docs.map((doc) => doc.id));

      // Fetch news
      const newsSnapshot = await getDocs(collection(db, "news"))
      setNews(newsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }

    fetchAdminData()
  }, [])

  const handleNewsSubmit = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "news"), newNewsItem)
      setNewNewsItem({ title: "", content: "" })
      // Refresh news
      const newsSnapshot = await getDocs(collection(db, "news"))
      setNews(newsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setToast({ message: "News item added successfully!", type: "success" })
    } catch (error) {
      console.error("Error adding news: ", error)
      setToast({ message: "Error adding news.", type: "error" })
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId))
      setUsers(users.filter((user) => user.id !== userId))
    } catch (error) {
      console.error("Error deleting user: ", error)
      setToast({ message: "Error deleting user.", type: "error" })
    }
  }

  const handleClassChange = async (selectedClass) => {
      const teachersQuery = query(collection(db, "users"), where("role", "==", "teacher"), where("assignedClasses", "array-contains", selectedClass));
      const teachersSnapshot = await getDocs(teachersQuery);
      const teacherData = teachersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(teacherData);
  
      if (teacherData.length > 0) {
        setNewUser((prevUser) => ({
          ...prevUser,
          class: selectedClass,
          teacher: teacherData[0].name,
          teacherPhone: teacherData[0].phone,
        }));
        setSubjects(teacherData[0].subjects || []);
      } else {
        setNewUser((prevUser) => ({
          ...prevUser,
          class: selectedClass,
          teacher: "",
          teacherPhone: "",
        }));
        setSubjects([]);
      }
    };

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const currentUser = auth.currentUser;
      console.log(currentUser)
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, "password123")

      // Add user to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        role: newUser.role,
        class: newUser.role === "student" ? newUser.class : null,
        assignedClasses: newUser.role === "teacher" ? [newUser.class] : [],
        subjects: newUser.subjects,
        phone: newUser.role === "teacher" ? newUser.phone : null,
        studentId: newUser.role === "student" ? userCredential.user.uid : null,
        teacherId: newUser.role === "teacher" ? userCredential.user.uid : null,
        assignedTeacher: newUser.role === "student" ? newUser.teacher : null,
        teacherPhone: newUser.role === "student" ? newUser.teacherPhone : null
      });
      setNewUser({ name: "", email: "", role: "student", gender: "", class: "", subjects: [], phone: "" });
      const usersSnapshot = await getDocs(collection(db, "users"))
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      auth.updateCurrentUser(currentUser)

      setToast({ message: "User created successfully.", type: "success" })
    } catch (error) {
      console.error("Error creating user: ", error)
      setToast({ message: "Failed to create user. " + error.message, type: "error" })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        {/* Left Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarVisible ? styles.sidebarVisible : ""}`}>
          <div className={styles.sidebarLogo}>
            <img src="amana.jpg" width={40} height={40} alt="Logo" />
            <span className="text-2xl font-semibold">AMANA</span>
          </div>

          <nav className={styles.sidebarNav}>
            <div className={`${styles.sidebarLink} ${tab === "dashboard" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("dashboard"); setSidebarVisible(!sidebarVisible); }}>
              <Home size={20} />
              <span>Dashboard</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "students" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("students"); setSidebarVisible(!sidebarVisible); }}>
              <Users size={20} />
              <span>Students</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "teachers" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("teachers"); setSidebarVisible(!sidebarVisible); }}>
              <GraduationCap size={20} />
              <span>Teachers</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "parents" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("parents"); setSidebarVisible(!sidebarVisible); }}>
              <UserPlus size={20} />
              <span>Parents</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "account" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("account"); setSidebarVisible(!sidebarVisible); }}>
              <DollarSign size={20} />
              <span>Account</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "class" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("class"); setSidebarVisible(!sidebarVisible); }}>
              <Book size={20} />
              <span>Class</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "exam" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("exam"); setSidebarVisible(!sidebarVisible); }}>
              <FileText size={20} />
              <span>Exam</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "transport" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("transport"); setSidebarVisible(!sidebarVisible); }}>
              <Bus size={20} />
              <span>Transport</span>
            </div>
            <div className={`${styles.sidebarLink} ${tab === "settings" ? styles.sidebarLinkActive : ""}`} onClick={() => { setTab("settings"); setSidebarVisible(!sidebarVisible); }}>
              <Settings size={20} />
              <span>Settings</span>
            </div>
            <div className={styles.sidebarLink} onClick={() => signOut(auth)}>
              <LogOut size={20} />
              <span>Log out</span>
            </div>
          </nav>
        </aside>

        {/* Mobile Menu Toggle */}
        <div className={`${styles.hamburger} ${sidebarVisible ? styles.active : ""}`} onClick={() => setSidebarVisible(!sidebarVisible)}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.searchBarContainer}>
              <Search size={20} />
              <input className={styles.searchBar} type="text" placeholder="Search" />
            </div>
            <div className={styles.userNav}>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mail size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
          {tab === "dashboard" && (
            <div>
              {/* Charts Section */}
              <div className={styles.chartSection}>
                <div className={styles.chartHeader}>
                  <div className="admin-dashboard">
                    <div className="content">
                      {/* Toast Message */}
                      {toast && (
                        <div
                          className={`p-4 mb-4 rounded-md ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {toast.message}
                        </div>
                      )}
                      <div>
                        {/* Create New User */}
                        <div className={styles.createUser}>
                          <h3 className={styles.cnuHead}>Create New User</h3>
                          <form onSubmit={handleCreateUser} className={styles.cnuForm}>
                            <div className={styles.cnuFormGroup}>
                              <div>
                                <label className={styles.formLabel}>Name</label>
                                <input
                                  className={styles.formInput}
                                  value={newUser.name}
                                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <label className={styles.formLabel}>Email</label>
                                <input
                                  type="email"
                                  className={styles.formInput}
                                  value={newUser.email}
                                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <label className={styles.formLabel}>Gender</label>
                                <select value={newUser.gender} onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })} className={styles.formSelect}>
                                  <option value="">Select gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </div>
                            </div>
                            <div className={styles.cnuFormGroup}>
                              <div>
                                <label className={styles.formLabel}>Role</label>
                                <select
                                  value={newUser.role}
                                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                  className={styles.formSelect}                                >
                                  <option value="student">Student</option>
                                  <option value="teacher">Teacher</option>
                                </select>
                              </div>
                              {newUser.role === "student" && (
                                <>
                                  <select className={styles.formSelect} value={newUser.class} onChange={(e) => handleClassChange(e.target.value)} >
                                    <option value="">Select Class</option>
                                    {classOptions.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                                  </select>
                                  <input value={newUser.teacher} readOnly placeholder="Assigned Teacher" className={styles.formInput} />
                                </>
                              )}
                              {newUser.role === "teacher" && (
                                <>
                                  <input className={styles.formInput} value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} placeholder="Phone Number" required />
                                  <select className={styles.formSelect} value={newUser.class} onChange={(e) => setNewUser({ ...newUser, class: e.target.value })}>
                                    <option value="">Assign Class</option>
                                    {classOptions.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                                  </select>
                                  <input className={styles.formInput} value={newUser.subjects} onChange={(e) => setNewUser({ ...newUser, subjects: e.target.value.split(", ") })} placeholder="Subjects (comma separated)"  required />
                                </>
                              )}
                            </div>
                            <button type="submit" className={styles.formButton}>
                              Create User
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Chart placeholder */}
                <div className="h-64 bg-gray-100 rounded-lg"></div>
              </div>

              {/* Manage News */}
              <div className={styles.chartSection}>
                <div className={styles.mn}>
                  <h2 className={styles.h2}>Manage News</h2>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="p-4 border rounded-md shadow-md">
                        <p className="font-semibold">{item.title}</p>
                        <p>{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add News Item */}
                <div className={styles.mnc}>
                  <h3 className={styles.h3}>Add News Item</h3>
                  <form onSubmit={handleNewsSubmit} className="form">
                    <div>
                      <label className={styles.formLabel}>Title</label>
                      <input
                        className={styles.formInput}
                        value={newNewsItem.title}
                        onChange={(e) => setNewNewsItem({ ...newNewsItem, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Content</label>
                      <textarea
                        value={newNewsItem.content}
                        className={styles.formTextarea}
                        onChange={(e) => setNewNewsItem({ ...newNewsItem, content: e.target.value })}
                      />
                    </div>
                    <button type="submit" className={styles.formButton}>
                      Add News Item
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        {tab === "students" && (
          <div>
            <h1>List of Students</h1>
            <ul>
              {students.map((student) => (
                <li key={student.id}>{student.data().name}, {student.data().email}, {student.data().gender} </li>
              ))}
            </ul>
          </div>
        )}
        </main>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          {/* Calendar */}
          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <h2 className={styles.h2}>Event Calendar</h2>
            </div>
            <Calendar
                onChange={onChange}
                value={value}
            />
          </div>

          {/* Community Card */}
          <div className={styles.communityCard}>
            <h2 className={styles.h2}>Join the community and find out more</h2>
            <p className="text-sm mt-2">
              Join different community and keep updated with the live notices and messages.
            </p>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg mt-4">Explore now</button>

          </div>
        </aside>
      </div>
    </div>
  )
}
