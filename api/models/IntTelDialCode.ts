import type Country from './Country'
export default interface IntTelDialCode {
    ID: number
    Code: number
    ID_Country: number
    Regex: string
    Country:Country
}