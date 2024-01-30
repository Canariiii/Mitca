import React, { useState } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

function SignUp() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('user');
  const [filename, setFilename] = useState('');

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
  };

  const handleUserPic = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setFilename(file);
    } else {
      setFilename('');
    }
  }

  const handleSignUp = () => {
    const newUser = new FormData();
    newUser.append('username', username);
    newUser.append('password', password);
    newUser.append('email', email);
    newUser.append('phone', mobile);
    newUser.append('role', role);
    newUser.append('filename', filename);
    console.log("New user data:", newUser);
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3001/users', newUser, {
      withCredentials: true, crossDomain: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('SignUp Response:', response.data);
        const token = response.data.token;
        const userId = response.data.data._id;
        const userRole = response.data.data.role;
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        console.log(response.data);
        message.success('Account Created!');
      })
      .catch(error => {
        message.error('Something went wrong!');
        console.error('Error al hacer la solicitud POST:', error);
        console.error('Error en la solicitud POST:', error);
      });
  };

  return (
    <div className='signup-container'>
      <a className='logo-signup' href='/login'><img src={process.env.PUBLIC_URL + '/assets/img/logo.png'} alt='logo' className='logo-img-signup' /></a>
      <img src={process.env.PUBLIC_URL + '/assets/img/background.jpg'} alt='background' className='background-img-signup' />
      <p className='join'>Join Now .!</p>
      <div className='line'></div>
      <p className='scare'>Scare to join ?</p>
      <div className='signup-border'>
        <p className='signup-text'>Sign Up</p>
        <p className='details-text'>Just some details to get you in.!</p>
        <input className='username-signup' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className='email-signup' type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='password-signup' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className='mobile-signup' type='text' placeholder='Mobile' value={mobile} onChange={handleMobileChange} />
        <select className='role-dropdown' value={role} onChange={(e) => setRole(e.target.value)}>
          <option value='role'></option>
          <option value='student'>student</option>
          <option value='instructor'>instructor</option>
        </select>
        <input className='set-pic' type='file' onChange={handleUserPic} />
        <Link to='/login'>
          <button className='signup-button' onClick={handleSignUp}>Signup</button>
        </Link>
        <p className='already-signup'>Already registered ? <a href='/login'>Login</a></p>
        <div className='terms-support-container-signup'>
          <p>Terms & Conditions</p>
          <p>Support</p>
          <p>Customer Care</p>
        </div>
      </div>
      <div className='first-ellipse'></div>
      <div className='second-ellipse'></div>
    </div>
  );
}

export default SignUp;
