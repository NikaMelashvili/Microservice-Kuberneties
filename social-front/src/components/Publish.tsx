import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface NewPost {
  description: string;
  content: string;
  image_url?: string;
}

const Publish = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewPost>({
    description: '',
    content: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const decoded: JwtPayload = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          setError('Token expired');
        }
      } catch (err) {
        setError('Invalid token');
      }
    };

    validateToken();
    setLoading(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setError(null);
    } else {
      setImageFile(null);
      setError('Please select a valid image file');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    if (!formData.description.trim() || !formData.content.trim()) {
      setError('Description and content are required');
      return;
    }

    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }

      const postData: NewPost = {
        description: formData.description,
        content: formData.content,
        image_url: imageBase64,
      };

      await axios.post('http://127.0.0.1:5001/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      navigate('/landing', { state: { refresh: true } });
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    }
  };

  if (loading) return null;

  if (error) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4'>
        <h1 className='display-4 fw-bold mb-4'>Error</h1>
        <p className='text-danger fs-5'>{error}</p>
      </div>
    );
  }

  return (
    <div className='d-flex flex-column align-items-center min-vh-100 p-4'>
      <h1 className='display-4 fw-bold mb-4'>Create a New Post</h1>
      <form
        className='w-100'
        style={{ maxWidth: '720px' }}
        onSubmit={handleSubmit}
      >
        <div className='mb-3'>
          <label htmlFor='description' className='form-label fw-semibold'>
            Description
          </label>
          <input
            type='text'
            className='form-control input-field'
            id='description'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder='Enter post description'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='content' className='form-label fw-semibold'>
            Content
          </label>
          <textarea
            className='form-control textarea-field'
            id='content'
            rows={5}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder='Enter post content'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='image' className='form-label fw-semibold'>
            Image (Optional)
          </label>
          <input
            type='file'
            className='form-control input-field'
            id='image'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
        <button type='submit' className='btn btn-primary px-4 py-2'>
          Publish
        </button>
      </form>
    </div>
  );
};

export default Publish;
