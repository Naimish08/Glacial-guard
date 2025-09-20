import { GeoJsonObject } from 'geojson';

export const himalayanRegions: GeoJsonObject = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Khumbu Glacier",
        "status": "safe",
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
        },
        "center": [27.995, 86.835], // [lat, lng]
        "radius": 3000 // in meters
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
        },
        "center": [30.935, 79.093], // [lat, lng]
        "radius": 3000 // in meters
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
        },
        "center": [27.755, 88.243], // [lat, lng]
        "radius": 3000 // in meters
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
        },
        "center": [35.490, 77.045], // [lat, lng]
        "radius": 3000 // in meters
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
        },
        "center": [28.020, 86.710], // [lat, lng]
        "radius": 3000 // in meters
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
        },
        "center": [27.903, 86.938], // [lat, lng]
        "radius": 3000 // in meters
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
    }, // <--- ADD THIS COMMA
    {
      "type": "Feature",
      "properties": {
        "name": "Bara Shigri Glacier",
        "status": "watch",
        "elevation": "5000m",
        "country": "India",
        "riskFactors": ["melting", "moraine instability"],
        "lastUpdated": "2025-09-11",
        "area": "1.0 km²",
        "volume": "45 million m³",
        "temperature": "-1.9°C",
        "morainCondition": {
          "stability": "Unstable",
          "thickness": "20-35m",
          "composition": "Ice and debris"
        },
        "center": [32.200, 77.580],
        "radius": 6300
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.570, 32.190],
          [77.590, 32.190],
          [77.590, 32.210],
          [77.570, 32.210],
          [77.570, 32.190]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Baspa Glacier",
        "status": "safe",
        "elevation": "4700m",
        "country": "India",
        "riskFactors": ["debris cover", "slow retreat"],
        "lastUpdated": "2025-09-11",
        "area": "0.6 km²",
        "volume": "20 million m³",
        "temperature": "-1.5°C",
        "morainCondition": {
          "stability": "Stable",
          "thickness": "15-25m",
          "composition": "Rocky debris"
        },
        "center": [31.350, 78.400],
        "radius": 3300
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.390, 31.340],
          [78.410, 31.340],
          [78.410, 31.360],
          [78.390, 31.360],
          [78.390, 31.340]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Durung-Drung Glacier",
        "status": "watch",
        "elevation": "5200m",
        "country": "India",
        "riskFactors": ["glacial retreat", "ice loss"],
        "lastUpdated": "2025-09-11",
        "area": "0.9 km²",
        "volume": "42 million m³",
        "temperature": "-2.0°C",
        "morainCondition": {
          "stability": "Unstable",
          "thickness": "25-35m",
          "composition": "Mixed debris"
        },
        "center": [33.790, 76.280],
        "radius": 4700
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.270, 33.780],
          [76.290, 33.780],
          [76.290, 33.800],
          [76.270, 33.800],
          [76.270, 33.780]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Rongbuk Glacier",
        "status": "danger",
        "elevation": "5100m",
        "country": "Tibet",
        "riskFactors": ["GLOF risk", "ice collapse"],
        "lastUpdated": "2025-09-11",
        "area": "1.1 km²",
        "volume": "48 million m³",
        "temperature": "-2.2°C",
        "morainCondition": {
          "stability": "Critical",
          "thickness": "30-45m",
          "composition": "Loose debris"
        },
        "center": [28.120, 86.850],
        "radius": 5200
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [86.840, 28.110],
          [86.860, 28.110],
          [86.860, 28.130],
          [86.840, 28.130],
          [86.840, 28.110]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Samudra Tapu Glacier",
        "status": "watch",
        "elevation": "5050m",
        "country": "India",
        "riskFactors": ["climate variability", "ice melt"],
        "lastUpdated": "2025-09-11",
        "area": "0.8 km²",
        "volume": "33 million m³",
        "temperature": "-1.7°C",
        "morainCondition": {
          "stability": "Moderate",
          "thickness": "20-30m",
          "composition": "Ice and gravel"
        },
        "center": [32.475, 77.490],
        "radius": 5590
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.480, 32.465],
          [77.500, 32.465],
          [77.500, 32.485],
          [77.480, 32.485],
          [77.480, 32.465]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Sonapani Glacier",
        "status": "safe",
        "elevation": "4950m",
        "country": "India",
        "riskFactors": ["minor melt"],
        "lastUpdated": "2025-09-11",
        "area": "0.4 km²",
        "volume": "15 million m³",
        "temperature": "-1.4°C",
        "morainCondition": {
          "stability": "Stable",
          "thickness": "10-15m",
          "composition": "Thin ice with rock cover"
        },
        "center": [32.440, 77.370],
        "radius": 2330
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.360, 32.430],
          [77.380, 32.430],
          [77.380, 32.450],
          [77.360, 32.450],
          [77.360, 32.430]
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