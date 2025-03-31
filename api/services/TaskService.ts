import type Task from '../models/Task/Task';
import type TaskType from '../models/Task/TaskType';
import type TaskStatus from '../models/Task/TaskStatus';
import type TaskPriority from '../models/Task/TaskPriority';
import type TaskCategory from '../models/Task/TaskCategory';
import type Tag from '../models/Task/Tag';
import type EntityReduced from '../models/Task/EntityReduced';
import type Entity from '../models/Entity';
import type User from '../models/User';

import type Message from '../models/Message';
import { ApiServiceBase } from "./ApiServiceBase";

//export class TaskService {
export default class TaskService extends ApiServiceBase {

    protected config = useRuntimeConfig();
    protected apiConfig = this.config.public.api;
    protected baseUrl = this. apiConfig.baseUrl;
    protected midUrl = "/task";
    protected getUrl = "/get/";
    protected addUrl = "/add/";
    protected deleteUrl = "/delete/";
    protected updateUrl = "/update/";
    
    //=====================================================================================================//
    //TASK crud functions
    //=====================================================================================================//
    public async getTasks(): Promise<Task[]> {
        console.log("Get all tasks URL :", this.baseUrl + this.midUrl + this.getUrl + `tasks`);
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `tasks`);        
        const jsonData = await response.json()
        console.log("JSON", jsonData);       
        return jsonData;
    }

    public async getEntityByID(id: Number): Promise<Entity> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByID / id=${ id }`);       
        const jsonData = await response.json()
        console.log("entity by id JSON", jsonData);      
        return jsonData;
    }

   

    async createEntity(        
        FirstName: string,
        LastName: string,
        CompanyName:string,
        ID_EntityType: number,
        ID_IndividualTitle: number,
        Notes: string,
        IsActive: boolean
    ): Promise<Message> {

        console.log("Data received in the addEntityService", FirstName,LastName,CompanyName,ID_EntityType,ID_IndividualTitle,Notes,IsActive);

        const url = `${this.baseUrl}${this.midUrl}${this.addUrl}entity/`;

        try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        FirstName: FirstName,
                        LastName: LastName,
                        CompanyName: CompanyName,
                        ID_EntityType: ID_EntityType,
                        ID_IndividualTitle: ID_IndividualTitle,
                        Notes: Notes,
                        IsActive: IsActive
                    }),
                }
            );
            const responseJson = await response.json();

            if (!response.ok) {
                console.error('Failed to add ENTITY:', responseJson);
                throw new Error(`Add  ENTITY failed: ${responseJson.message || response.statusText}`);
            }

            console.log(" ENTITY add response: ", responseJson);
            return responseJson;
        } catch (error) {
            console.error('Error in ADD ENTITY:', error);
            throw error;
        }
    }

    async deleteEntity(id: number): Promise<Message> {

        console.log("Data received in the delete ENTITY Service", id);
        const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}entity/id=${id}`;
        console.log(url);
        try {

            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

            const responseJson = await response.json();

            if (!response.ok) {
                console.error('Failed to delete ENTITY:', responseJson);
                throw new Error(`Delete ENTITY failed: ${responseJson.message || response.statusText}`);
            }

            console.log("ENTITY delete response: ", responseJson);
            return responseJson;
        } catch (error) {
            console.error('Error in delete ENTITY:', error);
            throw error;
        }
    }

    async updateEntity(
        ID: number,
        FirstName: string,
        LastName: string,
        CompanyName: string,
        ID_EntityType: number,
        ID_IndividualTitle: number,
        Notes: string,
        IsActive: boolean): Promise<Message> {

        console.log("Data received in the update ENTITY Service", ID, FirstName, LastName, CompanyName, ID_EntityType, ID_IndividualTitle, Notes, IsActive);


        const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}entity/`;
        try {
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID: ID,
                    FirstName: FirstName,
                    LastName: LastName,
                    CompanyName: CompanyName,
                    ID_EntityType: ID_EntityType,
                    ID_IndividualTitle: ID_IndividualTitle,
                    Notes: Notes,
                    IsActive: IsActive
                }),
            });

            const responseJson = await response.json();

            if (!response.ok) {
                console.error('Failed to update ENTITY:', responseJson);
                throw new Error(`Update ENTITY failed: ${responseJson.message || response.statusText}`);
            }

            console.log("ENTITY update response: ", responseJson);
            return responseJson;
        } catch (error) {
            console.error('Error in update ENTITY:', error);
            throw error;
        }
    }


   //=====================================================================================================//
   // Collecting various data
   //=====================================================================================================//


    async getTaskTypes(): Promise<TaskType[]> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `taskTypes`);
        const jsonData = await response.json()
        console.log("taskTypes JSON", jsonData);
        return jsonData;
    }

    async getTaskStatuses(): Promise<TaskStatus[]> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `taskStatuses`);
        const jsonData = await response.json()
        console.log("taskStatuses JSON", jsonData);
        return jsonData;
    }

    async getTaskPriorities(): Promise<TaskPriority[]> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `taskPriorities`);
        const jsonData = await response.json()
        console.log("TaskPriority JSON", jsonData);
        return jsonData;
    }

    async getTaskCategories(): Promise<TaskCategory[]> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `taskCategories`);
        const jsonData = await response.json()
        console.log("TaskCategory JSON", jsonData);
        return jsonData;
    }

    async getTaskTags(): Promise<Tag[]> {
        const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `taskTags`);
        const jsonData = await response.json()
        console.log("TaskPriority JSON", jsonData);
        return jsonData;
    }
};
