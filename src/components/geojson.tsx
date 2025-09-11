import { GeoJsonObject } from 'geojson';

export const himalayanRegions: GeoJsonObject = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Khumbu Glacier",
        "status": "danger",
        "riskScore": 85,
        "elevation": "4900m",
        "country": "Nepal",
        "riskFactors": ["rapid melting", "GLOF risk"],
        "lastUpdated": "2025-09-11",
        "area": "0.85 km²",
        "volume": "35.2 million m³",
        "temperature": "-2.3°C",
        "morainCondition": {
          "stability": "Critical",
          "thickness": "25-40m",
          "composition": "Loose debris, ice core"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [86.8159, 27.9750],
          [86.8359, 27.9800],
          [86.8559, 27.9850],
          [86.8609, 28.0000],
          [86.8559, 28.0100],
          [86.8459, 28.0150],
          [86.8259, 28.0200],
          [86.8159, 28.0150],
          [86.8109, 28.0000],
          [86.8159, 27.9750]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Gangotri Glacier",
        "status": "watch",
        "elevation": "6100m",
        "country": "India",
        "riskFactors": ["retreating", "debris cover"],
        "lastUpdated": "2025-09-11",
        "area": "1.2 km²",
        "volume": "50 million m³",
        "temperature": "-1.8°C",
        "morainCondition": {
          "stability": "Stable",
          "thickness": "20-30m",
          "composition": "Debris-covered ice"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [79.0833, 30.9200],
          [79.1033, 30.9250],
          [79.1233, 30.9400],
          [79.1433, 30.9500],
          [79.1533, 30.9600],
          [79.1433, 30.9700],
          [79.1233, 30.9750],
          [79.1033, 30.9700],
          [79.0933, 30.9500],
          [79.0833, 30.9200]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zemu Glacier",
        "status": "safe",
        "elevation": "5300m",
        "country": "India",
        "riskFactors": ["stable", "monitored"],
        "lastUpdated": "2025-09-11",
        "area": "0.9 km²",
        "volume": "40 million m³",
        "temperature": "-2.0°C",
        "morainCondition": {
          "stability": "Stable",
          "thickness": "15-25m",
          "composition": "Ice with rock debris"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [88.2333, 27.7400],
          [88.2533, 27.7450],
          [88.2733, 27.7500],
          [88.2833, 27.7600],
          [88.2733, 27.7700],
          [88.2633, 27.7750],
          [88.2433, 27.7700],
          [88.2333, 27.7600],
          [88.2283, 27.7500],
          [88.2333, 27.7400]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Siachen Glacier",
        "status": "watch",
        "elevation": "5753m",
        "country": "India/Pakistan",
        "riskFactors": ["military presence", "climate change"],
        "lastUpdated": "2025-09-11",
        "area": "1.5 km²",
        "volume": "60 million m³",
        "temperature": "-2.5°C",
        "morainCondition": {
          "stability": "Critical",
          "thickness": "30-50m",
          "composition": "Loose debris, ice core"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.0159, 35.4750],
          [77.0359, 35.4800],
          [77.0559, 35.4900],
          [77.0759, 35.5000],
          [77.0659, 35.5150],
          [77.0459, 35.5200],
          [77.0259, 35.5150],
          [77.0159, 35.5000],
          [77.0109, 35.4900],
          [77.0159, 35.4750]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ngozumpa Glacier",
        "status": "danger",
        "elevation": "4700m",
        "country": "Nepal",
        "riskFactors": ["supraglacial lakes", "rapid melting"],
        "lastUpdated": "2025-09-11",
        "area": "0.7 km²",
        "volume": "30 million m³",
        "temperature": "-2.1°C",
        "morainCondition": {
          "stability": "Unstable",
          "thickness": "10-20m",
          "composition": "Ice with water pockets"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [86.6959, 28.0000],
          [86.7159, 28.0050],
          [86.7359, 28.0150],
          [86.7459, 28.0250],
          [86.7359, 28.0350],
          [86.7159, 28.0400],
          [86.7059, 28.0350],
          [86.6959, 28.0250],
          [86.6909, 28.0150],
          [86.6959, 28.0000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Imja Tsho",
        "status": "danger",
        "riskScore": 8.5,
        "elevation": "5010m",
        "country": "Nepal",
        "riskFactors": ["rapid melting", "moraine instability"],
        "lastUpdated": "2024-02-15",
        "area": "1.28 km²",
        "volume": "75.2 million m³",
        "temperature": "2.1°C",
        "morainCondition": {
          "stability": "Critical",
          "thickness": "25-40m",
          "composition": "Loose debris, ice core"
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [86.9285, 27.8989],
          [86.9385, 27.9089],
          [86.9485, 27.9089],
          [86.9485, 27.8989],
          [86.9385, 27.8889],
          [86.9285, 27.8989]
        ]]
      }
    }
  ]
};

export const floodCorridors: GeoJsonObject = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", 
      "properties": {
        "name": "Khumbu Flood Path",
        "parentLake": "Khumbu Glacier",
        "type": "floodpath",
        "timeToReach": "45-60 min",
        "width": "200-500m"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          // Coordinates following valley downstream
          [86.8159, 27.9000],
          [86.8259, 27.8800],
          [86.8359, 27.8600],
          [86.8459, 27.8400]
          // ... more coordinates following valley
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Imja Valley Corridor",
        "parentLake": "Imja Tsho",
        "type": "floodpath",
        "timeToReach": "45-60 min",
        "width": "200-500m"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [86.9285, 27.8589],
          [86.9385, 27.8389],
          [86.9485, 27.8189],
          [86.9485, 27.8089],
          [86.9385, 27.7989],
          [86.9285, 27.7889]
        ]]
      }
    }
  ]
};