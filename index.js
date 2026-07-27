const express = require('express');
const app = express();

// Middleware to parse incoming JSON bodies
app.use(express.json());

let fruitServers = [];

// POST: Receives data when a fruit is found
app.post('/update-fruit', (req, res) => {
    console.log("=== HIT POST /update-fruit ===");
    console.log("Headers:", req.headers);
    console.log("Body received:", req.body);
    
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
        
        return res.status(200).json({ status: "Success", message: "Server saved." });
    }
    
    console.log("Validation failed. Missing jobId or fruitName.");
    return res.status(400).json({ status: "Error", message: "Invalid data format." });
});

// GET: Returns active fruit servers
app.get('/get-fruit-servers', (req, res) => {
    res.status(200).json(fruitServers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fruit API Bridge running on port ${PORT}`);
});
