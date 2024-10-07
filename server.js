require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');

const app = express();
app.use(cors());
app.use(express.json());

// Make sure you're using 'REPLICATE_API_TOKEN', not 'REACT_APP_REPLICATE_API_TOKEN'
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/generate-image', async (req, res) => {
  console.log('Received request to generate image with prompt:', req.body.prompt);
  console.log('Making API call to Replicate...');
  
  try {
    const startTime = Date.now();
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: req.body.prompt,
        }
      }
    );
    const endTime = Date.now();
    
    console.log('Received response from Replicate');
    console.log('API call duration:', (endTime - startTime) / 1000, 'seconds');
    console.log('Generated image URL:', output[0]);
    
    res.json({ imageUrl: output[0] });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 3001;
// Instead of app.listen(), use:
module.exports = app;
