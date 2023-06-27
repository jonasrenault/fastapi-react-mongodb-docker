import { createContext, FC, useState, ReactNode, useContext, useEffect } from 'react'
import userService from '../services/user.service'
import authService from '../services/auth.service'
import { User } from '../models/user'

type AuthContextType = {
  user: User | undefined
  setUser: (user: User | undefined) => void
  login: (data: FormData) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthProvider: FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>()

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const user = await userService.getProfile()
        setUser(user)
      } catch (error) {
        setUser(undefined)
      }
    }
    fetchUserProfile()
  }, [])

  const login = async (data: FormData) => {
    await authService.login(data)
    const user = await userService.getProfile()
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>
  )
}

const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
