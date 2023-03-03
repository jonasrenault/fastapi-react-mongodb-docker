import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface UserRegister {
  first_name: string
  last_name: string
  email: string
  password: string
}

class AuthService {
  async register(user: UserRegister) {
    const response = await axios.post(API_URL + 'users', user)
    return response.data
  }

  async login(data: FormData) {
    const response = await axios.post(API_URL + 'login/access-token', data)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
    }
    return response.data
  }

  logout() {
    localStorage.removeItem('token')
  }
}

export default new AuthService()
