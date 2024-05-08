require("dotenv").config();
const cors = require("cors");
const express = require("express");

const userRoutes = require("./routes/users");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  console.log("Incoming request for:", req.path)
  next()
})

//routes
app.use('/api/users', userRoutes);

// Default route
app.use('/', function(req, res) {
  res.status(404).send("Homepage! (invalid request)")
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
