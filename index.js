require("dotenv").config();

const express = require("express");
const path = require("node:path");
const cors = require("cors");

// express server instance initialisation
const app = express();

const VideoRouter = require("./routes/videos");

// Add middleware for handling POST request or parsing new information from req.body
app.use(cors({ origin: "*" }));
app.use(express.json());

//server to serve images to client using
app.use(express.static(path.join(__dirname, "public")));

//routes for video resources
app.use("/videos", VideoRouter);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
	console.log(`Port ${PORT} is listening to express app`);
});
