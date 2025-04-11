'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/MapEmplacement.module.css';

interface MapEmplacementProps {
    onSelectLocation: (location: { lat: number; lng: number }) => void;
}

export default function MapEmplacement({ onSelectLocation }: MapEmplacementProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const markerIcon = new L.Icon({
        iconUrl: '/custom-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    function LocationMarker() {
        useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onSelectLocation(e.latlng);
        },
        });

        return position === null ? null : (
        <Marker position={position} icon={markerIcon}  />
        );
    }

    return (
        <MapContainer center={[35.75, 10.75]} zoom={16} className={styles.map}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        </MapContainer>
    );
}
