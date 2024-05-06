require("dotenv").config();
const cors = require("cors");
const express = require("express");

const userRoutes = require("./routes/users");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());


//routes
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
