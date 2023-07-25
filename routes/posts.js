const express = require("express");
const router = express.Router();
const { blogs, likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const allPosts = await blogs.findAll({ include: [likes] });
  const postsLikedByUser = await likes.findAll({
    where: { userId: req.user.id },
  });
  res.json({ allPosts: allPosts, postsLikedByUser: postsLikedByUser });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  // const postByID = await blogs.findOne({where: id});
  const postByID = await blogs.findByPk(id);
  res.json(postByID);
});

router.get("/byUser/:id", async (req, res) => {
  const userId = req.params.id;
  const postByUserID = await blogs.findAll({
    where: { userId },
    include: [likes],
  });
  res.json(postByUserID);
});

router.post("/", validateToken, async (req, res) => {
  const body = req.body;
  body.username = req.user.username;
  body.userId = req.user.id;
  await blogs.create(body);
  res.json(body);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await blogs.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newPostText, id } = req.body;
  await blogs.update({ postText: newPostText }, { where: { id: id } });
  res.json(newPostText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await blogs.destroy({ where: { id: postId } });
  res.json("Deleted Successfully!");
});

module.exports = router;
