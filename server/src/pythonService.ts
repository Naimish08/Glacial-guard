import axios from 'axios';
import { ProcessedData } from '../../models/src'; // <-- Importing from the shared models!

const PYTHON_API_URL = 'http://localhost:5001';

export const fetchProcessedDataFromPython = async (): Promise<ProcessedData> => {
  const { data } = await axios.get<ProcessedData>(`${PYTHON_API_URL}/process-data`);
  return data;
};