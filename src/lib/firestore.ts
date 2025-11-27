// src/lib/firestore.ts

import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc, // Pastikan ini diimpor
  deleteDoc,
  query,
  QueryConstraint,
  serverTimestamp, // Untuk otomatis mengisi timestamp
  DocumentData,
} from 'firebase/firestore';

/**
 * Mengambil dokumen tunggal berdasarkan ID dari koleksi tertentu.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen.
 * @returns Data dokumen atau null jika tidak ditemukan.
 */
export const getDocById = async <T extends DocumentData>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Memastikan id dokumen disertakan dalam data
    return { ...docSnap.data(), id: docSnap.id } as T;
  } else {
    return null;
  }
};

/**
 * Mengambil semua dokumen atau dokumen yang difilter dari koleksi tertentu.
 * @param collectionName Nama koleksi.
 * @param queryConstraints Array of QueryConstraint untuk filter, orderBy, limit.
 * @returns Array of dokumen.
 */
export const getDocsByQuery = async <T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);

  const data: T[] = [];
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id } as T);
  });
  return data;
};

/**
 * Menambahkan dokumen baru ke koleksi.
 * Otomatis menambahkan `createdAt` dan `updatedAt` dengan `serverTimestamp()`.
 * @param collectionName Nama koleksi.
 * @param data Data dokumen yang akan ditambahkan (tanpa ID).
 * @returns ID dokumen yang baru dibuat.
 */
export const addDocument = async <T extends DocumentData>(collectionName: string, data: Omit<T, 'id'>): Promise<string> => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Memperbarui dokumen yang sudah ada.
 * Otomatis memperbarui `updatedAt` dengan `serverTimestamp()`.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen yang akan diperbarui.
 * @param data Data sebagian dokumen yang akan diperbarui.
 */
export const updateDocument = async <T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

/**
 * Menghapus dokumen dari koleksi.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen yang akan dihapus.
 */
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
