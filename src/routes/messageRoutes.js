const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { protect } = require("../middlewares/authMiddleware");
const Message = require("../models/message");

router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send message
router.post("/", protect, async (req, res) => {
  const senderId = req.user.id;
  const { text, receiverId } = req.body;
  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users who have chatted with a specific sender
router.get("/previews", protect, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          latestMessage: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          user: "$_id",
          message: "$latestMessage.text",
          timestamp: "$latestMessage.timestamp",
          messageType: {
            $cond: [
              { $eq: ["$latestMessage.sender", userId] },
              "sent",
              "received",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users", // Make sure this matches your users collection name
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          user: "$userDetails._id",
          name: "$userDetails.name",
          avatar: "$userDetails.avatar", // If you have an avatar field
          message: 1,
          timestamp: 1,
          messageType: 1,
        },
      },
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
