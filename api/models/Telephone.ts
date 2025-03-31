import type TelephoneType from './TelephoneType'
import type IntTelDialCode from './IntTelDialCode'

export default interface Telephone {
    ID: number
    PhoneNumber: string
    ID_IntTelDialCode: number
    ID_TelephoneType: number
    Notes: string
    ID_AT_EntityAddress: number
    telephone_type: TelephoneType
    international_code:IntTelDialCode
}