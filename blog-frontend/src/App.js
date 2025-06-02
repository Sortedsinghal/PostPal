import React, { useState, useRef } from 'react';
import BlogEditor from './components/BlogEditor';
import BlogList from './components/BlogList';
import AuthForm from './components/AuthForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editableBlog, setEditableBlog] = useState(null);
  // useRef to hold the refresh function coming from BlogList
  const refreshBlogsRef = useRef(null);

  if (!token) {
    return <AuthForm onAuth={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <button
        className="absolute top-4 right-6 text-sm text-red-500"
        onClick={() => {
          localStorage.removeItem('token');
          setToken(null);
        }}
      >
        Logout
      </button>
      <BlogEditor
        existingBlog={editableBlog}
        token={token}
        onRefresh={() => refreshBlogsRef.current && refreshBlogsRef.current()}
      />
      <BlogList
        onEdit={setEditableBlog}
        token={token}
        onRefetch={refreshBlogsRef}
      />
    </div>
  );
}

export default App;
