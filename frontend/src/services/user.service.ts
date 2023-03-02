import axios from 'axios';
import { User } from '../contexts/auth';

const API_URL = 'http://localhost:8000/api/v1/';

class UserService {
  async getProfile(): User {
    const response = await axios.get(API_URL + 'users/me');
    return response.data;
  }

  async updateProfile(profile: User): User {
    const response = await axios.patch(API_URL + 'users/me', profile);
    return response.data;
  }

  async updateUser(userId: string, profile: User): User {
    const response = await axios.put(API_URL + `users/${userId}`, profile);
    return response.data;
  }

  async getUsers(): Array<User> {
    const response = await axios.get(API_URL + 'users');
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await axios.delete(API_URL + `users/${userId}`);
    return response.data;
  }
}

export default new UserService();
