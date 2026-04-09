import React from 'react';
import { motion } from 'framer-motion';

import logo from '../assets/logo.svg';

const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2.5 }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#1A237E', // Match deep blue theme
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: 'white'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: 180, height: 180, marginBottom: 20 }}
      >
        <img
          src={logo}
          alt="Tamil Nadu Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textAlign: 'center'
        }}
      >
        TNSTC <br />
        <span style={{ fontWeight: 400, fontSize: '1rem', opacity: 0.8 }}>Live Tracking</span>
      </motion.h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{
          height: 3,
          backgroundColor: '#daa520',
          marginTop: 20,
          borderRadius: 10
        }}
      />
    </motion.div>
  );
};

export default SplashScreen;
