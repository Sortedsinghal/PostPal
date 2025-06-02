import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const API_BASE = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_BASE}/api/auth/${endpoint}`, {

        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      onAuth(res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border mb-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        {msg && <p className="text-red-600 mt-2">{msg}</p>}
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? 'No account?' : 'Already registered?'}{' '}
        <button className="text-blue-500 underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
