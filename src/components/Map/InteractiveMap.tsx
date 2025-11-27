// src/components/Map/InteractiveMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS Leaflet
import L from 'leaflet'; // Import object Leaflet untuk custom icon

// Fix default icon issue with Webpack/Next.js
// https://github.com/PaulLeCam/react-leaflet/issues/453
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface InteractiveMapProps {
  center: [number, number]; // [latitude, longitude]
  zoom: number;
  locations: Array<{
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    googleMapsLink?: string;
  }>;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ center, zoom, locations }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false} // Atur ke false agar tidak mengganggu scroll halaman
      style={{ height: '500px', width: '100%', borderRadius: '0.75rem' }} // Tailwind's rounded-xl
      className="shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        loc.latitude !== undefined && loc.longitude !== undefined && ( // Hanya render jika koordinat ada
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <div className="font-bold text-lg mb-1 text-java-brown-dark">{loc.name}</div>
              <div className="text-sm text-gray-700 mb-2">{loc.description.substring(0, 150)}...</div>
              <div className="text-xs text-gray-600 mb-2">{loc.address}</div>
              {loc.googleMapsLink && (
                <a
                  href={loc.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-java-green-dark hover:underline text-sm font-medium"
                >
                  Lihat di Google Maps
                </a>
              )}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;
