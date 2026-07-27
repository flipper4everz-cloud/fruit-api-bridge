
const express = require('express');
const app = express();

app.use(express.json());

let currentFruitServer = {
    placeId: 0,
    jobId: "",
    fruitName: "",
    timestamp: 0
};

app.post('/update-fruit', (req, res) => {
    const data = req.body;
    if (data && data.jobId && data.fruitName) {
        currentFruitServer = {
            placeId: data.placeId || 0,
            jobId: data.jobId,
            fruitName: data.fruitName,
            timestamp: Date.now()
        };
        return res.status(200).json({ status: "Success", message: "Fruit server saved." });
    }
    res.status(400).json({ status: "Error", message: "Invalid data format." });
});

app.get('/get-fruit-server', (req, res) => {
    res.status(200).json(currentFruitServer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fruit API Bridge running on port ${PORT}`);
});
