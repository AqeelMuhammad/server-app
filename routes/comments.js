const express = require("express");
const router = express.Router();
const { comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  const commentsByBlogId = await comments.findAll({
    where: { blogId: blogId },
  });
  res.json(commentsByBlogId);
});

router.post("/", validateToken, async (req, res) => {
  const body = req.body;
  const username = req.user.username;
  body.username = username;
  await comments.create(body);
  res.json(body);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  await comments.destroy({ where: { id: commentId } });
  res.json("Deleted Successfully!");
});

module.exports = router;
