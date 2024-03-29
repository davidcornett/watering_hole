import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from './us-states.js';



//for dynamic data, use this:
/*
const getMaxStudents = (geoJsonData) => {
  // Assuming 'density' represents the number of students
  return Math.max(...geoJsonData.features.map(feature => feature.properties.density));
};
*/
const getTotalStudents = (geoJsonData) => {
  return geoJsonData.features.reduce((total, feature) => total + feature.properties.density, 0);
};

const getColor = (density, totalStudents) => {
  const thresholds = [0.85, 0.6, 0.2, 0.05, 0.02];

  const colors = ['#800026', '#BD0026', '#FC4E2A', '#FEB24C', '#FED976'];
  //const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0', 'rgba(0, 0, 0, 0)'];

  for (let i = 0; i < thresholds.length; i++) {
    if (density > thresholds[i] * totalStudents) return colors[i];
  }
  if (density > 0)
    return '#FFEDA0'

  return 'rgba(0, 0, 0, 0)';
};

const updateGeoJsonWithMapData = (geoJson, mapData) => {
  const updatedFeatures = geoJson.features.map(feature => {
    const stateAbbreviation = feature.properties.name;
    const newValue = mapData[stateAbbreviation];
    return {
      ...feature,
      properties: {
        ...feature.properties,
        density: newValue || feature.properties.density
      }
    };
  });

  return { ...geoJson, features: updatedFeatures };
};


/*

const getColor = (d) => {
  // Define color scale
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
         d > 0    ? '#FFEDA0' :
                    'rgba(0, 0, 0, 0)';  // Clear 
};
*/

const baseStyle = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };


const style = (feature, maxStudents) => {
  return {
    ...baseStyle,
    fillColor: getColor(feature.properties.density, maxStudents)
  };
};

const highlightFeature = (e) => {
    var layer = e.target;
    layer.setStyle({
      fillOpacity: 1
    });
  };

const defaultStyle = { ...baseStyle };
  
const resetHighlight = (e) => {
    e.target.setStyle(defaultStyle);
};

const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: (e) => resetHighlight(e, layer)
    });
  };

const USChoroplethMap = ({ mapData, universityName, schoolCoords, isMobile }) => {
  const updatedStatesData = mapData ? updateGeoJsonWithMapData(statesData, mapData) : statesData;
  const zoomLevel = isMobile ? 3 : 4;

  const icon = new L.Icon({
    iconUrl: './marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const mapKey = `map-${universityName}`;

  const maxStudents = getTotalStudents(updatedStatesData);

  return (
    <MapContainer center={[37.8, -96]} zoom={zoomLevel} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON key={mapKey} data={updatedStatesData} style={(feature) => style(feature, maxStudents)} onEachFeature={onEachFeature} />
      {schoolCoords && 
        <Marker position={[schoolCoords.lon, schoolCoords.lat]} icon={icon}>
        <Popup>{universityName}</Popup>
        </Marker>
      }
    </MapContainer>
  );
};

export default USChoroplethMap;
