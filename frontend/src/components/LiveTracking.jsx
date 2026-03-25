import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const LiveTracking = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [currentPosition, setCurrentPosition] = useState({
    lng: 77.1025, // default (India)
    lat: 28.7041,
  });

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [currentPosition.lng, currentPosition.lat],
      zoom: 15,
    });

    // Add Marker
    marker.current = new mapboxgl.Marker()
      .setLngLat([currentPosition.lng, currentPosition.lat])
      .addTo(map.current);
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentPosition({
          lat: latitude,
          lng: longitude,
        });

        if (marker.current) {
          marker.current.setLngLat([longitude, latitude]);
        }

        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            speed: 1.2,
          });
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default LiveTracking;
