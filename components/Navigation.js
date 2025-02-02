import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"
import "../styles/nav.css"

export default function Navigation() {
  const user = useAuth()

  return (
    <nav>
      <div>
        <div className="button-container">
          <div>
            <Link href="/" className="button">
              <span className="font-bold text-xl">Home</span>
            </Link>
          </div>
          <div>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="button">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}