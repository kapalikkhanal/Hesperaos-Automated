const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs').promises;
require('dotenv').config();

const { renderVideo } = require('./modules/remotion/render');
const { PostToTiktok, getCookies } = require('./modules/tiktok/tiktok');

const app = express();
const PORT = process.env.PORT || 3003;

// Paraphrase content
const askGemini = async (content) => {
    try {
        const response = await axios.post('https://gemini-uts6.onrender.com/api/askgemini', {
            text: `Generate a random, unique quote of no more than 30 words about love, life, success, or motivation. Avoid repeating themes or phrases. Use vivid imagery, fresh metaphors, and a distinctive perspective.

By emphasizing diversity in themes and expression, the AI will produce more varied results. For example:

Love blooms where trust waters the soil.
Success whispers in the silence after failure's roar.
Life dances in the rain, not waiting for sunshine.
Motivation burns brightest in the darkest hours of doubt.`
        });
        return response.data.response || content;
    } catch (error) {
        console.error('Paraphrasing error:', error.message);
        return content;
    }
};

const postQuotes = async () => {
    try {
        const quotes = await askGemini();
        const videoPath = await renderVideo({
            video: '/videos/video.mp4',
            quotes,
            imageUrl: "https://kapalik.com"
        });
        console.log("Path", videoPath);
        await PostToTiktok(videoPath);
        console.log('Posted Sucessfully.');
    } catch (error) {
        console.error('Error rendering video:', error.message);
    }
};

// Manual trigger endpoint
app.get('/trigger-quotes', async (req, res) => {
    try {
        await postQuotes();
        res.json({ message: 'Quotes posting completed successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Quotes posting failed',
            error: error.message
        });
    }
});

cron.schedule('0 */1 * * *', postQuotes);

// getCookies('https://www.tiktok.com/login', 'tiktok')

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Initial quotes postingjob starting...');
    postQuotes(); // Initial run on startup
});