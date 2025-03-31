export default interface Subtype {
  ID: number
  Name: string
  ID_User_CreatedBy: number
  ID_User_ModifiedBy: number | null
  CreatedDate: string
  ModifiedDate: string | null
}
