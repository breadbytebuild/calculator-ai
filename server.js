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
  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: req.body.prompt,
        }
      }
    );
    res.json({ imageUrl: output[0] });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
