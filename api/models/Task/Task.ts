import type TaskType from './TaskType'
import type TaskStatus from './TaskStatus'
import type TaskPriority from './TaskPriority'
import type TaskCategory from './TaskCategory'
import type Tag from './Tag'
import type User from '../User'
import type EntityReduced from './EntityReduced'
export default interface Task {
    ID: string
    TaskIdentifier: string
    Title: string
    Description: string
    CreatedDate: Date
    ModifiedDate: Date
    ResolvedDate: Date
    StartDate: Date
    EndDate: Date
    ID_TaskCategory: number
    ID_TaskStatus: number
    ID_TaskType: number
    ID_TaskPriority: number
    CreatedBy_ID_Technician: number 
    ModifiedBy_ID_Technician: number 
    ID_Entity: number
    CountIntervention: number
    CountAttachment: number
    CountComment: number
    task_category: TaskCategory
    task_status: TaskStatus
    task_priority: TaskPriority
    task_type: TaskType
    entity: EntityReduced
    techs: User[]
    tags: Tag[]
    created_user: User|null
    modified_user: User | null







}