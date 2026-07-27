const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());

let fruitServers = [];

// PASTE YOUR DISCORD WEBHOOK URL INSIDE THE QUOTES BELOW
const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL_HERE";

function sendToDiscord(fruitName, jobId) {
    if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.includes("discord.com")) return;

    const data = JSON.stringify({
        content: `🎯 **New Fruit Found!**\n**Fruit:** ${fruitName}\n**Job ID:** \`${jobId}\``
    });

    const url = new URL(DISCORD_WEBHOOK_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', () => {});
    });

    req.on('error', (error) => {
        console.error("Discord Webhook Error:", error);
    });

    req.write(data);
    req.end();
}

app.post('/update-fruit', (req, res) => {
    const data = req.body;
    
    if (data && data.jobId && data.fruitName) {
        fruitServers = fruitServers.filter(s => s.jobId !== data.jobId);
        
        fruitServers.unshift({
            placeId: data.placeId || 10263880,
            jobId: data.jobId,
            fruitName: data.fruitName,
            timestamp: Date.now()
        });
        
        if (fruitServers.length > 10) {
            fruitServers.pop();
        }

        // Trigger Discord notification safely
        sendToDiscord(data.fruitName, data.jobId);
        
        return res.status(200).json({ status: "Success", message: "Server saved and notified Discord." });
    }
    res.status(400).json({ status: "Error", message: "Invalid data format." });
});

app.get('/get-fruit-servers', (req, res) => {
    res.status(200).json(fruitServers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fruit API Bridge running on port ${PORT}`);
});
