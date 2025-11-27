// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import MainLayout from '@/components/Layout/MainLayout'; // Impor MainLayout
import { auth } from '@/lib/firebase'; // Impor auth dari firebase.ts

function MyApp({ Component, pageProps }: AppProps) {
  // Anda bisa menambahkan logika pengecekan autentikasi di sini
  // Misalnya, menggunakan `onAuthStateChanged` dari Firebase Auth
  // atau context API untuk menyimpan status auth user

  // Contoh sederhana: menerapkan MainLayout ke semua halaman
  // Untuk halaman login/register, Anda mungkin tidak ingin menggunakan MainLayout
  // Akan ada kondisi lebih lanjut di sini untuk membedakan layout
  const noLayoutPages = ['/auth/login', '/auth/register'];
  const shouldApplyLayout = !noLayoutPages.includes(Component.displayName || (Component as any).name || router.pathname);

  // Jika Anda ingin mengelola state auth secara global, Anda bisa menggunakan React Context
  // Contoh hook: useAuth dari src/hooks/useAuth.ts

  return (
    // <AuthProvider> // Contoh jika Anda membuat AuthProvider Context
      {shouldApplyLayout ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        <Component {...pageProps} />
      )}
    // </AuthProvider>
  );
}

export default MyApp;
