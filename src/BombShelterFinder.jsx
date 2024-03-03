import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export function BombShelterFinder() {
  // State for storing the user's current coordinates
  const [coordinates, setCoordinates] = useState({ lat: 32.0853, lng: 34.7818 });
  // State for storing the list of nearby bomb shelters
  const [shelters, setShelters] = useState([]);
  // Map zoom level
  const zoom = 14;

  // Load the Google Maps and Places API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYzzilbQJYvB7y01g15Cy3Lj9ZvWod_RI", // Replace with your actual Google Maps API key
    libraries: ["places"],
  });

  // Callback function to fetch nearby bomb shelters using the Google Places API
  const fetchShelters = useCallback(
    map => {
      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: new google.maps.LatLng(coordinates.lat, coordinates.lng),
        radius: "2000", // Search within a 2000 meter radius
        keyword: "מקלט", // Search keyword (Hebrew for "shelter")
      };

      // Perform the nearby search and update the shelters state with the results
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const newShelters = results.map(place => ({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }));
          setShelters(newShelters);
        }
      });
    },
    [coordinates] // Re-run the callback when the user's coordinates change
  );

  // Effect hook to get the user's current location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude }); // Update coordinates state
      },
      error => console.error(error)
    );
  }, []);

  // Styles for the map container
  const mapContainerStyle = {
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={{ margin: "auto" }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates}
          zoom={zoom}
          onLoad={fetchShelters} // Fetch shelters once the map has loaded
        >
          {/* Marker for the user's current location */}
          <Marker
            position={coordinates}
            icon={{
              url: "/man.png", // Custom icon for the user's location
              scaledSize: new google.maps.Size(40, 40), // Scale the custom icon
            }}
          />

          {/* Markers for the bomb shelters */}
          {shelters.map((shelter, index) => (
            <Marker key={index} position={{ lat: shelter.lat, lng: shelter.lng }} label={shelter.text} />
          ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div> // Display loading message until the Google Maps API has loaded
      )}
    </div>
  );
}
