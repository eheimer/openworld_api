// Autogenerated 4/4/2022 1:26:30 AM
//   by GenerateServerModels. DO NOT MODIFY
import { Entity } from 'typeorm'

/**
 * @description - A skill
 */
@Entity()
export class Skill {
  constructor(item: any) {
    const { id, name, description } = item
    this.id = id
    this.name = name
    this.description = description
  }
  id: string
  name: string
  description: string
}

export default Skill
