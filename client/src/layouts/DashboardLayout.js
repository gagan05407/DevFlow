import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BackgroundCanvas from '../components/BackgroundCanvas';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0B0F19', position: 'relative' }}>
      {/* Interactive Particle Constellation Background Canvas */}
      <BackgroundCanvas />

      {/* Animated Ambient Light Orbs */}
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-purple" />

      <Navbar onToggleSidebar={handleDrawerToggle} />
      <Box sx={{ display: 'flex', flexGrow: 1, zIndex: 1 }}>
        <Sidebar open={mobileOpen} onToggleSidebar={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - 240px)` },
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
