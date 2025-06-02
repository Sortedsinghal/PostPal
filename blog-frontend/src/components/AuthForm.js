import React, { useState } from 'react';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_BASE_URL;

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const route = isLogin ? 'login' : 'signup';
      const res = await axios.post(`${endpoint}/auth/${route}`, { email, password });
      localStorage.setItem('token', res.data.token);
      onAuth(res.data.token);
    } catch (err) {
      setMsg('Authentication failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded mb-2" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        {msg && <p className="text-red-500">{msg}</p>}
        <p className="text-sm mt-2">
          {isLogin ? 'No account?' : 'Already registered?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} className="text-blue-600 cursor-pointer">
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
