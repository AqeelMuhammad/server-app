const express = require("express");
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    const body = {
      username,
      password: hash,
    };
    users.create(body);
    res.json("User created successfully.");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findOne({ where: { username } });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({ error: "Wrong Username And Password Combination" });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "importantsecret"
        );
        res.json({
          token: accessToken,
          username: user.username,
          id: user.id,
        });
      }
    });
  }
  //   if (user && bcrypt.compareSync(password, user.password)) {
  //     res.json("you logged in successfully");
  //   } else {
  //     res.status(401).json("Invalid username or password.");
  //   }
});

router.get("/auth", validateToken, async (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const userInfo = await users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(userInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username;
  const user = await users.findOne({ where: { username } });

  bcrypt.compare(oldPassword, user.password).then((match) => {
    if (!match) {
      res.json({ error: "Wrong Password Entered." });
    }
    bcrypt.hash(newPassword, 10).then((hash) => {
      users.update({ password: hash }, { where: { username: username } });
      res.json("Password Chnaged successfully.");
    });
  });
});

module.exports = router;
