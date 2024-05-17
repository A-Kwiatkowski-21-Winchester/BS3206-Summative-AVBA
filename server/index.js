require("dotenv").config();
const cors = require("cors");
const dbUtil = require("./libs/dbUserUtils");
const express = require("express");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/users");

const appointmentRoutes = require("./routes/appointments");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    console.log("Incoming request for:", req.path);
    //console.log(req.cookies)
    next();
});
let env;
try {
  env = require("./env/environment");
} catch {
  console.error(
    "Unable to load './env/environment.js'. Have you filled out the template and renamed it?"
  );
}

//routes
app.use("/api/users", userRoutes);
app.use('/api/appointments', appointmentRoutes);
// Default route
app.use('/', function(req, res) {
  res.status(404).send("Page not found (invalid URL)")
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
