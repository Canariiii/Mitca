import React from "react";
import Header from "../../components/header/header";
import './courses.css';
import CoursesList from "../../components/coursesList/coursesList";

function Courses() {
  return (
    <div>
      <Header />
      <p className="course-text">What would you like to learn?</p>
      <CoursesList />
    </div>
  );
}

export default Courses;