const express = require('express');
const router = express.Router();
const { Forum } = require("../models");

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Forum.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving articles", error });
  }
});

// Post an article
router.post("/", async (req, res) => {
  const { article, content } = req.body;
  try {
    const createdArticle = await Forum.create({ article, content });
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error });
  }
});

// Get a specific article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Forum.findByPk(req.params.id);

    if (!article) {
      res.status(404).json({ message: "Article not found." });
    } else {
      res.json(article);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving article", error });
  }
});

// Update an article by ID
router.put("/:id", async (req, res) => {
  const { article, content } = req.body;

  try {
    const updatedArticle = await Forum.findByPk(req.params.id);

    if (!updatedArticle) {
      res.status(404).json({ message: "Article not found." });
      return;
    }

    updatedArticle.article = article;
    updatedArticle.content = content;
    await updatedArticle.save();

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
});

// Delete an article by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Forum.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: "Article deleted" });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error });
  }
});

// Increment likes count for an article
router.post('/:id/like', async (req, res) => {
  const articleId = req.params.id;

  try {
    const article = await Forum.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.likes += 1;
    await article.save();

    res.status(200).json({ message: 'Article liked successfully' });
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment dislikes count for an article
router.post('/:id/dislike', async (req, res) => {
  const articleId = req.params.id;

  try {
    const article = await Forum.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.dislikes += 1;
    await article.save();

    res.status(200).json({ message: 'Article disliked successfully' });
  } catch (error) {
    console.error('Error disliking article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to an article
router.post('/:id/comment', async (req, res) => {
  const articleId = req.params.id;
  const { comment } = req.body;

  try {
    const article = await Forum.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.comments = article.comments || []; // Ensure the comments array exists
    article.comments.push(comment);
    await article.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
