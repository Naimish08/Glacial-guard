import { Request, Response } from 'express';

// Hardcoded mock data - no Python service needed
export const getProcessedData = async (req: Request, res: Response) => {
  try {
    const mockData = {
      message: 'Successfully fetched hardcoded data',
      data: {
        lakes: [
          {
            lakeId: "UK_001_Chorabari",
            name: "Chorabari Tal",
            region: "Uttarakhand",
            coordinates: { lat: 30.7194, lng: 79.0669 },
            currentRisk: 0.72,
            lastAssessment: new Date().toISOString(),
            downstreamVillages: ["Kedarnath", "Gaurikund", "Phata"]
          },
          {
            lakeId: "UK_002_Gandhi",
            name: "Gandhi Sarovar",
            region: "Uttarakhand", 
            coordinates: { lat: 30.8456, lng: 79.1234 },
            currentRisk: 0.45,
            lastAssessment: new Date().toISOString(),
            downstreamVillages: ["Bhojbasa", "Gangotri"]
          }
        ],
        timestamp: new Date().toISOString(),
        totalLakes: 2,
        highRiskCount: 1
      }
    };

    res.status(200).json(mockData);
  } catch (error: any) {
    console.error('Error in getProcessedData:', error);
    res.status(500).json({ 
      message: 'Error fetching data', 
      data: null 
    });
  }
};
