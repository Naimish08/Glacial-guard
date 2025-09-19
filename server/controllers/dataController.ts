import { Request, Response } from 'express';
import { fetchProcessedDataFromPython } from '../services/pythonService';
import { ApiResponse, ProcessedData } from '@my-app/models'; // <-- Importing from models!

export const getProcessedData = async (req: Request, res: Response<ApiResponse<ProcessedData>>) => {
  try {
    const data = await fetchProcessedDataFromPython();
    res.status(200).json({ message: 'Successfully fetched data from Python service', data });
  } catch (error) {
    console.error('Error in getProcessedData:', error);
    res.status(500).json({ message: 'Error communicating with Python service', data: null });
  }
};