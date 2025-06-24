const express = require('express');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, 'food-safety-463809-13bc2a9b92db.json') // Update with the correct path to your key file
});

// Endpoint to handle OCR requests
app.post('/vision-api', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Perform text detection
        const [result] = await client.textDetection({
            image: { content: image }
        });

        res.json({ textAnnotations: result.textAnnotations || [] });
    } catch (error) {
        console.error('Error during OCR:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
