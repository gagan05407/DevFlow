import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/variants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#F9FAFB', mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#9CA3AF', mb: 4, maxWidth: 480 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ py: 1.2, px: 3, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </motion.div>
  );
};

export default NotFound;
