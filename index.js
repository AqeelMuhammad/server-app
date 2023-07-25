const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postRouter = require("./routes/posts");
app.use("/posts", postRouter);
const commentRouter = require("./routes/comments");
app.use("/comments", commentRouter);
const usersRouter = require("./routes/users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/likes");
app.use("/like", likesRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
