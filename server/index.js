require('dotenv').config();

const express = require('express');

PORT = process.env.PORT || 4000;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello universe!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});