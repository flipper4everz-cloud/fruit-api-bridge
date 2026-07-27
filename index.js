const express = require('express');
const app = express();

app.use(express.json());

// Store a list of reported fruit servers
let fruitServers = [];

// POST: Receives data when a fruit is found
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
        
        console.log(`Fruit logged: ${data.fruitName} in server ${data.jobId}`);
        return res.status(200).json({ status: "Success", message: "Server saved." });
    }
    res.status(400).json({ status: "Error", message: "Invalid data format." });
});

// GET: This creates the /get-fruit-servers endpoint on your URL
app.get('/get-fruit-servers', (req, res) => {
    res.status(200).json(fruitServers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fruit API Bridge running on port ${PORT}`);
});
