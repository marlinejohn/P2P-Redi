// index.js
const http = require('http');
const url = require('url');
const fs = require('fs').promises; // Using promises version of fs for async/await

const dbFilePath = 'db.json';

const getDataFromFile = async () => {
    try {
        const data = await fs.readFile(dbFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveDataToFile = async (data) => {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2));
};

const addPet = async (req, res) => {
    let data = await getDataFromFile();

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        const newPet = JSON.parse(body);
        newPet.id = data.length + 1;
        data.push(newPet);

        await saveDataToFile(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newPet));
    });
};

const getAllPets = async (res) => {
    const data = await getDataFromFile();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

