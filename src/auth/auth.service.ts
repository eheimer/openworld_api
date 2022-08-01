import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PlayersService } from '../players/players.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { JwtService } from '@nestjs/jwt'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private playersService: PlayersService, private jwtService: JwtService) {}

  async register(username: string, email: string, password: string) {
    // see if the username or email is already in use
    let player = await this.playersService.findByUsername(username)
    if (player) {
      throw new BadRequestException('Username already in use')
    }
    player = await this.playersService.findByEmail(email)
    if (player) {
      throw new BadRequestException('Email already in use')
    }

    const salt = randomBytes(8).toString('hex')
    const hash = (await scrypt(password, salt, 64)) as Buffer
    const passwd = `${salt}.${hash.toString('hex')}`
    player = await this.playersService.create(username, email, passwd)
    return player
  }

  async authenticate(username: string, password: string) {
    const player = await this.playersService.findByUsername(username)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    const [salt, storedHash] = player.password.split('.')
    const hash = (await scrypt(password, salt, 64)) as Buffer
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password')
    }
    return player
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
