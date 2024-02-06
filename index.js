const express = require('express');
const app = express();
const fs = require('fs').promises;
const port = 2000; 

// Middleware to parse JSON requests
app.use(express.json());

const dbFilePath = 'db.json';

const getData = async () => {
    try {
        const data = await fs.readFile(dbFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveData = async (data) => {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2));
};

app.post('/pets', async (req, res) => {
    const data = await getData();

    const newPet = req.body;
    newPet.id = data.length + 1;
    data.push(newPet);

    await saveData(data);

    res.status(200).json(newPet);
});

app.get('/pets', async (req, res) => {
    const data = await getData();
    res.status(200).json(data);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});


