import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlogList = ({ onEdit, token, onRefetch }) => {
  const [blogs, setBlogs] = useState([]);

  // Define a function that fetches blogs for the logged-in user
  const fetchBlogs = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${API_BASE}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  // Initial fetch when token changes
  useEffect(() => {
    fetchBlogs();
  }, [token]);

  // Expose fetchBlogs via the ref passed from App.js
  useEffect(() => {
    if (onRefetch && typeof onRefetch === 'object') {
      onRefetch.current = fetchBlogs;
    }
  }, [onRefetch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`${API_BASE}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const drafts = blogs.filter(blog => blog.status === 'draft');
  const published = blogs.filter(blog => blog.status === 'published');

  const formatDate = iso => new Date(iso).toLocaleString();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">📄 Published Blogs</h2>
      <ul className="mb-8">
        {published.length ? published.map(blog => (
          <li key={blog._id} className="bg-white p-4 mb-2 rounded shadow">
            <h3 className="font-semibold">{blog.title}</h3>
            <p className="text-sm text-gray-600">Published: {formatDate(blog.updatedAt)}</p>
            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
            <button
              onClick={() => handleDelete(blog._id)}
              className="mt-2 text-red-500 underline"
            >
              Delete
            </button>
          </li>
        )) : <p className="text-gray-500 italic">No published blogs found.</p>}
      </ul>

      <h2 className="text-xl font-bold mb-4">📝 Drafts</h2>
      <ul>
        {drafts.length ? drafts.map(blog => (
          <li key={blog._id} className="bg-yellow-100 p-4 mb-2 rounded shadow">
            <h3 className="font-semibold">{blog.title}</h3>
            <p className="text-sm text-gray-600">Last saved: {formatDate(blog.updatedAt)}</p>
            <button
              onClick={() => onEdit(blog)}
              className="mt-2 text-blue-600 underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="mt-2 ml-4 text-red-500 underline"
            >
              Delete
            </button>
          </li>
        )) : <p className="text-gray-500 italic">No drafts available.</p>}
      </ul>
    </div>
  );
};

export default BlogList;
