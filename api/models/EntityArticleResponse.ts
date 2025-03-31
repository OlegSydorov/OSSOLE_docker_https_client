import type EntityArticle from './EntityArticle'

export default interface EntityArticleResponse {
  header: string
  message: string
  code: string
  entityArticles: Array<EntityArticle>
}
