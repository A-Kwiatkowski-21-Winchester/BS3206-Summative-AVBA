require('dotenv').config();
const cors = require('cors');
const express = require('express');

const mentalHealthRoutes = require("./routes/mentalHealthRoutes")


PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
let env;
try {
    env = require('./env/environment');
} catch {
    console.error("Unable to load './env/environment.js'. Have you filled out the template and renamed it?");
}





app.use('/api/mentalhealth', mentalHealthRoutes)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});