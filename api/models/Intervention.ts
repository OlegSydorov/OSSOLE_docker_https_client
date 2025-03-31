export default interface Intervention {
  ID: number
  Description: string
  CreatedDate: Date
  ModifiedDate: Date
  Date: Date
  Duration: string
  ID_User_CreatedBy: number
  ID_User_ModifiedBy: number
  ID_Task: number
  IsInvoiced: boolean
}
