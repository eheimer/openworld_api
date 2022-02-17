import { Entity } from 'typeorm'
import PublicPlayer from './PublicPlayer'

@Entity()
export class PlayerDetail extends PublicPlayer {
  constructor(args: any) {
    super(args)
    const { id, email } = args
    this.id = id
    this.email = email
  }
  id: string
  email: string
}

export default PlayerDetail
