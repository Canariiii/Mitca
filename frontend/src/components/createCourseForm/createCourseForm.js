import React, { useState } from "react";
import './createCourseForm.css';
import { createCourse } from '../../services/courseService'; 
import { Link } from "react-router-dom";

const CreateCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coursePic, setCoursePic] = useState(null);

  const userId = localStorage.getItem('userId');

  const onChange = (file) => {
    setCoursePic(file);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(title, description, coursePic, userId);
      console.log("Course created successfully");
    } catch (error) {
      console.error("Error creating course", error);
    }
  };

  return (
    <div className="create-course-form">
      <h1>Create Course</h1>
      <div className="create-course-line"></div>
      <form className="create-course-form-container">
        <p>Title</p>
        <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <p>Description</p>
        <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <p>Course Picture</p>
        <input type='file' id='fileInput' name='file' onChange={(event) => onChange(event.target.files[0] || null)} />
        <label htmlFor='fileInput' className='filelabel'>Search...</label>
        {coursePic && <img src={URL.createObjectURL(coursePic)} alt='Course preview' />}
        <Link to="/courses">
        <button className='create-course-button' type='submit' onClick={handleCreateCourse}>Create</button>
        </Link>
      </form>
    </div>
  );
};

export default CreateCourseForm;
