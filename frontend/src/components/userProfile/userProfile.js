import React, { useState, useEffect, useCallback } from 'react';
import './userProfile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';


const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [filename, setFilename] = useState(null);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const showData = useCallback(() => {
    if (userId && userId !== '') {
      axios.get(`http://localhost:3001/users/profile/${userId}`)
        .then(response => {
          setUsername(response.data.data.username);
          setUserRole(response.data.data.role);
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

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    message.success(`See you later ${username}`)
    navigate('/');
  };

  const goToUserPreferencesForm = () => {
    navigate('/user-preferences-form');
  }

  const goToManage = () => {
    navigate('/manage');
  }

  const goToUploadCont = () => {
    navigate('/upload-content');
  }

  return (
    <div className='user-container'>
      <img src={filename} alt='profilePic' />
      <h1 className='user-name'>{username}</h1>
      <div className='user-line'></div>
      <div className='button-container'>
        <button onClick={logOut}>Logout</button>
        <button onClick={goToUserPreferencesForm} >Preferences</button>
      </div>
      {userRole === 'instructor' && (
        <button className='upload-content' onClick={goToUploadCont}>Upload Content</button>
      )}
      {userRole === 'admin' && (
        <button onClick={goToManage} className='manage-button'>Manage</button>
      )}
    </div>
  );
};

export default UserProfile;
