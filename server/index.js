require("dotenv").config();
const cors = require("cors");
const express = require("express");
/** @type {import("express").RequestHandler} */

const userRoutes = require("./routes/users");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());


//routes
app.use('/api/users', userRoutes);

// Last resort route
app.use('/', function(req, res) {
  console.log("Connection")
  // res
  res.status(404)
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
