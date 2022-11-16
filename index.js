require("dotenv").config();

const express = require("express");
const path = require("node:path");

// express server instance initialisation
const app = express();

const VideoRouter = require("./routes/videos");
app.use("/api/videos", VideoRouter);

// Add middleware for handling POST request or parsing new information from req.body
app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
	console.log(`Port ${PORT} is listening to express app`);
});
