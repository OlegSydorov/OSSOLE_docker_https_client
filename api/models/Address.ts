import type Country from './Country'
import type Locality from './Locality'
import type AddressType from './AddressType'
export default interface Address {
    ID: number
    Locality: Locality | null
    ID_Locality: number | null
    StreetName: string | null
    StreetNumber: string | null
    PostalBox: string | null
    AddressType: AddressType[]
    Notes: string | null
    CreatedDate: Date | null
    ModifiedDate: Date | null
    IsMainAddress: boolean | null
    ID_Entity:number


}
