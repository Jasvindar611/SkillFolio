const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const cors = require("cors");
app.use(cors(
    {
        origin: 'http://localhost:4200'
    }
))

mongoose.connect("url")
.then(() =>{
    console.log("Connected to DataBase");
}).catch(() =>{
    console.log("Connection failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

;

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET , POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;
