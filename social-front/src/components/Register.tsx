import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { User } from '../common/types';

const Register = () => {
  const [formData, setFormData] = useState<User>({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className='register-form'>
      <h1>Register</h1>
      <input
        type='email'
        placeholder='Email'
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className='input-field'
      />
      <input
        type='text'
        placeholder='Username'
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        className='input-field'
      />
      <input
        type='password'
        placeholder='Password'
        value={formData.password || ''}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        className='input-field'
      />
      <button type='submit'>Register</button>
    </form>
  );
};

export default Register;
