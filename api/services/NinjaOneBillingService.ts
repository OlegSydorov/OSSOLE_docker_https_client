import type TicketBoard from '../models/NinjaOne/TicketBoard';
import type NinjaOneUser from '../models/NinjaOne/NinjaOneUser';
import type NinjaOneOrganization from '../models/NinjaOne/NinjaOneOrganization';
import type NinjaOneClient from '../models/NinjaOne/NinjaOneClient';
import type NinjaOneLocation from '../models/NinjaOne/NinjaOneLocation';
import type NinjaOneStatus from '../models/NinjaOne/NinjaOneStatus';
import type NinjaOneTicket from '../models/NinjaOne/NinjaOneTicket';
import type NinjaOneIntervention from '../models/NinjaOne/NinjaOneIntervention';

import type Message from '../models/Message';

import { ApiServiceBase } from './ApiServiceBase';

//export class NinjaOneBillingService {
export default class NinjaOneBillingService extends ApiServiceBase {
    //protected config = useRuntimeConfig();
    //protected apiConfig = this.config.public.api;
    //protected baseUrl = this.apiConfig.baseUrl;
    protected midNinjaOneUrl = "/billing";
    protected getNinjaOneUrl = "/get/";

    protected midMySqlUrl = "/invoice";
    protected getMySqlUrl = "/get/";
    protected addMySqlUrl = "/add/";
    protected updateMySqlUrl = "/update/";  


    // !!! REQUEST TO NINJAONE !!!
    //Get all users
    public async getNinjaOneUsers(): Promise<NinjaOneUser[]> {

        //const getNinjaOneUsersUrl = this.baseUrl + this.midNinjaOneUrl + this.getNinjaOneUrl + `users`;
        const getNinjaOneUsersUrl = this.midNinjaOneUrl + this.getNinjaOneUrl + `users`;

        console.log("Get all NinjaOne Users", getNinjaOneUsersUrl);

        const ninjaOneUsersResponse = await this.call(
            getNinjaOneUsersUrl,
            { method: 'get' }
        );
        //const jsonData = await response.json()
        console.log("JSON", ninjaOneUsersResponse);
        return ninjaOneUsersResponse;
    }

    // !!! REQUEST TO NINJAONE !!!
    //Get all organizations with tickets based on the time of interventions 
    public async getOrganizationsWithTickets(year:String, month:String): Promise<NinjaOneOrganization[]> {

        //const getNinjaOneOrganizationsWithTicketsUrl = this.baseUrl + this.midNinjaOneUrl + this.getNinjaOneUrl + `organizationsWithTickets/${year}/${month}`;
        //const getNinjaOneOrganizationsWithTicketsUrl = this.midNinjaOneUrl + this.getNinjaOneUrl + `organizationsWithTickets/${year}/${month}`;
        //const getNinjaOneOrganizationsWithTicketsUrl = '/organization' + this.getNinjaOneUrl + `organizations/${year}/${month}`;
       const getNinjaOneOrganizationsWithTicketsUrl = `/list/get/list/period=${year}${month}`;
        console.log("Get all organizations with tickets", getNinjaOneOrganizationsWithTicketsUrl);

        try {
            const ninjaOneOrganizationsFullResponse = await this.call(
                getNinjaOneOrganizationsWithTicketsUrl,
                { method: 'get' }
            );
            // const jsonData = await response.json()
            console.log("organizations with tickets JSON", ninjaOneOrganizationsFullResponse);
            return ninjaOneOrganizationsFullResponse;
        }
        catch (error) {
            console.log("error caught in getOrganizationsWithTickets: ", error);
            return [];
        }
    }

    public async getClients(): Promise<NinjaOneClient[]> {

        //const getNinjaOneOrganizationsWithTicketsUrl = this.baseUrl + this.midNinjaOneUrl + this.getNinjaOneUrl + `organizationsWithTickets/${year}/${month}`;
        const getNinjaOneClientsUrl = '/client' + this.getNinjaOneUrl + `clients`;

        console.log("Get all clients ", getNinjaOneClientsUrl);

        try {
            const ninjaOneClientsFullResponse = await this.call(
                getNinjaOneClientsUrl,
                { method: 'get' }
            );
            // const jsonData = await response.json()
            console.log("clients JSON", ninjaOneClientsFullResponse);
            return ninjaOneClientsFullResponse;
        }
        catch (error) {
            console.log("error caught in getClients: ", error);
            return [];
        }
    }

    // !!! REQUEST TO MYSQL OSSOLE DATABASE !!!
    // Check whethere invoice for current organization and month and year already exists
    public async invoiceCheck(invoiceCode: string): Promise<boolean> {

        //const invoiceCheckUrl = `${this.baseUrl}${this.midMySqlUrl}${this.getMySqlUrl}invoice/invoice_code=${invoiceCode}`;
        const invoiceCheckUrl = `${this.midMySqlUrl}${this.getMySqlUrl}invoice/invoice_code=${invoiceCode}`;

        console.log(`Check Invoice by code :${invoiceCode} , using URL: ${invoiceCheckUrl}`);

        const invoiceCheckResponse = await this.call(
            invoiceCheckUrl,
            { method: 'get', }
        );
       // const jsonData = await response.json();        
        console.log("Invoice CHECK response", invoiceCheckResponse.invoice);
        return invoiceCheckResponse.invoice;
    }

    // !!! REQUEST TO MYSQL OSSOLE DATABASE !!!
    // Get list of tickets with interventions as recorded in MySQL database (as opposed to data loaded from NinjaOne directly)
    public async getInvoice(invoiceCode: string): Promise<NinjaOneTicket[]>{

        //const invoiceDataUrl = `${this.baseUrl}${this.midMySqlUrl}${this.getMySqlUrl}invoiceData/invoice_code=${invoiceCode}`;
        const invoiceDataUrl = `${this.midMySqlUrl}${this.getMySqlUrl}invoiceData/invoice_code=${invoiceCode}`;

        console.log(`Get Invoice Data by code :${invoiceCode} , using URL: ${invoiceDataUrl}`);

        const invoiceResponse = await this.call(
            invoiceDataUrl,
            { method: 'get', }
        ); 
        const jsonData = await invoiceResponse.invoice;/// !!!!!!!!!!!!!!!!!! to be checked  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log("SERVICE invoice DATA response", jsonData);/// !!!!!!!!!!!!!!!!!! to be checked  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let tickets: NinjaOneTicket[] = [];
        for (let ticket of jsonData[0].tickets) { /// !!!!!!!!!!!!!!!!!! to be checked  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let ticketNew: NinjaOneTicket = {
                ID: ticket.ID,
                Code: ticket.Code,
                CreateTime: Number(ticket.CreateTime),
                Organization: ticket.Organization,
                Priority: ticket.Priority,
                Severity: ticket.Severity,
                Summary: ticket.Summary,
                Type: ticket.Type,
                Requester: ticket.Requester,
                UserId: ticket.UserId,
                InvoiceCode: ticket.InvoiceCode,
                Ticket:ticket.Ticket,
                User: {
                    ID: ticket.user.ID,
                    FirstName: ticket.user.FirstName,
                    LastName: ticket.user.LastName,
                    Email: ticket.user.Email,
                    Phone: ticket.user.Phone,
                    OrganizationId: ticket.user.OrganizationId,
                    DeviceIds: ticket.user.DeviceIds?ticket.user.DeviceIds.split("//").map((id: string) => Number(id)):[],
                    Roles: ticket.user.Roles?ticket.user.Roles.split("//"):[]
                },
                StatusId: ticket.StatusId,
                Status: ticket.status,
                TotalTimeInvoiced: 0,
                TotalTimeTracked: 0,
                Interventions:[],
                Tags: ticket.Tags?ticket.Tags.split('//'):[]
            };

            for (let intervention of ticket.interventions) {

                let interventionNew: NinjaOneIntervention = {
                    ID: intervention.ID,
                    Description: intervention.Description,
                    Month: intervention.Month,
                    Year: intervention.Year,
                    UserId: intervention.UserId,
                    User: {
                        ID: intervention.user.ID,
                        FirstName: intervention.user.FirstName,
                        LastName: intervention.user.LastName,
                        Email: intervention.user.Email,
                        Phone: intervention.user.Phone,
                        OrganizationId: intervention.user.OrganizationId,
                        DeviceIds: intervention.user.DeviceIds?intervention.user.DeviceIds.split("//").map((id:string)=>Number(id)):[],
                        Roles: intervention.user.Roles? intervention.user.Roles.split("//"):[]                        
                    },
                    IsInvoiced: Boolean(intervention.IsInvoiced),
                    TimeTracked: intervention.TimeTracked,
                    CreateTime: Number(intervention.CreateTime),
                    TicketId:intervention.TickleID
                }
                ticketNew.Interventions.push(interventionNew);
                ticketNew.TotalTimeTracked += intervention.TimeTracked;
                if (intervention.IsInvoiced == 1) {
                    ticketNew.TotalTimeInvoiced += intervention.TimeTracked;
                }
            }

            tickets.push(ticketNew);
        }
        console.log("SERVICE ticket list prepared for sending to page", tickets);
        return tickets;

        //return {
        //    ID: 0, Name: '', Description: '', Locations: [], Tickets: [],
        //    OnContract: 0, TicketsCount: 0, ClosedTicketsCount: 0,
        //    InterventionsCount: 0, InvoicedInterventionsCount: 0,
        //    HoursCount: 0, InvoicedHoursCount: 0,
        //};
    }

    public async saveInvoice(organization: NinjaOneOrganization, year:number, month:number): Promise<Message> {
        const invoiceCode = organization.ID + "_" + year + "_" + month;
        console.log(`Data received in the saveInvoice function: ${organization} invoice code generated: ${invoiceCode}`);
        let resultString = '';
        try {
            const invoiceResponse = await this.createInvoice(invoiceCode);
            resultString += JSON.stringify(invoiceResponse);

            for (let ticket of organization.Tickets) {
                const statusResponse = await this.createStatus(
                    ticket.Status.StatusId,
                    ticket.Status.DisplayName,
                    ticket.Status.Name);
                resultString += JSON.stringify(statusResponse);

                const userResponse = await this.createUser(
                    ticket.User.ID,
                    ticket.User.FirstName,
                    ticket.User.LastName,
                    ticket.User.Email,
                    ticket.User.Phone,
                    ticket.User.OrganizationId,
                    ticket.User.DeviceIds,
                    ticket.User.Roles);
                resultString += JSON.stringify(userResponse);

                const ticketResponse = await this.createTicket(
                    ticket.ID,
                    invoiceCode,
                    ticket.Code,
                    ticket.Organization,
                    ticket.Priority,
                    ticket.Severity,
                    ticket.Summary,
                    ticket.StatusId,
                    ticket.CreateTime,
                    ticket.Tags,
                    ticket.UserId,
                    ticket.Requester,
                    ticket.Type, 
                    ticket.Ticket,
                );
                resultString += JSON.stringify(ticketResponse);

                for (let intervention of ticket.Interventions) {
                    const userIntResponse = await this.createUser(
                        intervention.User.ID,
                        intervention.User.FirstName,
                        intervention.User.LastName,
                        intervention.User.Email,
                        intervention.User.Phone,
                        intervention.User.OrganizationId,
                        intervention.User.DeviceIds,
                        intervention.User.Roles);
                    resultString += JSON.stringify(userIntResponse);

                    const interventionCreateResponse = await this.createIntervention(
                        intervention.ID,
                        intervention.CreateTime,
                        intervention.Description,
                        intervention.Month,
                        intervention.Year,
                        intervention.UserId,
                        Number(intervention.IsInvoiced),
                        intervention.TimeTracked,
                        ticket.ID);
                    console.log("NinjaOneBillingService executing method saveInvoice: part interventionCreate: Response");
                    console.log(interventionCreateResponse);
                    console.log(interventionCreateResponse.code);
                    if (interventionCreateResponse.code != 200) {
                        const interventionUpdateResponse = await this.updateIntervention(
                            intervention.ID,
                            intervention.CreateTime,
                            intervention.Description,
                            intervention.Month,
                            intervention.Year,
                            intervention.UserId,
                            Number(intervention.IsInvoiced),
                            intervention.TimeTracked,
                            ticket.ID);
                        resultString += JSON.stringify(interventionUpdateResponse);
                    }
                    else {
                        resultString += JSON.stringify(interventionCreateResponse);
                    }                   
                }
            }
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: resultString,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in SAVE INVOICE:', error);
            const message: Message = {
                header: 'Save Invoice method failed',
                message: error.toString(),
                code: 400
            }
            return message;
        }
    }

    public async changeIntervention(intervention: NinjaOneIntervention): Promise<Message> {
        let resultString = '';
        try {
            const interventionCreateResponse = await this.createIntervention(
                        intervention.ID,
                        intervention.CreateTime,
                        intervention.Description,
                        intervention.Month,
                        intervention.Year,
                        intervention.UserId,
                        Number(intervention.IsInvoiced),
                intervention.TimeTracked,
                intervention.TicketId,
                intervention.TicketCode
            );
                    console.log("NinjaOneBillingService executing method saveInvoice: part interventionCreate: Response");
                    console.log(interventionCreateResponse);
                    console.log(interventionCreateResponse.code);
                    if (interventionCreateResponse.code != 200) {
                        const interventionUpdateResponse = await this.updateIntervention(
                            intervention.ID,
                            intervention.CreateTime,
                            intervention.Description,
                            intervention.Month,
                            intervention.Year,
                            intervention.UserId,
                            Number(intervention.IsInvoiced),
                            intervention.TimeTracked,
                            intervention.TicketId,
                            intervention.TicketCode
                        );
                        resultString += JSON.stringify(interventionUpdateResponse);
                    }
                    else {
                        resultString += JSON.stringify(interventionCreateResponse);
                    }
                
            
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: resultString,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in SAVE INVOICE:', error);
            const message: Message = {
                header: 'Save Invoice method failed',
                message: error.toString(),
                code: 400
            }
            return message;
        }
    }

    public async createIntervention(
        ID: number,
        CreateTime: number,
        Description: string,
        Month: number,
        Year: number,
        UserId: number,
        IsInvoiced: number,
        TimeTracked: number,
        TicketId: number,
        TicketCode: string): Promise<Message> {

        console.log("Data received in the addIntervention", ID,CreateTime,Description,Month,Year,UserId,IsInvoiced,TimeTracked,TicketId, TicketCode);

        //const addInterventionUrl = `${this.baseUrl}${this.midMySqlUrl}${this.addMySqlUrl}intervention/`;
        const addInterventionUrl = `${this.midMySqlUrl}${this.addMySqlUrl}intervention/`;

        try {
            const createInterventionResponse = await this.call(
                addInterventionUrl,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ID: ID,
                        CreateTime: CreateTime.toString(),
                        Description: Description,
                        Month: Month,
                        Year: Year,
                        UserId: UserId,
                        IsInvoiced: IsInvoiced,
                        TimeTracked: TimeTracked,
                        TicketId: TicketId,
                        TicketCode: TicketCode
                    }),
                }
            );
           // const responseJson = await response.json();

            if (createInterventionResponse.code!=200) { //
                console.error('Failed to add INTERVENTION:', createInterventionResponse);/// !!!!!!!!!!!!!!!!!! to be checked  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //throw new Error(`Add  INTERVENTION failed: ${createInterventionResponse}`);// `.message || response.statusText}`); /// !!!!!!!!!!!!!!!!!! to be checked  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                return {
                    header: "Add  INTERVENTION failed",
                    message: createInterventionResponse,
                    code: 400
                };    
            }

            console.log(" INTERVENTION add response: ", createInterventionResponse);
            return {
                header: "Intervention successfully created",
                message: createInterventionResponse,
                code: 100
            };
        } catch (error) {
            console.error('Error in ADD INTERVENTION:', error);
            return {
                header: "Error while adding intervention",
                message: error.toString(),
                code: 400
            };            
        }
    }

    public async updateIntervention(
        ID: number,
        CreateTime: number,
        Description: string,
        Month: number,
        Year: number,
        UserId: number,
        IsInvoiced: number,
        TimeTracked: number,
        TicketId: number,
        TicketCode: string): Promise<Message> {

        console.log("Data received in the UPDATE INTERVENTION", ID, CreateTime, Description, Month, Year, UserId, IsInvoiced, TimeTracked, TicketId, TicketCode);

        //const updateInterventionUrl = `${this.baseUrl}${this.midMySqlUrl}${this.updateMySqlUrl}intervention/`;
        const updateInterventionUrl = `${this.midMySqlUrl}${this.updateMySqlUrl}intervention/`;

        try {
            const updateInterventionResponse = await this.call(
                updateInterventionUrl,
                {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ID: ID,
                        CreateTime: CreateTime.toString(),
                        Description: Description,
                        Month: Month,
                        Year: Year,
                        UserId: UserId,
                        IsInvoiced: IsInvoiced,
                        TimeTracked: TimeTracked,
                        TicketId: TicketId,
                        TicketCode: TicketCode
                    }),
                }
            );
          //  const responseJson = await response.json();

            if (updateInterventionResponse.code != 200) {
             //   console.error('Failed to UPDATE INTERVENTION:', responseJson);
                throw new Error(`UPDATE INTERVENTION failed: ${updateInterventionResponse}`);
            }

            console.log(" UPDATE INTERVENTION response: ", updateInterventionResponse);
            return {
                header: "Intervention successfully updated",
                message: updateInterventionResponse, //!!!!!!!!!!!!!!!!!!!! to be checked !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                code: 200
            }; 
        } catch (error) {
                console.error('Error in UPDATE INTERVENTION:', error);
          //  throw new Error(error.toString());
            return {
                header: "Error while updating intervention",
                message: error.toString(),
                code: 400
            };  
        }
    }

    public async createStatus(
        ID: number,
        Name: string,
        DisplayName: string): Promise<Message> {

        console.log("Data received in the addStatus", ID, Name, DisplayName);
       
        //const createStatusUrl = `${this.baseUrl}${this.midMySqlUrl}${this.addMySqlUrl}status/`;
        const createStatusUrl = `${this.midMySqlUrl}${this.addMySqlUrl}status/`;

        try {
            const createStatusResponse = await this.call(
                createStatusUrl,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        StatusId: ID,
                        Name: Name, 
                        DisplayName: DisplayName
                    }),
                }
            );
            //const responseJson = await response.json();

            if (createStatusResponse.code != 200) {
                console.error('Failed to add STATUS:', createStatusResponse);
                //throw new Error(`Add  STATUS failed: ${createStatusResponse}`);
                return {
                    header: "Add status failed",
                    message: createStatusResponse,
                    code: 400
                };  
            }

            console.log(" STATUS add response: ", createStatusResponse);
            return {
                header: "Status added successfully",
                message: createStatusResponse,
                code:200
            };
        } catch (error) {
            console.error('Error in ADD STATUS:', error);
            //throw new Error(error.toString());
            return {
                header: "Error while adding status",
                message: error.toString(),
                code: 400
            };  
        }
    }  

    public async createUser(
        ID: number,
        FirstName: string,
        LastName: string,
        Email: string,
        Phone: string,
        OrganizationId: number,
        DeviceIds: [],
        Roles: []): Promise<Message> {

        console.log("Data received in the addUser", ID, FirstName,LastName,Email,Phone,OrganizationId,DeviceIds,Roles);

        //const addUserUrl = `${this.baseUrl}${this.midMySqlUrl}${this.addMySqlUrl}user/`;
        const addUserUrl = `${this.midMySqlUrl}${this.addMySqlUrl}user/`;

        try {
            const addUserResponse = await this.call(
                addUserUrl,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ID: ID,
                        FirstName: FirstName,
                        LastName: LastName,
                        Email: Email,
                        Phone: Phone,
                        OrganizationId: OrganizationId,
                        DeviceIds:DeviceIds?DeviceIds.join('//'):'',
                        Roles: Roles?Roles.join('//'):''
                    }),
                }
            );
            //const responseJson = await response.json();

            if (addUserResponse.code != 200) {
                console.error('Failed to add USER:', addUserResponse);
                //throw new Error(`Add  USER failed: ${responseJson.message || response.statusText}`);
                return {
                    header: "Adding status failed",
                    message: addUserResponse,
                    code: 400
                };  
            }

            console.log(" USER add response: ", addUserResponse);
            return {
                header: "User added successfully",
                message: addUserResponse,
                code: 200
            };
;
        } catch (error) {
            console.error('Error in ADD USER:', error);
           // throw new Error(error.toString());
            return {
                header: "Error while adding user",
                message: error.toString(),
                code: 400
            };  
        }
    }

    public async createTicket(        
        ID: number,
        InvoiceCode:string,
        Code: string,
        Organization: string,
        Priority: string,
        Severity: string,
        Summary: string,
        StatusId: number,
        CreateTime: number,
        Tags: [],
        UserId: number,
        Requester: string,
        Type: string,
        Ticket:boolean): Promise<Message> {

        console.log("Data received in the add TICKET", ID, InvoiceCode, Code, Organization, Priority, Severity, Summary, StatusId,CreateTime, Tags, UserId, Requester, Type, Ticket);

        //const createTicketUrl = `${this.baseUrl}${this.midMySqlUrl}${this.addMySqlUrl}ticket/`;
        const createTicketUrl = `${this.midMySqlUrl}${this.addMySqlUrl}ticket/`;

        try {
            const createTicketResponse = await this.call(
                createTicketUrl,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ID: ID,
                        Code: Code,
                        InvoiceCode:InvoiceCode,
                        Organization: Organization,
                        Priority: Priority,
                        Severity: Severity,
                        Summary: Summary,
                        StatusId: StatusId,
                        CreateTime: CreateTime.toString(),
                        Tags: Tags?Tags.join('//'):'',
                        UserId: UserId,
                        Requester: Requester,
                        Type: Type,
                        Ticket:Ticket
                    }),
                }
            );
           // const responseJson = await response.json();

            if (createTicketResponse.code != 200) {
                console.error('Failed to add TICKET:', createTicketResponse);
                //throw new Error(`Add  TICKET failed: ${responseJson.message || response.statusText}`);
                return {
                    header: 'Adding ticket failed',
                    message: createTicketResponse,
                    code:400
                };
            }

            console.log(" TICKET add response: ", createTicketResponse);
            return {
                header: "ticket added successfully",
                message: createTicketResponse,
                code: 200
            };
;
        } catch (error) {
            console.error('Error in ADD TICKET:', error);
            //throw new Error(error.toString());
            return {
                header: "Error while adding ticket",
                message: error.toString(),
                code: 400
            }; 
        }
    }

    public async createInvoice( Code: string): Promise<Message> {

        console.log("Data received in the addInvoice", Code);

        //const createInvoiceUrl = `${this.baseUrl}${this.midMySqlUrl}${this.addMySqlUrl}invoice/`;
        const createInvoiceUrl = `${this.midMySqlUrl}${this.addMySqlUrl}invoice/`;

        try {
            const createInvoiceResponse = await this.call(
                createInvoiceUrl,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Code: Code
                    }),
                }
            );
           // const responseJson = await response.json();

            if (createInvoiceResponse.code!=200) {
                console.error('Failed to add INVOICE:', createInvoiceResponse);
                //throw new Error(`Add  INVOICE failed: ${responseJson.message || response.statusText}`);
                return {
                    header: "Adding invoice failed",
                    message: createInvoiceResponse,
                    code: 400
                };
            }

            console.log(" INVOICE add response: ", createInvoiceResponse);
            return {
                header: "Invoice added successfully",
                message: createInvoiceResponse,
                code: 200
            };
;
        } catch (error) {
            console.error('Error in ADD INVOICE:', error);
            //throw new Error(error.toString());
            return {
                header: "Error while adding invoice",
                message: error.toString(),
                code: 400
            }; 
        }
    }


}