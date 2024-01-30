import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

const userService = {
  getUserById: (userId) => {
    return axios.get(`${API_URL}/${userId}`).then((response) => response.data);
  },

  createUser: (userData) => {
    console.log(userData);
    const mappedData = { ...userData };

    return axios.post(API_URL, mappedData).then((response) => response.data);
  },

  login: async (userData) => {
    try {
      console.log(`${API_URL}/login`, userData);
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
