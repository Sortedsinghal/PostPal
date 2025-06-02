import React, { useEffect, useState } from 'react';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_BASE_URL;

const BlogList = ({ onEdit, token, onRefetch }) => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${endpoint}/blogs/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(res.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    if (onRefetch) onRefetch.current = fetchBlogs;
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`${endpoint}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const published = blogs.filter(blog => blog.published);
  const drafts = blogs.filter(blog => !blog.published);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4">📄 Published Blogs</h3>
      {published.map(blog => (
        <div key={blog._id} className="bg-white shadow p-4 mb-3 rounded">
          <p className="font-semibold">{blog.title}</p>
          <p className="text-sm text-gray-600">Published: {new Date(blog.updatedAt).toLocaleString()}</p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} className="mb-2" />
          <button onClick={() => handleDelete(blog._id)} className="text-red-500 underline">Delete</button>
        </div>
      ))}

      <h3 className="text-xl font-bold mt-8 mb-4">📝 Drafts</h3>
      {drafts.length === 0 ? <p className="text-gray-500 italic">No drafts available.</p> : null}
      {drafts.map(blog => (
        <div key={blog._id} className="bg-yellow-100 p-4 mb-3 rounded">
          <p className="font-semibold">{blog.title}</p>
          <p className="text-sm text-gray-600">Last saved: {new Date(blog.updatedAt).toLocaleString()}</p>
          <button onClick={() => onEdit(blog)} className="text-blue-600 underline mr-4">Edit</button>
          <button onClick={() => handleDelete(blog._id)} className="text-red-600 underline">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
