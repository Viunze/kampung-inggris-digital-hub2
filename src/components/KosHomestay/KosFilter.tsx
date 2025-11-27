// src/components/KosHomestay/KosFilter.tsx

import React, { useState } from 'react';
import Card from '../UI/Card';

interface KosFilterProps {
  onFilterChange: (filters: { priceRange?: string; facilities?: string[]; verifiedOnly?: boolean }) => void;
  availableFacilities: string[];
}

const KosFilter: React.FC<KosFilterProps> = ({ onFilterChange, availableFacilities }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFacilityChange = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange: selectedPriceRange === '' ? undefined : selectedPriceRange,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : undefined,
      verifiedOnly: verifiedOnly ? true : undefined,
    });
  };

  const handleResetFilters = () => {
    setSelectedPriceRange('');
    setSelectedFacilities([]);
    setVerifiedOnly(false);
    onFilterChange({});
  };

  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-xl font-bold text-java-brown-dark mb-4 border-b pb-2 border-gray-200">
        Filter Kos & Homestay
      </h3>

      <div className="mb-6">
        <label htmlFor="price-range" className="block text-gray-700 text-sm font-semibold mb-2">
          Rentang Harga / Bulan
        </label>
        <select
          id="price-range"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors"
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
        >
          <option value="">Semua Harga</option>
          <option value="<500000">{'< Rp 500rb'}</option>
          <option value="500000-1000000">Rp 500rb - 1jt</option>
          <option value=">1000000">{'> Rp 1jt'}</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Fasilitas
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableFacilities.map((facility) => (
            <label key={facility} className="flex items-center text-gray-700 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-java-green-dark rounded focus:ring-java-green-light"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityChange(facility)}
              />
              <span className="ml-2">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center text-gray-700 text-sm font-semibold cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-java-green-dark rounded focus:ring-java-green-light"
            checked={verifiedOnly}
            onChange={() => setVerifiedOnly(!verifiedOnly)}
          />
          <span className="ml-2">Hanya Tampilkan Kos Terverifikasi</span>
        </label>
      </div>

      <div className="flex space-x-2 mt-auto">
        <button
          onClick={handleApplyFilters}
          className="flex-1 bg-java-green-dark text-white py-2 rounded-lg font-semibold hover:bg-java-green-light transition-colors"
        >
          Terapkan
        </button>
        <button
          onClick={handleResetFilters}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Reset
        </button>
      </div>
    </Card>
  );
};

export default KosFilter;
