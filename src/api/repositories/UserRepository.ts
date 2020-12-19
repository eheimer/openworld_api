import { EntityRepository, Repository } from 'typeorm'
import { User } from '../models/User'
import bcrypt from 'bcrypt'

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
}

export default UserRepository