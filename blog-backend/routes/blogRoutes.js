const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

router.post('/save-draft', verifyToken, async (req, res) => {
  const { id, title, content, tags } = req.body;
  const update = { title, content, tags, status: 'draft', user: req.userId };

  try {
    const blog = id
      ? await Blog.findOneAndUpdate({ _id: id, user: req.userId }, update, { new: true })
      : await Blog.create({ ...update, user: req.userId });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/publish', verifyToken, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const blog = await Blog.create({
      title,
      content,
      tags,
      status: 'published',
      user: req.userId
    });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const deleted = await Blog.findOneAndDelete({
        _id: req.params.id,
        user: req.userId
      });
      if (!deleted) return res.status(404).json({ message: 'Blog not found' });
      res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

router.get('/', verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.userId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, user: req.userId });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
