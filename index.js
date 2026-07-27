const express = require('express');
const app = express();

app.use(express.json());

let fruitServers = [];

// REPLACE THIS WITH YOUR ACTUAL DISCORD WEBHOOK URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1531294331279769732/bi_jMmv1ie1tU-vImLq4j5_Rs0tyjJimj3sjwGr25P_-W1sY3gtbrWJfiSipp_6B22O1";

app.post('/update-fruit', async (req, res) => {
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

        // Send notification to Discord
        if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.includes("discord.com")) {
            try {
                const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
                await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `🎯 **New Fruit Found!**\n**Fruit:** ${data.fruitName}\n**Job ID:** \`${data.jobId}\``
                    })
                });
            } catch (err) {
                console.error("Failed to send Discord webhook:", err);
            }
        }
        
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
"dependencies": {
  "express": "^4.18.2",
  "node-fetch": "^2.6.7"
}
