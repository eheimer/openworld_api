import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PlayersService } from '../players/players.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { JwtService } from '@nestjs/jwt'
import { CreatePlayerDto } from '../players/dto/create-player.dto'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private playersService: PlayersService, private jwtService: JwtService) {}

  async register(createPlayerDto: CreatePlayerDto) {
    const { username, password, email } = createPlayerDto
    // see if the username or email is already in use
    let player = await this.playersService.findOneByUsername(username)
    if (player) {
      throw new BadRequestException('Username already in use')
    }
    player = await this.playersService.findOneByEmail(email)
    if (player) {
      throw new BadRequestException('Email already in use')
    }

    const salt = this.makeSalt()
    const hash = await this.hashPassword(password, salt)
    player = await this.playersService.create({ username, email, password: `${salt}.${hash}` })
    return player
  }

  async authenticate(username: string, password: string) {
    const player = await this.playersService.findOneByUsername(username)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    const [salt, storedHash] = player.password.split('.')
    const hash = await this.hashPassword(password, salt)
    if (storedHash !== hash) {
      throw new BadRequestException('Invalid password')
    }
    return player
  }

  makeSalt() {
    return randomBytes(8).toString('hex')
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    const hash = (await scrypt(password, salt, 64)) as Buffer
    return hash.toString('hex')
  }

  async login(player: any) {
    //player has been authenticated, this is where we can perform any additional tasks
    await this.playersService.update(player.id, { lastSeenAt: new Date() })

    const payload = { username: player.username, sub: player.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
