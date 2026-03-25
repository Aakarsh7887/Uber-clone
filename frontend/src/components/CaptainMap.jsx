import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const CaptainMap = ({ ride }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const captainMarker = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.1025, 28.7041],
      zoom: 14,
    });

    captainMarker.current = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([77.1025, 28.7041])
      .addTo(map.current);
  }, []);

  // 📍 Live location tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      if (captainMarker.current) {
        captainMarker.current.setLngLat([longitude, latitude]);
      }

      map.current.flyTo({
        center: [longitude, latitude],
        speed: 1.2,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🛣️ Draw route when ride comes
  useEffect(() => {
    if (!ride || !map.current) return;

    const fetchRoute = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time?origin=${ride.pickup}&destination=${ride.destination}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      // 👇 Make sure backend returns geometry
      if (!data.geometry) return;

      if (map.current.getSource("route")) {
        map.current.getSource("route").setData({
          type: "Feature",
          geometry: data.geometry,
        });
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: data.geometry,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#000",
            "line-width": 4,
          },
        });
      }
    };

    fetchRoute();
  }, [ride]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default CaptainMap;
