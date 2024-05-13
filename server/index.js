require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser')

const userRoutes = require("./routes/users");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  console.log("Incoming request for:", req.path)
  //console.log(req.cookies)
  next()
})

//routes
app.use('/api/users', userRoutes);

// Default route
app.use('/', function(req, res) {
  res.status(404).send("Page not found (invalid URL)")
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
