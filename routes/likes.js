const express = require("express");
const router = express.Router();
const { likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user.id;
  const found = await likes.findOne({ where: { blogId, userId } });
  if (found) {
    await likes.destroy({ where: { blogId, userId } });
    res.json({ liked: false });
  } else {
    await likes.create({ blogId, userId });
    res.json({ liked: true });
  }
});

module.exports = router;
