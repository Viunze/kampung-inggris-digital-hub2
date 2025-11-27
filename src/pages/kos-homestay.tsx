// src/pages/kos-homestay.tsx

import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Card from '@/components/UI/Card';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { KosHomestay } from '@/types/models';
import Link from 'next/link';
import Image from 'next/image'; // Import Image

const KosHomestayCard: React.FC<{ kos: KosHomestay }> = ({ kos }) => (
  <Link href={`/kos-homestay/${kos.id}`} legacyBehavior>
    <a className="block h-full">
      <Card className="p-5 flex flex-col h-full hover:shadow-jawa-deep transition-shadow duration-300">
        <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {kos.photos && kos.photos.length > 0 ? (
            <Image
              src={kos.photos[0]}
              alt={kos.name}
              layout="fill"
              objectFit="cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-java-brown-dark mb-2">{kos.name}</h3>
        <p className="text-gray-700 text-sm mb-3 flex-grow">{kos.description.substring(0, 100)}...</p>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>{kos.address}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {kos.facilities.slice(0, 3).map((facility, index) => (
            <span key={index} className="px-3 py-1 bg-java-green-light text-java-brown-dark text-xs font-semibold rounded-full">
              {facility}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-800 font-semibold mt-auto">
          Rp {kos.pricePerMonth.toLocaleString('id-ID')} / bulan
        </div>
      </Card>
    </a>
  </Link>
);

const KosHomestayPage: React.FC = () => {
  const { data: kosHomestayList, loading, error } = useFirestoreData<KosHomestay>('kosHomestay');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    kosHomestayList.forEach(kos => types.add(kos.type));
    return ['All', ...Array.from(types).sort()];
  }, [kosHomestayList]);

  const availableGenders = useMemo(() => {
    const genders = new Set<string>();
    kosHomestayList.forEach(kos => {
      if (kos.genderPreference) genders.add(kos.genderPreference);
    });
    return ['All', ...Array.from(genders).sort()];
  }, [kosHomestayList]);

  const filteredKosHomestay = useMemo(() => {
    let filtered = kosHomestayList;

    if (searchTerm) {
      filtered = filtered.filter(
        (kos) =>
          kos.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kos.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kos.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter((kos) => kos.type === selectedType);
    }

    if (selectedGender !== 'All') {
      filtered = filtered.filter((kos) => kos.genderPreference === selectedGender);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((kos) => kos.pricePerMonth >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((kos) => kos.pricePerMonth <= max);
      }
    }

    return filtered;
  }, [kosHomestayList, searchTerm, selectedType, selectedGender, minPrice, maxPrice]);

  return (
    <MainLayout title="Kos & Homestay">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-java-brown-dark">Kos & Homestay di Pare</h1>
      </div>

      <div className="bg-white rounded-xl shadow-jawa-soft p-6 mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari kos/homestay (nama, deskripsi, alamat)..."
          className="w-full md:flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Type Filter */}
        <div className="w-full md:w-auto">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors bg-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {availableTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'Semua Tipe' : type === 'kos' ? 'Kos' : 'Homestay'}</option>
            ))}
          </select>
        </div>

        {/* Gender Preference Filter */}
        <div className="w-full md:w-auto">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors bg-white"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            {availableGenders.map(gender => (
              <option key={gender} value={gender}>{gender === 'All' ? 'Semua Gender' : `Untuk ${gender}`}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filters */}
        <div className="flex w-full md:w-auto gap-4">
          <input
            type="number"
            placeholder="Min Harga"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Harga"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-center text-lg mt-10">Memuat data kos & homestay...</p>}
      {error && <p className="text-center text-red-500 mt-10">Error: {error}</p>}
      {!loading && !error && filteredKosHomestay.length === 0 && (
        <p className="text-center text-lg mt-10 text-gray-600">Tidak ada kos/homestay yang ditemukan sesuai kriteria Anda.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKosHomestay.map((kos) => (
          <KosHomestayCard key={kos.id} kos={kos} />
        ))}
      </div>
    </MainLayout>
  );
};

export default KosHomestayPage;
