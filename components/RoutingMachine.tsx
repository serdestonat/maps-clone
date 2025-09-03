"use client";
import { createControlComponent } from "@react-leaflet/core";
import L, { LatLng } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// RoutingMachineProps arayüzünü tanımla
interface RoutingMachineProps {
  waypoints: LatLng[];
}

// createRoutingMachineLayer fonksiyonu
const createRoutingMachineLayer = ({ waypoints }: RoutingMachineProps) => {
  return L.Routing.control({
    waypoints,
    routeWhileDragging: true,
    lineOptions: {
      styles: [{ color: "#0066ff", weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 1,
    },
    showAlternatives: false,
    addWaypoints: false,
    fitSelectedRoutes: true,
  });
};

// createControlComponent ile RoutingMachine bileşenini oluştur
const RoutingMachine = createControlComponent<
  RoutingMachineProps,
  L.Routing.Control
>(createRoutingMachineLayer);

export default RoutingMachine;
