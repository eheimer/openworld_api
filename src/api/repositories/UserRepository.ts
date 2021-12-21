import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async comparePassword(
    userId: number | string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = await this.findOne(userId);
    if (user) {
      const password = user.password;
      try {
        const isMatch = await bcrypt.compare(candidatePassword, password);
        return isMatch;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  generatePasswordHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async updatePassword(userId: number | string, password: string) {
    const user = await this.findOne(userId);
    if (user) {
      user.password = this.generatePasswordHash(password);
      return await this.save(user);
    }
  }
}

export default UserRepository;
