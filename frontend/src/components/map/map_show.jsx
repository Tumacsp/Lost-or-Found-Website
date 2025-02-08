import React, { useEffect, useRef } from "react";

const Map = ({ latitude, longitude, addressDetail }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=${process.env.REACT_APP_LONGDO_MAP_KEY}`;
      script.async = true;
      script.onload = () => {
        // สร้างแผนที่
        const map = new window.longdo.Map({
          placeholder: mapRef.current,
          zoom: 15,
          location: { lon: longitude, lat: latitude },
          lastView: false, // ไม่ใช้มุมมองล่าสุด
          center: { lon: longitude, lat: latitude }, // กำหนดจุดกึ่งกลาง
        });

        // เพิ่ม marker
        const marker = new window.longdo.Marker(
          { lon: longitude, lat: latitude },
          {
            title: "Location",
            visibleRange: { min: 7, max: 20 },
            draggable: false,
            weight: window.longdo.OverlayWeight.Top,
          }
        );
        map.Overlays.add(marker);

        // จัดกึ่งกลางแผนที่
        map.location({ lon: longitude, lat: latitude }, true);
        map.zoom(15, true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadScript();
  }, [latitude, longitude, addressDetail]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-inner"
    />
  );
};

export default Map;
