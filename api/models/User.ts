import type UserRole from './UserRole'
export default interface User {
    id: number
    first_name: string
    last_name: string    
    email:string
    created_at: string|null
    modified_at: string|null
    role_id: number
    user_role: UserRole
}