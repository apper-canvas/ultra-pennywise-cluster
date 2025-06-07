import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppHeader from '@/components/organisms/AppHeader';
import AppFooter from '@/components/organisms/AppFooter';
import FeatureContent from '@/components/organisms/FeatureContent';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light mode on server render or if window is undefined
  });

  // Apply dark mode class to document.documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen" // Class 'dark' is handled by document.documentElement
    >
      <AppHeader isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <FeatureContent />
      </main>

      <AppFooter />
    </motion.div>
  );
};

export default HomePage;