import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from './us-states.js';


/*
for dynamic data, use this:
const getMaxStudents = (geoJsonData) => {
  // Assuming 'density' represents the number of students
  return Math.max(...geoJsonData.features.map(feature => feature.properties.density));
};

const getColor = (density, maxStudents) => {
  const thresholds = [maxStudents * 0.5, maxStudents * 0.3, maxStudents * 0.1, 50, 20, 10, 5, 0];
  const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];

  for (let i = 0; i < thresholds.length; i++) {
    if (density > thresholds[i]) return colors[i];
  }

  return colors[colors.length - 1];
};
*/
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




const getColor = (d) => {
  // Define color scale
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
};

const baseStyle = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };

const style = (feature) => {
  return {
    ...baseStyle,
    fillColor: getColor(feature.properties.density)
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

const USChoroplethMap = ({ mapData, universityName }) => {
  const updatedStatesData = mapData ? updateGeoJsonWithMapData(statesData, mapData) : statesData;
  //const updatedStatesData = updateGeoJsonWithMapData(statesData, mapData);

  //const mapKey = mapData ? 'updated-map' : 'initial-map';
  const mapKey = `map-${universityName}`;


  return (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON key={mapKey} data={updatedStatesData} style={style} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default USChoroplethMap;
