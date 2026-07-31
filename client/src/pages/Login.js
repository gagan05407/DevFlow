import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import BackgroundCanvas from '../components/BackgroundCanvas';

import {
  Code as CodeIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setSubmitting(true);
    try {
      if (credentialResponse.credential) {
        await googleLogin(credentialResponse.credential);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed or was cancelled.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B0F19',
          px: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Interactive Particle Constellation Background Canvas */}
        <BackgroundCanvas />

        {/* Animated Background Orbs */}
        <div className="ambient-orb orb-indigo" />
        <div className="ambient-orb orb-cyan" />

        <Card
          className="glass-card glow-border"
          sx={{
            width: '100%',
            maxWidth: 440,
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 4,
            p: 2,
            zIndex: 1,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                className="pulse-glow"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3.5,
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  border: '1px solid rgba(99, 102, 241, 0.4)'
                }}
              >
                <CodeIcon sx={{ color: '#818CF8', fontSize: 36 }} />
              </Box>
              <Typography variant="h3" className="gradient-text" sx={{ fontWeight: 800 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5 }}>
                Log in to your DevFlow developer workspace
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#818CF8' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#818CF8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff sx={{ color: '#9CA3AF' }} /> : <Visibility sx={{ color: '#9CA3AF' }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                  <Link to="/forgot-password" style={{ color: '#818CF8', fontSize: '0.85rem', fontWeight: 600 }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  sx={{
                    py: 1.4,
                    fontSize: '1rem',
                    fontWeight: 700,
                    bgcolor: '#6366F1',
                    '&:hover': { bgcolor: '#4F46E5', boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)' },
                  }}
                >
                  {submitting ? 'Authenticating...' : 'Log In'}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                  <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Typography variant="body2" sx={{ px: 2, color: '#9CA3AF', fontSize: '0.85rem' }}>
                    OR
                  </Typography>
                  <Divider sx={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    width="360px"
                    text="continue_with"
                  />
                </Box>

                <Typography variant="body2" align="center" sx={{ color: '#9CA3AF', mt: 1 }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#818CF8', fontWeight: 600 }}>
                    Register here
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export default Login;
