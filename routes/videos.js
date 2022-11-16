const express = require("express");
const router = express.Router();
const path = require("node:path");
const { getNewId, writeJSONFile } = require("../helper/helper");

const videosJSONFile = path.join(__dirname, "../data/videos.json");
const videos = require(videosJSONFile);

// get all videos from json file
router.get("/", (_req, res) => {
	res.status(200).json(videos);
});

// get video by Id from json file
router.get("/:id", (req, res) => {
	const videoById = videos.find((video) => video.id === req.params.id);
	if (videoById) {
		res.status(200).json(videoById);
	} else {
		res.status(404).json({ error: `video with ID ${req.params.id} not found` });
	}
});

// Post a video with
router.post("/", (req, res) => {
	console.log(req.body);
	const { title, description } = req.body;

	if (!title || !description) {
		return res
			.status(400)
			.json({ error: "Please provide title & description for adding video" });
	}

	const newVideo = {
		title,
		description,
		id: getNewId()
	};

	//update Json file with new video
	videos.push(newVideo);
	writeJSONFile(videosJSONFile, videos);

	//respon to client with new video
	res.status(201).json(newVideo);
});

module.exports = router;
