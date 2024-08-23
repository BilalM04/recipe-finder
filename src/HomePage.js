// HomePage.js
import React from 'react';
import './HomePage.css';
import { useNavigate } from "react-router-dom";
import LinkedInLogo from './assets/images/LinkedInLogo.png';
import initials from './assets/images/initials.png';



const HomePage = () => {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/browse`; 
    navigate(path);
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">👨‍🍳 Recipe Finder 🍴</h1>
        <p className="description">Easily discover delightful recipes by simply entering your available ingredients.</p>
        <button className="ctaButton" onClick={routeChange}>Try it Out</button>
      </div>
      <footer className="footer">
        <div className="social-links">
          <a href="https://www.linkedin.com/in/mohammadbilal7/" target="_blank" rel="noopener noreferrer">
            <img src={LinkedInLogo} alt="LinkedIn" />
          </a>
          <a href="https://bilalm04.github.io/" target="_blank" rel="noopener noreferrer">
            <img src={initials} alt="Portfolio" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
