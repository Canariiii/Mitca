import React from "react";
import Header from "../../components/header/header";
import './manage.css';
import { Link } from "react-router-dom";

function Manage() {
  return (
    <div className="manage-container">
      <Header />
      <Link to={"/manage-users"}>
      <button className="manage-users" type="submit">Users</button>
      </Link>
      <Link to={"/manage-courses"}>
      <button className="manage-courses" type="submit">Courses</button>
      </Link>
    </div>
  );

}

export default Manage;