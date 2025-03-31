export default interface AuthUser {
    id: number
    first_name: string
    last_name: string
    created_at: string | null
    modified_at: string | null
    email:string
    role_id: number
}