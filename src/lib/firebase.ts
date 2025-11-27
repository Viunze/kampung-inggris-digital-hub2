// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, serverTimestamp, getDocs, 
  doc, deleteDoc, query, where, DocumentData, Timestamp 
} from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// --- Konfigurasi Firebase ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Firebase Service
const auth = getAuth(app);
const db = getFirestore(app);

// --- Konfigurasi Supabase Storage ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Fungsi Add Document ke Firestore ---
export async function addDocument<T extends DocumentData>(
  collectionName: string, 
  data: Omit<T, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: data.timestamp || serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to add document to Firestore.");
  }
}

// --- Fungsi Delete Document dari Firestore ---
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw new Error("Failed to delete document from Firestore.");
  }
}

// --- Export Service dan Utility ---
export { app, auth, db, supabase, collection, query, where, getDocs, doc, deleteDoc, Timestamp };
