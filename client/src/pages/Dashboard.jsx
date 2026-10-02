import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
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

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">Welcome back, {user?.name}</h1>
          <p className="dashboard-subtitle">Turn your ideas into stories worth sharing.</p>
        </div>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">Welcome back, {user?.name}</h1>
          <p className="dashboard-subtitle">Turn your ideas into stories worth sharing.</p>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Welcome back, {user?.name}</h1>
        <p className="dashboard-subtitle">Turn your ideas into stories worth sharing.</p>
      </div>
      <Link to="/create-post" className="create-post-cta">Create a post →</Link>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Comments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{posts.filter(post => post.published).length}</div>
          <div className="stat-label">Published</div>
        </div>
      </div>
      <div className="posts-section">
        <h2 className="posts-heading">Your posts</h2>
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-heading">Your story starts here.</h3>
            <p className="empty-state-subtitle">Create your first post and share your ideas with the world.</p>
            <button className="empty-state-cta">Create your first post →</button>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="post-excerpt">{post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}</p>
                <div className="post-actions">
                  <Link to={`/edit-post/${post._id}`} className="edit-link">Edit</Link>
                   <Link to={`/posts/${post._id}`} className="read-more-link">Read more →</Link>
                  <button className="delete-button" onClick={() => handleDeletePost(post._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="comments-section">
        <h2 className="comments-heading">Recent conversations</h2>
        <div className="empty-state">
          <h3 className="empty-state-heading">Start the conversation.</h3>
          <p className="empty-state-subtitle">Your comments will appear here once you engage with posts.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;