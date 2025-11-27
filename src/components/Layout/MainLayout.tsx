// src/components/Layout/MainLayout.tsx

import React from 'react';
import Head from 'next/head';
import Sidebar from '../Navigation/Sidebar'; // Impor Sidebar yang baru kita buat

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Kampung Inggris Digital Hub',
  description = 'Pusat informasi, komunitas, dan pembelajaran online untuk Pare, Kediri.',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        {/* Anda bisa menambahkan meta tag lain di sini */}
      </Head>

      <div className="flex h-screen bg-java-cream">
        {/* Sidebar */}
        <Sidebar />

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto ml-64 p-8"> {/* ml-64 untuk menggeser konten dari sidebar */}
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;
