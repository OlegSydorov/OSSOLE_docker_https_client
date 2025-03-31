import type Metadata from './Metadata'

export default interface ArticleMetadata {
  ID: number
  ID_Article: number
  ID_Metadata: number
  CreatedDate: number
  ModifiedDate: number
  metadata: Metadata
}
