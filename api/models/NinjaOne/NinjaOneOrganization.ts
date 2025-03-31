import type NinjaOneLocation from './NinjaOneLocation'
import type NinjaOneTicket from './NinjaOneTicket'
export default interface NinjaOneOrganization {
    ID: number
    Name: string
    Description: string
    Locations: NinjaOneLocation[]
    Tickets: NinjaOneTicket[]
    OnContract: number
    TicketsCount: number
    ClosedTicketsCount: number
    InterventionsCount: number
    InvoicedInterventionsCount: number
    HoursCount: number
    InvoicedHoursCount: number
}



