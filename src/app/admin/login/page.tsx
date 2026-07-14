'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { KeyRound, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Redirect to admin dashboard if already signed in as admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@cbcht.com') {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Validate email authorization
      if (user && user.email === 'admin@cbcht.com') {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        // Sign out immediately if unauthorized
        await signOut(auth);
        setError('Access denied: You are not authorized to access the Admin CMS.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let message = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'Admin account not found.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-stone-50 overflow-hidden py-12 px-6">
      {/* Background Graphic Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-church-blue/5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-church-gold/5 blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-stone-900 font-black text-2xl tracking-tighter hover:text-church-blue transition-colors">
            CBC HALLELUYAH TEMPLE
          </Link>
          <p className="mt-2 text-stone-500 text-sm uppercase tracking-[0.2em]">
            Admin Portal Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-stone-200 rounded-none p-8 md:p-10 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-church-blue/10 flex items-center justify-center text-church-blue border border-church-blue/20">
              <KeyRound className="h-6 w-6" />
            </div>
          </div>

          <h2 className="text-center text-2xl font-serif font-bold text-stone-900 mb-8">
            Access Portal
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-xs text-green-600">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-stone-500">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-4 pl-12 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-stone-500">
                Security Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-4 pl-12 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-church-blue/10 focus:border-church-blue/40 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-church-blue hover:bg-blue-800 active:scale-[0.98] py-4 text-sm font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-church-blue/10"
            >
              {loading ? 'Verifying Identity...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">
              ← Return to Halleluyah Temple Public Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
