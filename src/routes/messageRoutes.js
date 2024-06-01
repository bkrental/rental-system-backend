const router = require("express").Router();
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

module.exports = router;
