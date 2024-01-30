import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import './editCourseForm.css';
import { getCourseById } from "../../services/courseService";
import { message } from 'antd';

const EditCourseForm = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    selectedContent: null,
    selectedInstructor: null,
    filename: '',
  });
  const [contents, setContents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [coursePicture, setCoursePicture] = useState(null);
  const [currentPic, setCurrentPic] = useState(null);

  const onChange = (event) => {
    if (!event || !event.target) {
      console.error('Event or event.target is undefined');
      return;
    }
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }
    setCoursePicture(file);
    setCourseData((prevData) => ({
      ...prevData,
      filename: file.name || '',
    }));
    console.log(file);
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/instructors`)
      .then(response => {
        setInstructors(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching instructor list:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3001/courses/${courseId}`)
      .then(response => {
        const { title, description, content } = response.data.data;
        setCourseData({
          title,
          description,
          selectedContent: content?._id || "",
        });
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
      });
  }, [courseId]);

  useEffect(() => {
    axios.get(`http://localhost:3001/content`)
      .then(response => {
        setContents(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching content list:', error);
      });
  }, []);

  const handleInstructorChange = async (e) => {
    const selectedInstructorId = e.target.value;
    try {
      const response = await axios.get(`http://localhost:3001/instructors/${selectedInstructorId}`);
      const selectedInstructor = response.data.data
      console.log(selectedInstructor);
      setCourseData((prevData) => ({
        ...prevData,
        selectedInstructor: selectedInstructorId,
        instructorName: selectedInstructor ? selectedInstructor.username : "",
      }));
    } catch (error) {
      console.error('Error al obtener datos del instructor:', error);
    }
  };

  const handleContentChange = (e) => {
    const selectedContentId = e.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      selectedContent: selectedContentId,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCourse = new FormData();
      updatedCourse.append('title', courseData.title || '');
      updatedCourse.append('description', courseData.description || '');
      updatedCourse.append('contentId', courseData.selectedContent || '');
      updatedCourse.append('instructorId', courseData.selectedInstructor || '');
      if (courseData.filename) {
        updatedCourse.append('file', coursePicture, courseData.filename);
      } else {
        updatedCourse.append('file', currentPic);
      }
      const courseResponse = await axios.put(`http://localhost:3001/courses/update/${courseId}`, updatedCourse);
      console.log(courseData);
      message.success('Course updated!');
      console.log("Course updated successfully:", courseResponse);
    } catch (error) {
      message.error('Error updating course:', error.response ? error.response.data : error);
      console.error('Error updating course:', error.response ? error.response.data : error);
      console.error('Error updating course:', error.response || error);
    }
  };

  useEffect(() => {
    if (courseId && typeof courseId === 'string' && courseId.trim() !== '') {
      getCourseById(courseId)
        .then((response) => {
          const courseData = response.data;
          if (courseData) {
            setCourseData({
              title: courseData.title || '',
              description: courseData.description || '',
              contentId: courseData.selectedContent,
              instructorId: courseData.selectedInstructor,
            });
            setCurrentPic(courseData.filename || null);
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos del usuario:', error);
        });
    }
  }, [courseId]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
    if (e.target.name === 'filename' && e.target.value !== undefined) {
      setCourseData({ ...courseData, filename: e.target.value });
    }
  };

  return (
    <form className='edit-course-form-popup' onSubmit={handleSubmit}>
      <p>Title</p>
      <input
        type='text'
        name='title'
        placeholder='New Title'
        value={courseData.title}
        onChange={handleChange}
      />
      <p>Description</p>
      <input
        type='text'
        name='description'
        placeholder='New Description'
        value={courseData.description}
        onChange={handleChange}
      />
      <p>Content</p>
      <option value="" disabled></option>
      <select id="contentDropdown" name="content" value={courseData.selectedContent || ""} onChange={handleContentChange}>
        <option value="" disabled>Select Content</option>
        {contents.map(content => (
          <option key={content._id} value={content._id}>
            {content.contentData}
          </option>
        ))}
      </select>
      <p>Instructor</p>
      <select id="instructorDropdown" name="instructor" value={courseData.selectedInstructor || ""} onChange={handleInstructorChange}>
            <option value="" disabled>Select Instructor</option>
            {instructors.map(instructor => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.username}
              </option>
            ))}
          </select>
      <input type='file' id='fileInput' onChange={onChange}></input>
      <label htmlFor='fileInput' className='file-label-courses-form'>Search...</label>
      <button type='submit'>Save Course</button>
    </form>
  );
}

export default EditCourseForm;
