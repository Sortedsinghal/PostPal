const Blog = require('../models/Blog');

exports.saveDraft = async (req, res) => {
  const { id, title, content, tags } = req.body;
  const update = { title, content, tags, status: 'draft' };
  try {
    const blog = id
      ? await Blog.findByIdAndUpdate(id, update, { new: true })
      : await Blog.create(update);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const blog = await Blog.create({ title, content, tags, status: 'published' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
