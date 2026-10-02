// Test change
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/PostDetails.css';

// Added a comment to see if editor works
const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      await api.post(`/posts/${id}/comments`, { content: commentText });
      setCommentText('');
      fetchComments();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    setEditingCommentId(commentId);
    setEditCommentText(content);
  };

  const handleUpdateComment = async (commentId, e) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;

    try {
      await api.put(`/comments/${commentId}`, { content: editCommentText });
      setEditingCommentId(null);
      setEditCommentText('');
      fetchComments();
    } catch (err) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment');
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <div>
        <p>By {post.author?.name || 'Anonymous'}</p>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <div>{post.content}</div>
      
      <h2>Comments ({comments.length})</h2>
      
      {user ? (
        <div>
          <h3>Add a comment</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={commentLoading}>
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
          {error && <div>Error: {error}</div>}
        </div>
      ) : (
        <p>Please <a href="/login">log in</a> to leave a comment.</p>
      )}
      
      <div>
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            {editingCommentId === comment._id ? (
              <form onSubmit={(e) => handleUpdateComment(comment._id, e)}>
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                />
                <div>
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <p>{comment.content}</p>
                <div>
                  <span>By {comment.author?.name || 'Anonymous'}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {comment.author?._id === user?._id ? (
                  <div>
                    <button onClick={() => handleEditComment(comment._id, comment.content)}>Edit</button>
                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
      </div>
      
      <div>
        <Link to="/">← Back to Home</Link>
        {user && post.author?._id === user._id ? (
          <>
            <Link to={`/edit-post/${id}`}>Edit Post</Link>
            <button onClick={handleDeletePost}>Delete Post</button>
            </>
        ) : null}
      </div>
    </div>
  );
};

export default PostDetails;

