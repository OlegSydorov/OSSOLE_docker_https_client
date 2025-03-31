import type ArticleType from './ArticleType'
import type Subtype from './Subtype'

export default interface ArticleTypeSubtype {
  ID: number
  ID_Subtype: number
  ID_ArticleType: number
  ID_User_CreatedBy: number
  ID_User_ModifiedBy: number | null
  CreatedDate: string
  ModifiedDate: string | null
  article_type: ArticleType
  subtype: Subtype
}
