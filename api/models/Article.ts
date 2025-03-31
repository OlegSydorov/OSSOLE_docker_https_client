import type ArticleTag from './ArticleTag'
import type ArticleTypeSubtype from './ArticleTypeSubtype'
import type Brand from './Brand'
import type Entity from './Entity'
import type QuantityType from './QuantityType'

export default interface Article {
  ID: number
  Title: string
  Description: string
  Version: string
  ID_Brand: number
  Price: number
  ID_QuantityType: number
  ID_User_CreatedBy: number
  ID_User_ModifiedBy: number
  CreatedDate: Date
  ModifiedDate: Date | null
  ID_EntitySupplier: number
  SupplierArticleNumber: string | null
  EAN: string | null
  ID_ArticleTypeSubtype: number
  brand: Brand
  quantity_type: QuantityType
  supplier: Entity
  article_type_subtype: ArticleTypeSubtype
  metadataIds: any[]
  metadatas: CustomMetadata[]
  article_tags: ArticleTag[]
}

export default interface ArticlesWithMessage {
  header: string
  message: string
  code: number
  articles: Article[]
}

export default interface ArticlesForList {
  ID: number
  Name: string
}

export interface CustomMetadata {
  ID: number
  Name: string
  Value: boolean
}
