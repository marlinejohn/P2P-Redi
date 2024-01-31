// index.js
const http = require('http');
const url = require('url');
const fs = require('fs').promises; // Using promises version of fs for async/await

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

const addPet = async (req, res) => {
    let data = await getData();

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        const newPet = JSON.parse(body);
        newPet.id = data.length + 1;
        data.push(newPet);

        await saveData(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newPet));
    });
};

const getAllPets = async (res) => {
    const data = await getData();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;

    if (path === '/pets' && req.method === 'GET') {
        await getAllPets(res);
    } else if (path === '/pets' && req.method === 'POST') {
        await addPet(req, res);
    }
});

const port = 2000;

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
});
