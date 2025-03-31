import type NinjaOneUser from './NinjaOneUser'
import type NinjaOneStatus from './NinjaOneStatus'
import type NinjaOneIntervention from './NinjaOneIntervention'
export default interface NinjaOneTicket {
    ID: number
    Code:string
    Organization: string
    Priority: string
    Severity: string
    Summary: string
    Status: NinjaOneStatus
    StatusId:number
    CreateTime: number
    Tags: []
    User: NinjaOneUser
    UserId:number
    Requester: string
    Type: string
    TotalTimeTracked: number
    TotalTimeInvoiced: number
    Interventions: NinjaOneIntervention[],
    InvoiceCode:string
}

