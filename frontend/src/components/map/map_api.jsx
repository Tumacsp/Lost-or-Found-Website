import React, { useEffect, useRef } from "react";

const MapComponent = ({ onLocationChange }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=${process.env.REACT_APP_LONGDO_MAP_KEY}`;
      script.async = true;

      script.onload = () => {
        const map = new window.longdo.Map({
          placeholder: document.getElementById("map"),
          zoom: 13,
          location: { lon: 100.538316, lat: 13.764953 },
        });

        const marker = new window.longdo.Marker(
          { lon: 100.538316, lat: 13.764953 },
          {
            title: "ตำแหน่งที่เลือก",
            draggable: true,
          }
        );
        map.Overlays.add(marker);
        markerRef.current = marker;

        // Handle marker drag
        map.Event.bind("overlayDrop", (overlay) => {
          if (overlay === marker) {
            const position = overlay.location();
            onLocationChange({
              lat: position.lat,
              lon: position.lon,
            });
          }
        });

        // Handle map click
        map.Event.bind("click", (overlay, location) => {
          if (!location) return;

          // Remove existing marker
          if (markerRef.current) {
            map.Overlays.remove(markerRef.current);
          }

          // Add new marker
          const newMarker = new window.longdo.Marker(
            { lon: location.lon, lat: location.lat },
            {
              title: "ตำแหน่งที่เลือก",
              draggable: true,
            }
          );
          map.Overlays.add(newMarker);
          markerRef.current = newMarker;

          onLocationChange({
            lat: location.lat,
            lon: location.lon,
          });

          map.Event.bind("overlayDrop", (overlay) => {
            if (overlay === newMarker) {
              const position = overlay.location();
              onLocationChange({
                lat: position.lat,
                lon: position.lon,
              });
            }
          });
        });
      };

      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      const script = document.querySelector(
        `script[src*="api.longdo.com/map"]`
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [onLocationChange]);

  return (
    <div className="w-full space-y-4">
      <div
        id="map"
        className="h-64 w-full rounded-xl shadow-md border border-gray-200"
      />
      <p className="text-sm text-gray-700 px-4 py-2 bg-gray-100 rounded-md">
        📍 Drag the marker on the map to select location
      </p>
    </div>
  );
};

export default MapComponent;
