// implement your posts router here
const Post = require("./posts-model");
const express = require("express");
const router = express.Router();

//1 [GET] /api/posts
router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

//2 [GET] /api/posts/:id

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((posts) => {
      if (!posts) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.json(posts);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

// 3 [POST] / api / posts;

router.post("/posts", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert(newPost)
      .then((posts) => {
        res.status(201).json(posts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

//4 [PUT] /api/posts/:id

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const post = req.body;
  try {
    if (!id) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else if (!post.title || !post.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      const updatePost = await Post.update(id, post);
      console.log(updatePost);
      res.status(200).json(updatePost);
    }
  } catch {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

//5 [DELETE] /api/posts/:id

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await Post.remove(id);
    if (!deletePost) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      deletePost();
      res.status(201).json(deletePost);
    }
  } catch {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

//6 [GET] /api/posts/:id/comments

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Post.findCommentById(id)
    .then((comment) => {
      if (!comment) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.json(comment);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

module.exports = router;
