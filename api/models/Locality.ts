import type Country from './Country'
export default interface Locality {
    ID: number
    ZipCode: string
    Town: string
    State: string
    ID_Country: number 
    Country:Country
}
