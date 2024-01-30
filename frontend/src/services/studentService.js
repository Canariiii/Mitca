import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const updateStudentCourses = async (studentId, courseId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/students/${studentId}/update-courses`, {
      courseId,
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
