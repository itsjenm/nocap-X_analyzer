import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username } = req.body;

      // Send the request to the FastAPI backend to get Twitter data
      const response = await axios.post('http://127.0.0.1:8000/getUserData', {
        username,
      });

      // Return the user data if successful
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error analyzing sentiment and credibility:', error);

      // Handle rate limit error (429)
      if (error.response?.status === 429) {
        const resetTimestamp = error.response.headers['x-rate-limit-reset'];
        const resetDate = new Date(resetTimestamp * 1000); // Convert from seconds to milliseconds
        const retryAfter = resetDate.toLocaleString(); // Convert to human-readable format

        return res.status(429).json({
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: retryAfter, // Include the retry time in the response
        });
      }

      // Handle other errors (Axios error with response)
      if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json({
          message: error.response.data?.message || 'Error from FastAPI backend',
        });
      }

      // Generic error fallback
      res.status(500).json({ message: 'Error analyzing sentiment and credibility' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
