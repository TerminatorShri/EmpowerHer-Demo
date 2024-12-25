import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Container style for the map
const containerStyle = {
  width: '100%',
  height: '400px',
};

function Map({ location }) {
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      setMapCenter({ lat, lng });
    }
  }, [location]);

  if (!mapCenter) return <div>Loading map...</div>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;