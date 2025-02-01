import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"

export default function Navigation() {
  const user = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">School Portal</span>
            </Link>
          </div>
          <div className="flex items-center">
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
              <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}