import React, { useState, useEffect, useCallback } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = () => {
  const navigate = useNavigate();
  const [filename, setFilename] = useState(null);
  const [userId, setUserId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const showData = useCallback(() => {
    if (userId && userId !== '') {
      axios.get(`http://localhost:3001/users/profile/${userId}`)
        .then(response => {
          setFilename(`http://localhost:3001/user-images/${response.data.data.filename}`);
          if (!response.data.data.filename) {
            console.log('No image received.');
            setFilename('/assets/img/user.jpeg');
          }
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("error");
      navigate('/login');
      return;
    }
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, [navigate]);

  useEffect(() => {
    showData();
  }, [userId, showData]);

  const goToHome = () => {
    navigate("/courses");
  }

  return (
    <header className="header">
      <div className="logo-container">
        <img src={'/assets/img/logoBlack.png'} alt="Logo" className="logo-header" onClick={goToHome} />
      </div>
      <div>
        <ul className='home-container'>
          <li className='li-courses'><a href='/courses'>Courses</a></li>
          <li className='li-my-courses'><a href='/my-courses'>My Courses</a></li>
        </ul>
      </div>
      <FontAwesomeIcon className='bell-icon' icon={faBell} />
      <div className="user-pic-container">
        <Link to={'/profile'}>
          <img className='user-header-pic' src={filename} alt='pic' ></img>
        </Link>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon className={`bars-icon ${menuOpen ? 'open' : ''}`} icon={faBars} style={{ color: "#000000" }} />
      </div>
      <div className={`menu-container ${menuOpen ? 'open' : ''}`}>
        <ul className="menu">
          <li><a href='/courses' onClick={closeMenu}>Courses</a></li>
          <li><a href='/my-courses' onClick={closeMenu}>My Courses</a></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
