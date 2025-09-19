// The shape of data coming from the Python service
export interface ProcessedData {
  result: string;
  timestamp: number;
}

// A generic API response structure used by the Express server
export interface ApiResponse<T> {
  message: string;
  data: T | null;
}