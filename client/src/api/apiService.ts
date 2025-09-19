import axios from 'axios';
import { ApiResponse, ProcessedData } from '@my-app/models'; // <-- Importing from models!

// This points to our Express server
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchProcessedData = async (): Promise<ApiResponse<ProcessedData>> => {
  const { data } = await apiClient.get<ApiResponse<ProcessedData>>('/processed-data');
  return data;
};