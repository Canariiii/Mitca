import React from 'react';
import { Link } from 'react-router-dom';

import './footer.css';

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='footer-line'></div>
      <p>© 2023 Learn Edge</p>
      <img src='assets/img/logo.png' alt='footer-logo'></img>
      <Link to='https://github.com/Canariiii'>
        <img src='assets/img/github.svg' alt='footer-git'></img>
      </Link>
    </footer>
  );
}

export default Footer;