import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="brand-content">
          <div className="brand-logo">
            <span className="brand-mark">B</span>
            <span className="brand-text">
              <span className="brand-blog">Blog</span>
              <span className="brand-space">Space</span>
            </span>
          </div>
          <h2 className="brand-heading">Your ideas deserve a place.</h2>
          <p className="brand-subtitle">
            Write, publish, and start meaningful conversations with people who care about your ideas.
          </p>
          <div className="brand-features">
            <div className="feature-item">✦ Publish your ideas</div>
            <div className="feature-item">✦ Connect through conversations</div>
            <div className="feature-item">✦ Build your audience</div>
          </div>
        </div>
        <div className="auth-card">
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue to BlogSpace.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In →'}
            </button>
          </form>
          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          )}
          <div className="auth-footer">
            <p className="auth-footer-text">
              Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;