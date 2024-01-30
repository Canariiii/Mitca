import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Signuplogin from "./pages/signuplogin/signuplogin";
import Profile from "./pages/profile/profile";
import UserPreferences from "./pages/userPreferences/userPreferences";
import Courses from "./pages/courses/courses";
import CreateCourse from "./pages/createCourse/createCourse";
import Manage from "./pages/manage/manage";
import ManageUsers from "./pages/manageUsers/manageUsers";
import EdtiCourse from "./pages/editCourse/editCourse";
import UploadContent from "./pages/uploadContent/uploadContent";
import ManageCourses from "./pages/manageCourses/manageCourses";
import Course from "./pages/course/course";
import MyCourses from "./pages/myCourses/myCourses";

function App() {
  const userRole = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signuplogin />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-preferences-form" element={<UserPreferences />} />
        <Route path="/create-course" element={userRole === 'instructor' ? (<CreateCourse />) : (<Navigate to="/courses" />)} />
        <Route path="/edit-course/:courseId" element={userRole === 'instructor' ? (<EdtiCourse />) : (<Navigate to="/courses" />)} />
        <Route path="/upload-content" element={userRole === 'instructor' ? (<UploadContent />) : (<Navigate to="/courses" />)} />
        <Route path="/manage" element={userRole === 'admin' ? <Manage /> : (<Navigate to="/courses" />)} />
        <Route path="/manage-users" element={userRole === 'admin' ? (<ManageUsers />) : (<Navigate to="/courses" />)} />
        <Route path="/manage-courses" element={userRole === 'admin' ? (<ManageCourses />) : (<Navigate to="/courses" />)} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/course/:courseId/details" element={<Course />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
