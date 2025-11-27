// src/pages/courses.tsx

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Card from '@/components/UI/Card';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { CourseInstitution } from '@/types/models';
import Link from 'next/link';

const CourseCard: React.FC<{ course: CourseInstitution }> = ({ course }) => (
  <Link href={`/courses/${course.id}`} legacyBehavior>
    <a className="block h-full">
      <Card className="p-5 flex flex-col h-full hover:shadow-jawa-deep transition-shadow duration-300">
        <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {course.photos && course.photos.length > 0 ? (
            <Image
              src={course.photos[0]}
              alt={course.name}
              layout="fill"
              objectFit="cover"
              unoptimized // Dinonaktifkan karena tanpa Cloud Storage, optimasi mungkin tidak berlaku
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-java-brown-dark mb-2">{course.name}</h3>
        <p className="text-gray-700 text-sm mb-3 flex-grow">{course.description.substring(0, 100)}...</p>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>{course.address}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {course.programs.slice(0, 2).map((program, index) => (
            <span key={index} className="px-3 py-1 bg-java-green-light text-java-brown-dark text-xs font-semibold rounded-full">
              {program}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-800 font-semibold mt-auto">
          {course.priceRange}
        </div>
      </Card>
    </a>
  </Link>
);

const CoursesPage: React.FC = () => {
  const { data: courses, loading, error } = useFirestoreData<CourseInstitution>('courseInstitutions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  const availablePrograms = useMemo(() => {
    const programs = new Set<string>();
    courses.forEach(course => course.programs.forEach(p => programs.add(p)));
    return ['All', ...Array.from(programs).sort()];
  }, [courses]);

  const availablePriceRanges = useMemo(() => {
    const priceRanges = new Set<string>();
    courses.forEach(course => priceRanges.add(course.priceRange));
    return ['All', ...Array.from(priceRanges).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProgram !== 'All') {
      filtered = filtered.filter((course) => course.programs.includes(selectedProgram));
    }

    if (selectedPriceRange !== 'All') {
      filtered = filtered.filter((course) => course.priceRange === selectedPriceRange);
    }

    return filtered;
  }, [courses, searchTerm, selectedProgram, selectedPriceRange]);

  return (
    <MainLayout title="Lembaga Kursus">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-java-brown-dark">Lembaga Kursus di Pare</h1>
      </div>

      <div className="bg-white rounded-xl shadow-jawa-soft p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari kursus (nama, deskripsi, alamat)..."
          className="w-full md:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Program Filter */}
        <div className="w-full md:w-auto">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors bg-white"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            {availablePrograms.map(program => (
              <option key={program} value={program}>{program === 'All' ? 'Semua Program' : program}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="w-full md:w-auto">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors bg-white"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            {availablePriceRanges.map(price => (
              <option key={price} value={price}>{price === 'All' ? 'Semua Harga' : `Harga ${price}`}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-lg mt-10">Memuat data kursus...</p>}
      {error && <p className="text-center text-red-500 mt-10">Error: {error}</p>}
      {!loading && !error && filteredCourses.length === 0 && (
        <p className="text-center text-lg mt-10 text-gray-600">Tidak ada lembaga kursus yang ditemukan sesuai kriteria Anda.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
