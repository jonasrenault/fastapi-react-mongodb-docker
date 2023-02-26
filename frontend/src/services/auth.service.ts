import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/';

interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class AuthService {
  async register(user: UserRegister) {
    if (!(user.firstName && user.firstName.length > 0)) {
      throw new Error('First name was not provided');
    }
    if (!(user.lastName && user.lastName.length > 0)) {
      throw new Error('Last name was not provided');
    }
    if (!(user.email && user.email.length > 0)) {
      throw new Error('Email was not provided');
    }
    if (!(user.password && user.password.length > 0)) {
      throw new Error('Password was not provided');
    }
    const response = await axios.post(API_URL + 'users', {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
    });

    return response.data;
  }

  async login(data: FormData) {
    const response = await axios.post(API_URL + 'login/access-token', data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default new AuthService();
