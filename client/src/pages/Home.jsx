import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">✦ A MODERN SPACE FOR IDEAS</div>
          <h1 className="hero-heading">
            Write what matters.<br />
            <span>Share it with the world.</span>
          </h1>
          <p className="hero-subheading">
            Create thoughtful posts, share your perspective, and start meaningful conversations.
          </p>
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={() => navigate('/create-post')}>Start Writing →</button>
            <button className="hero-button secondary" onClick={() => navigate('/explore')}>Explore Stories</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="featured-story">
            <div className="story-badge">FEATURED STORY</div>
            <h3 className="story-title">The Future of Modern Web</h3>
            <p className="story-excerpt">
              Exploring how developers are building the next generation of the web.
            </p>
            <div className="story-meta">
              5 min read • Technology
            </div>
            <div className="story-author">
              <div className="author-avatar">B</div>
              <div className="author-name">John Doe</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="features-heading">Everything you need to publish.</h2>
        <p className="features-subtitle">From your first draft to meaningful conversations.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="card-number">01</div>
            <h3 className="card-title">WRITE</h3>
            <p className="card-description">Turn your ideas into beautifully structured articles.</p>
          </div>
          <div className="feature-card">
            <div className="card-number">02</div>
            <h3 className="card-title">CONNECT</h3>
            <p className="card-description">Start meaningful conversations through comments.</p>
          </div>
          <div className="feature-card">
            <div className="card-number">03</div>
            <h3 className="card-title">CREATE</h3>
            <p className="card-description">Build your personal space on the web.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
