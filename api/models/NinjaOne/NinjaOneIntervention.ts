import type NinjaOneUser from './NinjaOneUser'
export default interface NinjaOneIntervention {
    ID: number
    TicketId: number
    TicketCode: string
    CreateTime: number
    TimeTracked: number
    UserId: number
    User:NinjaOneUser
    Description: string  
    IsInvoiced: boolean
    Month: number
    Year:number
}
