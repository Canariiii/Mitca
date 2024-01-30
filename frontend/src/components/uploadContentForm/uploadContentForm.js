import React, { useState } from "react";
import axios from 'axios';
import './uploadContentForm.css';
import { message } from 'antd';

const UploadContentForm = () => {
  const [content, setContent] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setContent(selectedFile);
  };

  const uploadContent = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('user', userId);
      formData.append('contentType', 'file');
      formData.append('contentData', content.name);
      formData.append('file', content);

      const response = await axios.post('http://localhost:3001/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log("Content uploaded successfully:", response.data.data);
        message.success('Content uploaded');
      } else {
        message.error('Error on the upload', response.data.error);
        console.error('Error uploading content:', response.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error uploading content:', error);
    }
  };

  return (
    <div className="upload-container">
      <p>Content</p>
      <input type="file" id='fileInput' name="content" onChange={handleFileChange} />
      <label htmlFor='fileInput' className='fileLabel-content'>Search...</label>
      <button onClick={uploadContent}>Upload Content</button>
    </div>
  );
};

export default UploadContentForm;
