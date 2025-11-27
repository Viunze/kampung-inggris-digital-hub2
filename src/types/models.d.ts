// src/types/models.d.ts

import { Timestamp } from 'firebase/firestore';

// Tipe untuk user yang diambil dari Firestore (jika disimpan di Firestore)
// Ini berbeda dengan `firebase/auth` User
export interface AppUser {
  id: string; // UID dari Firebase Authentication
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  // Tambahkan field lain yang mungkin relevan, misal: role, bio, dll.
}

// Model untuk data lembaga kursus
export interface CourseInstitution {
  id: string;
  name: string;
  address: string;
  description: string;
  contact: string; // No. Telepon/WA
  programs: string[]; // Contoh: ['Speaking', 'Grammar', 'TOEFL']
  averageRating: number;
  reviewCount: number;
  photos: string[]; // Array of image URLs
  isVerified: boolean;
  priceRange: string; // Contoh: 'Murah', 'Sedang', 'Mahal'
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Model untuk data kos dan homestay
export interface KosHomestay {
  id: string;
  name: string;
  address: string;
  description: string;
  ownerContact: string; // No. Telepon/WA pemilik
  pricePerMonth: number;
  facilities: string[]; // Contoh: ['Wifi', 'AC', 'KM Dalam', 'Dapur']
  photos: string[]; // Array of image URLs
  isVerified: boolean;
  distanceToCenter: number; // Dalam menit atau km
  type: 'kos' | 'homestay';
  genderPreference?: 'male' | 'female' | 'mixed';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Model untuk postingan di Angkringan Digital (Forum)
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Timestamp; // Gunakan Timestamp dari Firestore
  repliesCount: number;
  likesCount: number;
  likedBy: string[]; // <-- Tambahkan ini: Array of User UIDs
  createdAt?: Timestamp; // Untuk konsistensi
  updatedAt?: Timestamp;
}

// Model untuk balasan di Angkringan Digital (Forum)
export interface Reply {
  id: string;
  postId: string; // ID postingan forum yang dibalas
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Timestamp; // Gunakan Timestamp dari Firestore
  likesCount: number;
  likedBy: string[]; // <-- Tambahkan ini: Array of User UIDs
  createdAt?: Timestamp; // Untuk konsistensi
  updatedAt?: Timestamp;
}

// Model untuk lokasi penting
export interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  category: 'restaurant' | 'bank' | 'atm' | 'hospital' | 'shopping' | 'transport' | 'other';
  googleMapsLink?: string; // Link ke Google Maps
  latitude?: number;  // Untuk integrasi peta nanti
  longitude?: number; // Untuk integrasi peta nanti
  photoURL?: string; // Jika nanti ada kemampuan upload gambar, bisa dipakai
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Model untuk Angkringan Widget (jika ingin menyimpan state widget terpisah)
export interface AngkringanWidget {
  id: string; // Misal 'main-widget'
  lastPostContent: string;
  lastPostAuthor: string;
  lastPostTimestamp: Timestamp;
}
