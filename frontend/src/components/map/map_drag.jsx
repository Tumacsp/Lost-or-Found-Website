import React, { useEffect, useRef } from "react";

const MapDragLaLongComponent = ({ onLocationChange, initialLocation }) => {
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent reloading if map already exists

    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=${process.env.REACT_APP_LONGDO_MAP_KEY}`;
      script.async = true;

      script.onload = () => {
        const map = new window.longdo.Map({
          placeholder: document.getElementById("map"),
          zoom: 10,
          location: { lon: initialLocation.lon, lat: initialLocation.lat },
          lastView: false,
          center: { lon: initialLocation.lon, lat: initialLocation.lat },
        });

        map.location({ lon: initialLocation.lon, lat: initialLocation.lat }, true);
        mapRef.current = map;

        const marker = new window.longdo.Marker(
          {
            lon: initialLocation.lon,
            lat: initialLocation.lat,
          },
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
      mapRef.current = null;
    };
  }, []); // Remove initialLocation from dependencies

  // Update marker position when initialLocation changes
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.location({
        lon: initialLocation.lon,
        lat: initialLocation.lat,
      });
    }
  }, [initialLocation]);

  return (
    <div className="w-full space-y-4">
      <div
        id="map"
        className="h-96 w-full rounded-xl shadow-md border border-gray-200"
      />
      <p className="text-sm text-gray-700 px-4 py-2 bg-gray-100 rounded-md">
        📍 Drag the marker on the map to select location
      </p>
    </div>
  );
};

MapDragLaLongComponent.defaultProps = {
  initialLocation: {
    lat: 13.764953,
    lon: 100.538316,
  },
};

export default MapDragLaLongComponent;
