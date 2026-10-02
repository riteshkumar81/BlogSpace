import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/posts/${id}`, { title, content });
      } else {
        await api.post('/posts', { title, content });
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await api.delete(`/posts/${id}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete post');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-heading">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="word-count">Word count: {content.trim().split(/\s+/).filter(word => word.length > 0).length}</div>
        <div className="form-actions">
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')}>Cancel</button>
          {isEditing && (
            <button type="button" className="delete-button" onClick={handleDelete} disabled={loading}>
              Delete Post
            </button>
          )}
        </div>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CreatePost;