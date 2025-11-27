// src/pages/auth/login.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth'; // Gunakan useAuth hook

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email dan password harus diisi!');
      return;
    }
    try {
      await signIn(email, password);
    } catch (err) {
      // Error ditangani oleh useAuth dan disimpan di state `error`
      // Anda bisa menampilkan error di sini, atau useAuth sudah menampilkannya
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error ditangani oleh useAuth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-java-cream">
      <Head>
        <title>Login - Kampung Inggris Digital Hub</title>
      </Head>
      <div className="bg-white p-8 rounded-xl shadow-jawa-deep w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-java-brown-dark mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-java-green-dark text-white py-2 rounded-lg font-semibold hover:bg-java-green-light transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/forgot-password" legacyBehavior>
            <a className="text-java-brown-medium hover:underline text-sm">Lupa Password?</a>
          </Link>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">ATAU</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 space-x-2"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.000 12.188c0-.776-.068-1.536-.188-2.276H12.25v4.29h5.584c-.244 1.252-.94 2.308-1.928 3.004v3.312h4.276c2.516-2.316 3.97-5.716 3.97-9.33zm-10.004-8.188c-2.316 0-4.29 1.88-4.29 4.25s1.974 4.25 4.29 4.25c1.24 0 2.368-.52 3.164-1.364l3.116 3.116c-1.78 1.636-4.08 2.592-6.28 2.592-4.968 0-8.996-4.032-8.996-9.044C3.25 4.032 7.278 0 12 0c2.616 0 4.968 1.052 6.756 2.808l-3.216 3.092c-.82-.74-1.896-1.184-3.528-1.184z" />
          </svg>
          <span>Login dengan Google</span>
        </button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Belum punya akun?{' '}
          <Link href="/auth/register" legacyBehavior>
            <a className="text-java-green-dark hover:underline font-semibold">Daftar Sekarang</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

// Memberikan nama displayName untuk _app.tsx agar bisa mengecualikan layout
LoginPage.displayName = 'LoginPage';

export default LoginPage;
