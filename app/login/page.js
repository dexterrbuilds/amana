'use client'

import { useState } from 'react';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { Mail, Lock } from "lucide-react"
import "../../styles/login.css"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isFirstLogin) {
          setIsFirstLogin(true);
        } else if (userData.role === 'admin') {
          router.push('/dashboard'); // Redirect admins to the admin dashboard
        } else {
          router.push('/dashboard'); // Regular users go to the main dashboard
        }
      }      
    } catch (error) {
      setError('Failed to log in');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        // Update the user's password
        await updatePassword(auth.currentUser, newPassword);
  
        // Get the user document
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        
        // Check if the user document exists and if 'isFirstLogin' is present
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Only update 'isFirstLogin' if it's not an admin (admins don't need this field)
          if (userData.role !== 'admin') {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              isFirstLogin: false
            });
          }
        }
        // Redirect to the dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Failed to update password');
    }
  };
  

  return (
      <div className="login-card">
        <div className="left-side">
          <div className="floating-elements">
            <div className="floating-card card-1">
              <img src="/none.png" alt="UI Preview" width={490} height={450} />
            </div>
          </div>
          <h2>Login</h2>
          <p>login in to your portal to view your details</p>

        </div>
        <div className="right-side">
          <img src="/col-md-6.png" alt="Logo" width={48} height={48} className="logo" />
          {!isFirstLogin ? (
            <form onSubmit={handleSubmit}  className="login-form">
              <h1 className="form-title">Hello Again!</h1>
              <p className="form-subtitle">Enter your credentials to access your account</p>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder='Enter your email'
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='Enter your password'
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
                <button type="submit" className="login-button">
                  Sign In
                </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change Password
                </button>
              </div>
            </form>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
  );
}