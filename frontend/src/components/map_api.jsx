import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2702/2702604.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MapComponent = ({ onLocationChange }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([13.764953, 100.538316], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    const marker = L.marker([13.764953, 100.538316], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    onLocationChange({ lat: 13.764953, lon: 100.538316 });

    marker.on("dragend", (event) => {
      const position = event.target.getLatLng();
      onLocationChange({ lat: position.lat, lon: position.lng });
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
      newMarker.on("dragend", (event) => {
        const position = event.target.getLatLng();
        onLocationChange({ lat: position.lat, lon: position.lng });
      });

      markerRef.current = newMarker;
      onLocationChange({ lat, lon: lng });
    });
  }, [onLocationChange]); // ✅ ไม่ใส่ mapRef.current ใน dependency list

  return (
    <div className="w-full space-y-4">
      <div
        id="map"
        className="h-64 w-full rounded-xl shadow-md border border-gray-200"
      />
      <p className="text-sm text-gray-700 px-4 py-2 bg-gray-100 rounded-md">
        📍 คลิกที่แผนที่เพื่อเลือกตำแหน่ง หรือ ลากหมุดเพื่อปรับตำแหน่ง
      </p>
    </div>
  );
};

export default MapComponent;
