import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import Navbar from "../Nav";
import Footer from '../Footer';
import './styles.css'
import imag from './icons/ups.png'
import u from './icons/ups.png'

const customIcon = new L.Icon({
  iconUrl: u,
  iconSize: [38, 38]
});

const Leaf = () => {
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([13.0299, 80.1681]);
  const zoomLevel = 15;

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      /* window.location.reload(); */
      fetch("http://172.22.81.182:8080/rfid/getloc/14")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Data is an array, update the state with fetched data
          setLocations(data);

          // Calculate the average latitude and longitude
          const totalLat = data.reduce((sum, location) => sum + location.lat, 0);
          const totalLon = data.reduce((sum, location) => sum + location.lon, 0);
          const avgLat = totalLat / data.length;
          const avgLon = totalLon / data.length;

          // Set the map center to the average coordinates
          setMapCenter([avgLat, avgLon]);
        } else if (typeof data === "object" && data.lat && data.lon) {
          // Data is an object with latitude and longitude properties
          // Set the map center based on this location
          setLocations([data]);
          setMapCenter([data.lat, data.lon]);
        } else {
          console.error("API response is not in the expected format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }, 2000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div className=" md:w-auto md:h-auto">
      <Navbar />
      <div className="App md:w-auto md:h-auto min-h-screen">
        <MapContainer center={mapCenter} zoom={zoomLevel} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lon]}
              icon={customIcon}
            />
          ))}
        </MapContainer>
        <div className="w-50 flex justify-end mr-24 -translate-y-72 box-border w-50">
        </div>
      </div>
      <Footer />
    </div>
  );
};

let DefaultIcon = L.icon({
  iconUrl: imag,
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default Leaf;
