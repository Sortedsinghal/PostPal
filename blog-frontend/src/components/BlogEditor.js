import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogEditor = ({ existingBlog, token, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [draftId, setDraftId] = useState(null);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // When editing an existing draft, prefill the fields
  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title || '');
      setContent(existingBlog.content || '');
      setTags((existingBlog.tags || []).join(', '));
      setDraftId(existingBlog._id || null);
      setStatusMsg('Editing draft...');
    }
  }, [existingBlog]);

  // Auto-save after 5 seconds of inactivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title || content) handleAutoSave();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [title, content, tags]);

  const handleAutoSave = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${API_BASE}/api/blogs/save-draft`, {
        id: draftId,
        title,
        content,
        tags: tags.split(',').map(t => t.trim())
      }, headers);
      setDraftId(response.data._id);
      setStatusMsg('Auto-saved at ' + new Date().toLocaleTimeString());
      onRefresh && onRefresh();
    } catch (err) {
      setStatusMsg('Auto-save failed');
      console.error(err);
    }
  };

  const handlePublish = async () => {
    try {
      await axios.post(`${API_BASE}/api/blogs/publish`,   {
        title,
        content,
        tags: tags.split(',').map(t => t.trim())
      }, headers);
      setStatusMsg('Published successfully!');
      // Clear the editor fields after publishing
      setTitle('');
      setContent('');
      setTags('');
      setDraftId(null);
      onRefresh && onRefresh();
    } catch (err) {
      setStatusMsg('Publish failed');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">📝 Blog Editor</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border mb-3 rounded"
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="mb-3"
      />
      <input
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border mb-3 rounded"
      />
      <div className="flex justify-between">
        <button onClick={handleAutoSave} className="bg-gray-300 px-4 py-2 rounded">
          Save Draft
        </button>
        <button onClick={handlePublish} className="bg-blue-600 text-white px-4 py-2 rounded">
          Publish
        </button>
      </div>
      {statusMsg && <p className="mt-2 text-green-600">{statusMsg}</p>}
    </div>
  );
};

export default BlogEditor;
