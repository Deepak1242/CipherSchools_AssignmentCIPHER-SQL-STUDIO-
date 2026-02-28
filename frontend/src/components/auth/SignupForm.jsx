import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/assignments');
    } catch (err) {
      console.error('Signup form error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background Elements */}
      <div className="auth-page__bg-shapes">
        <div className="shape shape--1"></div>
        <div className="shape shape--2"></div>
        <div className="shape shape--3"></div>
      </div>

      {/* Floating SQL Code Snippets */}
      <div className="auth-page__floating-code">
        <span className="code-snippet code-snippet--1">SELECT * FROM users</span>
        <span className="code-snippet code-snippet--2">WHERE active = true</span>
        <span className="code-snippet code-snippet--3">JOIN orders ON...</span>
        <span className="code-snippet code-snippet--4">GROUP BY category</span>
        <span className="code-snippet code-snippet--5">ORDER BY date DESC</span>
      </div>

      <div className="auth-page__container">
        <div className="auth-page__card">
          <div className="auth-page__logo">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#gradient)" />
                <path d="M24 14L16 18V26C16 30 20 33 24 34C28 33 32 30 32 26V18L24 14Z" 
                      fill="white" fillOpacity="0.9" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#F77F00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>CipherSQLStudio</h1>
            <p>Create your account and start learning SQL today.</p>
          </div>

          {error && (
            <div className="auth-page__error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-page__form">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              help="At least 6 characters"
              required
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/>
                  </svg>
                </>
              )}
            </Button>
          </form>

          <div className="auth-page__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
