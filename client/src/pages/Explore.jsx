import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="explore-container">
        <h1 className="explore-heading">Explore Posts</h1>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explore-container">
        <h1 className="explore-heading">Explore Posts</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="explore-container">
      <h1 className="explore-heading">Explore Posts</h1>
      {posts.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-heading">No posts yet.</h2>
          <p className="empty-state-subtitle">Be the first to share your ideas!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <span className="post-author">By {post.author?.name || 'Anonymous'}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="post-excerpt">{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
              <Link to={`/posts/${post._id}`} className="read-more-link">Read more →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;