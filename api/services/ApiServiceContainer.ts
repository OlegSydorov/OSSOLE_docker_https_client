import ApplicationService from './ApplicationService';
import AuthenticationService from './AuthenticationService';
import EntityService from './EntityService';
import InventoryService from './InventoryService';
import NinjaOneBillingService from './NinjaOneBillingService';
import TaskService from './TaskService';
import UserService from './UserService';

export interface ApiServiceContainer {    

    application: ApplicationService
    authentication: AuthenticationService
    inventory: InventoryService
    invoice: NinjaOneBillingService
    entity: EntityService
    task: TaskService
    userservice:UserService
}
