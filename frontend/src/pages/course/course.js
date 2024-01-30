import React, { useState, useEffect } from "react";
import Header from '../../components/header/header';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './course.css';
import { useNavigate } from 'react-router-dom';

function Course() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    content: {
      _id: "",
      contentType: "",
      contentData: "",
    },
    instructor: {
      _id: "",
      username: "",
      filename: "",
    },
    filename: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/courses/${courseId}`)
      .then(response => {
        const { title, description, content, instructor, filename } = response.data.data;
        console.log('Course Data:', response.data.data);
        setCourseData({
          title,
          description,
          content: content || { _id: "", contentType: "", contentData: "" },
          instructor: instructor || { _id: "", username: "", filename: "" },
          filename: filename
        });
        if (instructor) {
          axios.get(`http://localhost:3001/instructors/${instructor}`)
            .then(instructorResponse => {
              const { username, filename } = instructorResponse.data.data;
              setCourseData(prevData => ({
                ...prevData,
                instructor: {
                  ...prevData.instructor,
                  username,
                  filename,
                },
              }));
            })
            .catch(instructorError => {
              console.error('Error fetching instructor details:', instructorError);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
      });
  }, [courseId, courseData.content.contentData, courseData.content.contentType]);

  const goToMyCourses = () => {
    navigate('/my-courses');
  }

  return (
    <div>
      <Header />
      <div className="course-data-container">
        <h1 className="course-data-title">{courseData.title}</h1>
        <p>{courseData.description}</p>
        <p>{courseData.instructor.username}</p>
        {courseData.filename && (
          <img src={`http://localhost:3001/user-images/${courseData.filename}`} alt="Instructor" />
        )}
        {courseData.instructor.filename && (
          <img src={`http://localhost:3001/user-images/${courseData.instructor.filename}`} alt="Instructor" />
        )}
        {courseData.content.contentType === 'file' && courseData.content.contentData && (
          <div>
            <iframe
              src={`http://localhost:3001/user-images/${courseData.content.contentData}`} className="video-container" title="File Content" />
          </div>
        )}
        {courseData.content.contentType === 'video' && courseData.content.contentData && (
          <div>
            <p>Video Content:</p>
            <video className="video" controls width="600">
              <source src={`http://localhost:3001/user-images/${courseData.content.contentData}`} type={courseData.content.contentType} />
            </video>
          </div>
        )}
        <button onClick={goToMyCourses}>Finish</button>
      </div>
    </div>
  );
}

export default Course;
