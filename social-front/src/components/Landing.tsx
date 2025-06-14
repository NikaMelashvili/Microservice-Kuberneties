import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { Post, Comment } from '../common/types';

interface JwtPayload {
  username: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<{
    [postId: number]: string;
  }>({});
  const [commentError, setCommentError] = useState<{
    [postId: number]: string | null;
  }>({});
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        try {
          const decoded: JwtPayload = jwtDecode(token);
          setUsername(decoded.username);
        } catch (err) {
          setError('Invalid token');
          console.error('Error decoding JWT:', err);
          return;
        }

        const response = await axios.get<Post[]>(
          'http://127.0.0.1:5000/posts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [location.state?.refresh]);

  const handleCommentSubmit = async (postId: number) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setCommentError((prev) => ({
          ...prev,
          [postId]: 'No authentication token found',
        }));
        return;
      }

      if (!username) {
        setCommentError((prev) => ({
          ...prev,
          [postId]: 'User not authenticated',
        }));
        return;
      }

      const content = commentContent[postId]?.trim();
      if (!content) {
        setCommentError((prev) => ({
          ...prev,
          [postId]: 'Comment cannot be empty',
        }));
        return;
      }

      const newComment = {
        postId,
        content,
        author: username,
        date: new Date().toISOString(),
      };

      const response = await axios.post<{
        id: number;
        postId: number;
        content: string;
        author: string;
        date: string | null;
      }>('http://localhost:8080/rest/comments/add', newComment, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const createdComment: Comment = {
        id: response.data.id,
        postId: response.data.postId,
        content: response.data.content,
        author: response.data.author,
        date: response.data.date,
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, createdComment] }
            : post,
        ),
      );
      setCommentContent((prev) => ({ ...prev, [postId]: '' }));
      setCommentError((prev) => ({ ...prev, [postId]: null }));
    } catch (err) {
      setCommentError((prev) => ({
        ...prev,
        [postId]: 'Failed to add comment',
      }));
      console.error('Error adding comment:', err);
    }
  };

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
      <h1 className='display-4 fw-bold mb-4'>Blog app</h1>
      <button
        className='btn btn-primary px-4 py-2 mt-4'
        onClick={() => navigate('/publish')}
      >
        Post
      </button>

      {posts.map((post) => (
        <div key={post.id} className='w-100' style={{ maxWidth: '720px' }}>
          <div className='card shadow-sm mb-4'>
            <div className='card-body'>
              <h2 className='card-title fs-3 fw-semibold mb-2'>
                {post.description}
              </h2>
              <p className='card-text text-muted mb-2'>{post.content}</p>
              {post.image_url && (
                <img
                  src={`data:image/png;base64,${post.image_url}`}
                  alt='Post'
                  className='img-fluid rounded mb-2'
                  style={{ maxHeight: '320px', objectFit: 'cover' }}
                />
              )}
              <div className='text-muted small mb-2'>
                Posted by {post.username} on{' '}
                {new Date(post.created_at).toLocaleString()}
              </div>

              <div className='mt-4'>
                <h3 className='fw-semibold mb-2'>Comments:</h3>
                {post.comments.length ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className='p-2 bg-light rounded mb-2'>
                      <div className='fw-medium'>{comment.author}</div>
                      <div>{comment.content}</div>
                      {comment.date && (
                        <div
                          className='text-muted'
                          style={{ fontSize: '0.75rem' }}
                        >
                          {new Date(comment.date).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='text-muted'>No comments</div>
                )}

                <div className='mt-3'>
                  <textarea
                    className='form-control mb-2'
                    rows={3}
                    placeholder='Add a comment...'
                    value={commentContent[post.id] || ''}
                    onChange={(e) =>
                      setCommentContent((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  {commentError[post.id] && (
                    <div className='text-danger small mb-2'>
                      {commentError[post.id]}
                    </div>
                  )}
                  <button
                    className='btn btn-primary'
                    onClick={() => handleCommentSubmit(post.id)}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Landing;
