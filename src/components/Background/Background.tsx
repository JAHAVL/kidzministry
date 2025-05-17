import React from 'react';
import './Background.css';

const Background: React.FC = () => {
  return (
    <div className="app-background">
      <div className="gradient-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
        <div className="overlay"></div>
      </div>
    </div>
  );
};

export default Background;
