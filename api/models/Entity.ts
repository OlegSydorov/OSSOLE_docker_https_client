import type IndividualTitle from "./IndividualTitle"
import type EntityType from './EntityType'

export default interface Entity {
  ID: number
  FirstName: string | null
  LastName: string | null
  ID_EntityType: number
  ID_IndividualTitle: number
  IsActive: number
  Notes: string | null
  CompanyName: string | null
  CreatedDate: string
  ModifiedDate: string | null
  individual_title: IndividualTitle
  entity_type:EntityType
}
