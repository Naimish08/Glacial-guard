// Simple hardcoded service - no axios, no Python calls
export const fetchProcessedDataFromPython = async () => {
  // Just return mock data immediately
  return {
    lakes: [
      {
        lakeId: "UK_001_Chorabari",
        name: "Chorabari Tal",
        region: "Uttarakhand",
        currentRisk: 0.72,
        lastAssessment: new Date().toISOString()
      }
    ],
    message: 'Hardcoded mock data',
    timestamp: new Date().toISOString()
  };
};
