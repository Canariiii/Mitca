import axios from 'axios';

const API_URL = 'http://localhost:3001/users';
const API_URL_ID = 'http://localhost:3001/users/profile';
const API_URL_COURSE = 'http://localhost:3001/courses';

const adminUserService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      console.log('Respuesta del servidor (getAllUsers):', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const url = `${API_URL_ID}/${userId}`;
      console.log('URL de la solicitud:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL_ID}/${userId}`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      } else {
        throw error;
      }
    }
  },

  createCourse: async (title, description, file, instructor) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("instructor", instructor);
      const response = await axios.post(API_URL_COURSE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating course", error);
      throw error;
    }
  },

  getCourses: async () => {
    try {
      const response = await axios.get(API_URL_COURSE);
      return response.data;
    } catch (error) {
      console.error("Error getting courses", error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL_COURSE}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting course with ID ${courseId}`, error);
      throw error;
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("contentId", courseData.contentId);
      formData.append("instructorId", courseData.instructorId);
      if (courseData.filename) {
        formData.append("filename", courseData.filename);
      }
      const response = await axios.put(`${API_URL_COURSE}/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${courseId}`, error);
      throw error;
    }
  },

  updateCourseById: async (courseId, courseData) => {
    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      if (courseData.filename && courseData.filename) {
        formData.append("filename", courseData.filename);
      }
  
      formData.append("instructor", courseData.instructor);
  
      const response = await axios.put(`${API_URL_COURSE}/update/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${courseId}`, error);
      throw error;
    }
  },

  deleteCourseById: async (courseId) => {
    try {
      const response = await axios.delete(`${API_URL_COURSE}/${courseId}`);
      if (response.data.success) {
        console.log("Course deleted successfully:", response.data);
      } else {
        console.error("Error deleting course:", response.data.error);
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};

export default adminUserService;
