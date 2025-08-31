"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(newPosition);

        if (onLocationChange) {
          onLocationChange(newPosition);
        }

        map.setView(newPosition, map.getZoom());
      },
      (err) => {
        console.log("Unable to retrieve location : ", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };

    // navigator.geolocation.getCurrentPosition(
    //   (pos) => {
    //     setPosition([pos.coords.latitude, pos.coords.longitude]);
    //   },
    //   (err) => {
    //     console.log("Unable to retrieve location : ", err);
    //   }
    // );
  }, [map, onLocationChange]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
          <br />
          Latitude : {position[0].toFixed(6)}
          <br />
          Longtitude : {position[1].toFixed(6)}
        </div>
      </Popup>
    </Marker>
  );
}
