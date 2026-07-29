const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PERSONAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1531298819013345440/ajfMvJxA3fipdBSfK4oRfWqq2n2ySrYcnQRNtrQb3r7x3z7ic77RD0T0ctTbR2SU6xVP";

app.post('/webhook', async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ status: "no data" });
    }

    let content = data.content || "";

    // Grab text from embeds if present (crucial for webhooks)
    if (data.embeds) {
        data.embeds.forEach(embed => {
            let title = embed.title || "";
            let description = embed.description || "";
            let fieldsText = "";
            if (embed.fields) {
                fieldsText = embed.fields.map(f => `${f.name || ""} ${f.value || ""}`).join(" ");
            }
            content += ` ${title} ${description} ${fieldsText}`;
        });
    }

    console.log(`[CAUGHT WEBHOOK CONTENT]: ${content}`);

    // Search for a Roblox Job ID (UUID format)
    const jobIdRegex = /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;
    const match = content.match(jobIdRegex);

    if (match) {
        const jobId = match[1];
        let fruitName = "Unknown Fruit";

        const trackedFruits = [
            "Leopard", "Dough", "Dragon", "Kitsune", "Venom", 
            "Spirit", "T-Rex", "Mammoth", "Shadow", 
            "Buddha", "Portal", "Lightning", "Rumble", "fruit"
        ];

        for (const fruit of trackedFruits) {
            if (content.toLowerCase().includes(fruit.toLowerCase())) {
                fruitName = fruit.toLowerCase() === "fruit" ? "Fruit Spawn" : fruit.charAt(0).toUpperCase() + fruit.slice(1);
                break;
            }
        }

        console.log(`[PARSED] Fruit: ${fruitName} | JobID: ${jobId}`);

        // Send alert directly to your personal Discord server webhook
        try {
            await axios.post(PERSONAL_WEBHOOK_URL, {
                content: `🚨 **Gengar Notifier Alert!**\n**Fruit:** ${fruitName}\n**Job ID:** \`${jobId}\``
            });
            console.log("[DISCORD] Alert sent to your webhook!");
        } catch (error) {
            console.error(`[ERROR] Failed to ping Discord webhook: ${error.message}`);
        }
    }

    return res.status(200).json({ status: "success" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[INFO] Server running on port ${PORT}`);
});
