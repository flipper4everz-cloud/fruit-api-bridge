const express = require('express');
const app = express();

app.use(express.json());

let fruitServers = [];

app.post('/update-fruit', (req, res) => {
    const data = req.body;
    console.log("Received POST data:", data); // Check Render logs to see what's coming in
    
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
        
        return res.status(200).json({ status: "Success", message: "Server saved." });
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
