"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import UserLocationMarker from "@/components/UserLocationMarker";
import SearchBox from "@/components/SearchBox";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Varsayılan icon'u özel icon ile değiştir
L.Marker.prototype.options.icon = customIcon;

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Map() {
  const [center, setCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(
    null
  );
  const [clickedMarker, setClickedMarker] = useState<[number, number] | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [routeWaypoints, setRouteWaypoints] = useState<L.LatLng[]>([]);
  const mapRef = useRef<L.Map>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  function handleSelect(coords: [number, number]) {
    setCenter(coords);
    setSearchMarker(coords);

    if (mapRef.current) {
      mapRef.current.setView(coords, 13);
    }
  }

  function handleMapClick(latlng: [number, number]) {
    setClickedMarker(latlng);

    if (mapRef.current) {
      mapRef.current.setView(latlng, mapRef.current.getZoom());
    }
  }

  const handleUserLocationChange = (latLng: [number, number]) => {
    setUserLocation(latLng);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (routeWaypoints.length >= 2) {
      routingControlRef.current = L.Routing.control({
        waypoints: routeWaypoints,
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: "#0066ff", weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10,
        } as L.Routing.LineOptions,
        showAlternatives: false,
        addWaypoints: false,
        // draggableWaypoints: true,
        fitSelectedRoutes: true,
        show: true,
      }).addTo(mapRef.current);
    }

    return () => {
      if (routingControlRef.current) {
        mapRef.current?.removeControl(routingControlRef.current);
      }
    };
  }, [routeWaypoints]);

  useEffect(() => {
    const waypoints: L.LatLng[] = [];

    if (userLocation) {
      waypoints.push(L.latLng(userLocation[0], userLocation[1]));
    }

    if (clickedMarker) {
      waypoints.push(L.latLng(clickedMarker[0], clickedMarker[1]));
    } else if (searchMarker) {
      waypoints.push(L.latLng(searchMarker[0], searchMarker[1]));
    }

    setRouteWaypoints(waypoints);
  }, [userLocation, clickedMarker, searchMarker]);

  const clearRoute = () => {
    setRouteWaypoints([]);
    setClickedMarker(null);
    setSearchMarker(null);
  };

  return (
    <>
      <SearchBox onSelect={handleSelect} />
      <div className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded shadow-md">
        <button
          onClick={clearRoute}
          className="bg-red-500 text white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Clear Route
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        className="custom-map-container w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={handleMapClick} />

        {searchMarker && (
          <Marker position={searchMarker}>
            <Popup>Target Location</Popup>
          </Marker>
        )}

        {clickedMarker && (
          <Marker position={clickedMarker}>
            <Popup>Clicked Location</Popup>
          </Marker>
        )}

        {/* {searchMarker && (
          <Marker position={searchMarker}>
            <Popup>Searched Location</Popup>
          </Marker>
        )} */}

        <UserLocationMarker onLocationChange={handleUserLocationChange} />
      </MapContainer>
    </>
  );
}
