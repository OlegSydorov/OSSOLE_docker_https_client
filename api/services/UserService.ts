import type Message from '../models/Message';
import { ApiServiceBase } from './ApiServiceBase';
import type UserRole from '../models/UserRole';
import type User from '../models/User';

export default class UserService extends ApiServiceBase {

    async getAllUsers(): Promise<User[]> {
        console.log("UserService executing method getAllUsers" );
      return await this.call(
          '/user/get/users',
          {
              method:'get',
          }
      );
    }

    async getAllRoles(): Promise<UserRole[]> {
        console.log("UserService executing method getAllRoles");
        return await this.call(
            '/user/get/userRoles',
            {
                method: 'get',
            }
        );
    }


    async getRoleById(id: number): Promise<UserRole> {
        console.log("UserService executing method getRoleById - id:",id );
      return await this.call(
          `/user/get/userRole/role_id=${id}`,
          {
              method: 'get',
          }
      );
  }

}
