require('dotenv').config();
const cors = require('cors');

const express = require('express');

PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello universe!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});