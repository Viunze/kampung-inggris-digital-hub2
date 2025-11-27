// src/pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth'; // Gunakan useAuth hook

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Ambil user dan loading dari useAuth

  useEffect(() => {
    if (!loading) { // Tunggu hingga status autentikasi selesai dimuat
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]); // Tambahkan user dan loading sebagai dependency

  return (
    <div className="flex items-center justify-center min-h-screen bg-java-cream text-java-brown-dark">
      {loading ? (
        <p className="text-xl font-medium">Memuat...</p>
      ) : (
        // Ini tidak akan terlihat karena akan langsung redirect
        <p className="text-xl font-medium">Mengarahkan...</p>
      )}
    </div>
  );
};

export default LandingPage;
