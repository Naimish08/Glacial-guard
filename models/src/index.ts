import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/predict', async (req, res) => {
  try {
    const { glacier_name, data } = req.body;

    if (!glacier_name || !Array.isArray(data) || data.length !== 12 || data[0].length !== 11) {
      return res.status(400).json({ error: "Invalid input: 'data' must be shape (12, 11)." });
    }

    const response = await axios.post('http://localhost:5001/predict', {
      glacier_name,
      data
    });

    res.json(response.data);
  } catch (err: any) {
    console.error('Error:', err.message);
    if (err.response) {
      res.status(err.response.status).json({ error: err.response.data?.error || 'Flask error' });
    } else {
      res.status(500).json({ error: 'Flask server unreachable' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
