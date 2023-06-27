export interface User {
  uuid: string
  email: string
  password?: string
  first_name?: string
  last_name?: string
  provider?: string
  picture?: string
  is_active?: boolean
  is_superuser?: boolean
}
