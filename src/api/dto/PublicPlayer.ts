// Autogenerated 2/20/2022 11:58:42 AM
//   by GenerateServerModels. DO NOT MODIFY

/**
 * @description - Player object
 */
export class PublicPlayer {
  constructor(item: any) {
    const { id, name, lastSeenAt } = item
    this.id = id
    this.name = name
    this.lastSeenAt = lastSeenAt
  }
  id: string
  name: string
  lastSeenAt: Date
}

export default PublicPlayer
