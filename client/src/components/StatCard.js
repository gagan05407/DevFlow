import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { cardHoverVariants } from '../animations/variants';

const StatCard = ({ title, value, icon, color = '#6366F1', subtitle }) => {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      <Card
        className="glass-card"
        sx={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', fontSize: '0.75rem' }}>
              {title}
            </Typography>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}1A`,
                color: color,
                boxShadow: `0 0 20px ${color}33`,
                border: `1px solid ${color}40`,
              }}
            >
              {icon}
            </Box>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#F9FAFB', mb: 0.5, letterSpacing: '-0.5px' }}>
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
