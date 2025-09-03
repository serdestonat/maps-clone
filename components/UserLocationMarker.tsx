"use client";

import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface UserLocationMarkerProps {
  onLocationChange?: (latlng: [number, number]) => void;
}

export default function UserLocationMarker({
  onLocationChange,
}: UserLocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();
  const centeredOnce = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    // Konumu takip et ama HARİTAYI SÜREKLİ MERKEZE ALMA
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPos);
        onLocationChange?.(newPos);

        // Sadece ilk tespitte merkeze al (kullanıcıyı kilitlememek için)
        if (!centeredOnce.current) {
          map.setView(newPos, map.getZoom());
          centeredOnce.current = true;
        }
      },
      (err) => {
        // izin yoksa sessizce geç
        console.log("Geolocation error:", err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map, onLocationChange]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
          <br />
          Latitude: {position[0].toFixed(6)}
          <br />
          Longitude: {position[1].toFixed(6)}
        </div>
      </Popup>
    </Marker>
  );
}
