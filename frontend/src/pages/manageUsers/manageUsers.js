import React, { useState, useEffect } from 'react';
import './manageUsers.css';
import Header from '../../components/header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import adminUserService from '../../services/adminService';
import { message } from 'antd';
import { Link } from 'react-router-dom';

function ManageUsers({ onClose }) {
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: ''
  });
  const [userPicture, setUserPicture] = useState(null);
  const [currentPic, setCurrentPic] = useState(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const onChange = (file) => {
    if (!file) {
      setUserPicture(currentPic);
      return;
    }
    setUserPicture(file);
  };

  const fetchUsers = async () => {
    try {
      const response = await adminUserService.getAllUsers();
      console.log('Respuesta del servidor:', response);
      setUsers(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const userExists = users.find(user => user._id === userId);
      if (!userExists) {
        console.error('Usuario no encontrado:', userId);
        return;
      }
      await adminUserService.deleteUserById(userId);
      await fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Usuario no encontrado:', error.response.data.error);
      } else {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = new FormData();
      updatedFormData.append('username', formData.username);
      updatedFormData.append('email', formData.email);
      updatedFormData.append('phone', formData.phone);
      updatedFormData.append('role', formData.role);
      if (userPicture) {
        updatedFormData.append('filename', userPicture, userPicture.name);
      } else {
        updatedFormData.append('filename', currentPic);
      }
      message.success('User successfully updated!');
      const response = await adminUserService.updateUserById(userId, updatedFormData);
      console.log('Usuario actualizado:', response.data);
      if (typeof onClose === 'function') {
        onClose();
      }
      window.location.reload();
    } catch (error) {
      message.success('Error updating user: ', error);
      console.error('Error al actualizar usuario:', error);

      if (error.response) {
        console.error('Datos de la respuesta:', error.response?.data);
        console.error('Estado de la respuesta:', error.response?.status);
        console.error('Encabezados de la respuesta:', error.response?.headers);
      }
    }
  };

  useEffect(() => {
    if (userId && typeof userId === 'string' && userId.trim() !== '') {
      console.log('UserId:', userId);
      adminUserService.getUserById(userId)
        .then((response) => {
          const userData = response.data;
          if (userData) {
            setFormData({
              username: userData.username || '',
              email: userData.email || '',
              phone: userData.phone || '',
              role: userData.role || '',
            });
            setCurrentPic(userData.filename || null);
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos del usuario:', error);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePopup = (userId) => {
    setUserId(userId);
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <Header />
      <h1 className='list-user-title'>Users</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className='list-users'>
          {users.map(user => (
            <li key={user._id}>
              <div>
                <img src={`http://localhost:3001/user-images/${user.filename}`} alt={user.username} />
              </div>
              <div>
                <p>{user.username}</p>
                <FontAwesomeIcon
                  className='edit-icon'
                  icon={faPenToSquare}
                  style={{ color: "#000000" }}
                  onClick={() => togglePopup(user._id)}
                />
                <FontAwesomeIcon
                  className='trash-icon'
                  icon={faTrash}
                  style={{ color: "#000000" }}
                  onClick={() => deleteUser(user._id)}
                />
              </div>
            </li>
          ))}
          <Link to={'/manage'}>
            <FontAwesomeIcon className='arrow-right' icon={faArrowRight} style={{ color: "#000000", }} />
          </Link>
        </ul>
      )}
      {showPopup && (
        <form className='edit-user-form-popup' onSubmit={handleSubmit}>
          <FontAwesomeIcon className='close-user-crud' icon={faX} style={{ color: "#000000", }} onClick={() => setShowPopup(!showPopup)} />
          <p>Username</p>
          <input type='text' name='username' placeholder='New Username' onChange={handleChange} value={formData.username || ''}></input>
          <p>Email</p>
          <input type='text' name='email' placeholder='New Email' onChange={handleChange} value={formData.email}></input>
          <p>Phone</p>
          <input type='text' name='phone' placeholder='New Phone' onChange={handleChange} value={formData.phone}></input>
          <p>Role</p>
          <input type='text' name='role' placeholder='New Role' onChange={handleChange} value={formData.role}></input>
          <input type='file' id='fileInput' onChange={(event) => onChange(event.target.files[0] || null)}></input>
          <label htmlFor='fileInput' className='fileLabel'>Search...</label>
          <button type='submit'>Save Changes</button>
        </form>
      )}
    </div>
  );
}

export default ManageUsers;
