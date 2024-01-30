import React, { useEffect } from 'react';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  useEffect(() => {
    const body = document.querySelector('body');
    body.style.backgroundColor = location.pathname === '/' ? '#101828' : 'initial';

    return () => {
      body.style.backgroundColor = 'initial';
    };
  }, [location.pathname]);
  return (
    <header className="navbar">
      <img className='logo-img-home' src="/assets/img/logo.png" alt="logo" height={50} />
      <div className='navbar-container'>
        <nav className="navbar">
          <ul className="nav-links">
            <Link to='/login'>
              <button className='nav-login'>Login</button>
            </Link>
            <Link to='/signup'>
              <button className='nav-signup'>Signup</button>
            </Link>
            <div className='nav-line'></div>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;