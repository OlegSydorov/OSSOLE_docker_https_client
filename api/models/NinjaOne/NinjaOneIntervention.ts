import type NinjaOneUser from './NinjaOneUser'
export default interface NinjaOneIntervention {
    ID: number
    TicketId: number
    CreateTime: number
    TimeTracked: number
    UserId: number
    User:NinjaOneUser
    Description: string
    Month: number
    Year: number
    IsInvoiced: boolean
}
