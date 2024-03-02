import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export function BombShelterFinder() {
  const [coordinates, setCoordinates] = useState({ lat: 32.0853, lng: 34.7818 });
  const [shelters, setShelters] = useState([]);
  const zoom = 14;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYzzilbQJYvB7y01g15Cy3Lj9ZvWod_RI",
    libraries: ["places"],
  });

  const fetchShelters = useCallback(
    map => {
      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: new google.maps.LatLng(coordinates.lat, coordinates.lng),
        radius: "2000",
        keyword: "מקלט",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const newShelters = results.map(place => ({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            text: "Bomb Shelter",
          }));
          setShelters(newShelters);
        }
      });
    },
    [coordinates]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
      },
      error => console.error(error)
    );
  }, []);

  const mapContainerStyle = {
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={{ margin: "auto" }}>
      {isLoaded ? (
        <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates} zoom={zoom} onLoad={fetchShelters}>
          {/* User's Location */}
          <Marker position={coordinates} label='You are here' />

          {/* Bomb Shelters */}
          {shelters.map((shelter, index) => (
            <Marker key={index} position={{ lat: shelter.lat, lng: shelter.lng }} label={shelter.text} />
          ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
