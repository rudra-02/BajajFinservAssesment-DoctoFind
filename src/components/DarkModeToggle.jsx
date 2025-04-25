import React from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <button className="dark-mode-toggle" onClick={onToggle}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;