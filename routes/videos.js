const express = require("express");
const router = express.Router();
const path = require("node:path");
const { getNewId, writeJSONFile } = require("../helper/helper");
const videosJSONFile = path.join(__dirname, "../data/videos.json");
const videos = require(videosJSONFile);

// get all videos from json file
// http://localhost:8080/videos -> GET

router.get("/", (_req, res) => {
	try {
		res.status(200).json(videos);
	} catch (error) {
		res.status(400).json("Error retrieveing the videos", error);
	}
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
	const { title, description } = req.body;

	if (!title || !description) {
		return res
			.status(400)
			.json({ error: "Please provide title & description for adding video" });
	}

	const newVideo = {
		id: getNewId(),
		title: title,
		channel: "BrainStation",
		image: "http://localhost:8080/images/default.jpg",
		description: description,
		views: "0",
		likes: "0",
		timestamp: Date.now(),
		comments: [
			{
				id: getNewId(),
				name: "Travis Scott",
				comment:
					"Let’s collaborate on a video for saving money on cheap train tickets! I’ll have my associates contact yours.",
				likes: 0,
				timestamp: 1632496261000
			},
			{
				id: getNewId(),
				name: "Aubrey 'Drake' Graham",
				comment: "21 can do something for me.",
				likes: 0,
				timestamp: 1632496261000
			},
			{
				id: getNewId(),
				name: "Eminem",
				comment: "This world is mine for the taking, make me king.",
				likes: 0,
				timestamp: 1632496261000
			}
		]
	};

	//update Json file with new video
	videos.push(newVideo);
	writeJSONFile(videosJSONFile, videos);

	//responds to client with new video
	res.status(201).json(newVideo);
});

// Post Comments
router.post("/:id/comments", (req, res) => {
	const { name, comment } = req.body;
	if (!name && !comment) {
		return res.status(404).json({ errorMessage: `Video with ID: ${req.params.id} not found` });
	} else {
		const newComment = {
			id: getNewId(),
			name: name,
			comment: comment,
			timestamp: new Date()
		};
		const found = videos.find((video) => video.id === req.params.id);
		if (found) {
			found.comments.unshift(newComment);
			writeJSONFile(videosJSONFile, videos);
			res.status(201).json(found);
		}
	}
});

//PATCH
// http://localhost:8080/videos/someExistingId
router.patch("/:id", (req, res) => {
	const found = videos.some((video) => video.id === req.params.id);
	if (found) {
		const updatedVideos = videos.map((video) =>
			video.id === req.params.id ? { ...video, ...req.body } : video
		);
		writeJSONFile(videosJSONFile, updatedVideos);

		res.json({ msg: "Video Updated", Videos: updatedVideos });
	} else {
		res.status(404).json({ errorMessage: `Video with ID: ${req.params.id} not found` });
	}
});

//DELETE
// http://localhost:8080/api/videos/idForVideoToBeDeleted
router.delete("/:id", (req, res) => {
	const found = videos.some((video) => video.id === req.params.id);
	if (found) {
		const videosAfterDeletion = videos.filter((video) => video.id !== req.params.id);
		writeJSONFile(videosJSONFile, videosAfterDeletion);
		res.json({
			msg: `video with ID: ${req.params.id} deleted`,
			videos: videosAfterDeletion
		});
	} else {
		res.status(404).json({ errorMessage: `video with ID: ${req.params.id} not found` });
	}
});

module.exports = router;
