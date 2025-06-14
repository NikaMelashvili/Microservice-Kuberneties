import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        { withCredentials: true },
      );
      const token = res.data.token;
      Cookies.set('token', token, { path: '/' });
      navigate('/landing');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className='login-form'>
      <h1>Login</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='input-field'
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='input-field'
        required
      />
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;
