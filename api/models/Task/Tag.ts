export default interface Tag {
    ID: number
    Name: string
    CreatedBy_ID_Technician: number|null
    ModifiedBy_ID_Technician: number|null
    CreatedDate: string|null
    ModifiedDate: string|null
}
