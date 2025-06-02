const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema);
