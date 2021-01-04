import { EntityRepository, Repository } from 'typeorm'
import { User } from '../models/User'
import bcrypt from 'bcrypt'

export class PublicPlayer {
    id: number; name: string; lastSeenAt: Date
    constructor(player: User) {
        this.id = player.id
        this.name = player.name
        this.lastSeenAt = player.lastSeenAt
    }
}

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async comparePassword(userId: number, candidatePassword: string): Promise<boolean> {
        let user = await this.findOne(userId)
        if (user) {
            const password = user.password
            try {
                let isMatch = await bcrypt.compare(candidatePassword, password)
                return isMatch
            } catch (err) {
                return false
            }
        } else {
            return false
        }
    }

    generatePasswordHash(password: string): string {
        return bcrypt.hashSync(password,10)
    }

    async updatePassword(userId: number, password: string) {
        let user = await this.findOne(userId)
        if (user) {
            user.password = this.generatePasswordHash(password);
            return await this.save(user);
        }
    }

    async getPublicPlayer(userId: string): Promise<PublicPlayer> {
        try {
            const player = await this.findOne(userId)
            return new PublicPlayer(player)
        } catch (err) {
            console.log({err})
        }
    }

    async getPlayer(userId: string): Promise<User> {
        try {
            const player: User = await this.findOne(userId)
            return player
        } catch (err) {
            console.log({err})
        }
    }
}

export default UserRepository