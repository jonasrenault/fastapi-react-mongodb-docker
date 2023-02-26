import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/';

class UserService {
  async getProfile() {
    const response = await axios.get(API_URL + 'users/me');
    return response.data;
  }
}

export default new UserService();
