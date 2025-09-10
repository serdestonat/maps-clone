"use client";
import { createControlComponent } from "@react-leaflet/core";
import L, { LatLng } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "lrm-graphhopper";

// GraphHopper API key'inizi buraya ekleyin (güvenlik için .env'den çekin)
const GRAPH_HOPPER_API_KEY = process.env.NEXT_PUBLIC_GRAPH_HOPPER_API_KEY;

// RoutingMachineProps arayüzünü tanımla
interface RoutingMachineProps {
  waypoints: LatLng[];
  routeType: "car" | "foot"; // Rota türünü zorunlu hale getir
}

// createRoutingMachineLayer fonksiyonu
const createRoutingMachineLayer = ({
  waypoints,
  routeType,
}: RoutingMachineProps) => {
  const router = L.Routing.graphHopper(GRAPH_HOPPER_API_KEY, {
    urlParameters: {
      vehicle: routeType, // 'car' veya 'foot'
    },
  });

  return L.Routing.control({
    waypoints,
    router,
    routeWhileDragging: true,
    lineOptions: {
      styles: [{ color: "#0066ff", weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 1,
    },
    show: true,
    showAlternatives: true,
    addWaypoints: false,
    fitSelectedRoutes: true,
    collapsible: false,
  });
};

// createControlComponent ile RoutingMachine bileşenini oluştur
const RoutingMachine = createControlComponent<
  RoutingMachineProps,
  L.Routing.Control
>(createRoutingMachineLayer);

export default RoutingMachine;
