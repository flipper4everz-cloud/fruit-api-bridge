const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());

let fruitServers = [];

-- PASTE YOUR DISCORD WEBHOOK URL INSIDE THE QUOTES BELOW
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1531298819013345440/ajfMvJxA3fipdBSfK4oRfWqq2n2ySrYcnQRNtrQb3r7x3z7ic77RD0T0ctTbR2SU6xVP";

function sendToDiscord(fruitName, jobId) {
    if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.includes("discord.com")) {
        console.log("❌ DISCORD ERROR: Webhook URL is invalid or missing!");
        return;
    }

    // Safely encode the payload using JSON.stringify to prevent invalid JSON errors
    const payload = JSON.stringify({
        content: `🎯 **New Fruit Found!**\n**Fruit:** ${String(fruitName)}\n**Job ID:** \`${String(jobId)}\``
    });

    const url = new URL(DISCORD_WEBHOOK_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
            responseBody += chunk;
        });
        res.on('end', () => {
            if (res.statusCode !== 204 && res.statusCode !== 200) {
                console.log(`❌ Discord Error Status ${res.statusCode}: ${responseBody}`);
            } else {
                console.log("✅ Successfully sent message to Discord!");
            }
        });
    });

    req.on('error', (error) => {
        console.error("❌ HTTPS Request to Discord Failed:", error);
    });

    req.write(payload);
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

        console.log(`Received report for: ${data.fruitName}`);
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
