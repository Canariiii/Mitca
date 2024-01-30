// CoursesList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'antd';
import CourseCard from '../courseCard/courseCard';
import './coursesList.css';

const CoursesList = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');

  const showData = useCallback(() => {
    if (userId && userId !== '') {
      axios.get(`http://localhost:3001/users/profile/${userId}`)
        .then(response => {
          setUserRole(response.data.data.role);
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

  return (
    <div>
      <Link to="/create-course">
        {(userRole === 'instructor' || userRole === 'admin') && (
          <Button className='create-course'>Create Course</Button>
        )}
      </Link>
      <CourseCard />
    </div>
  );
};

export default CoursesList;
