import type Entity from './Entity'

export default interface SortedEntities {
  header: string
  message: string
  code: number
  entities: Entity[]
}
