import { IsString, IsEmail } from 'class-validator'
export class CreatePlayerDto {
  @IsString()
  username: string
  @IsString()
  password: string
  @IsEmail()
  email: string
}

(globalThis as any).CreatePlayerDto = CreatePlayerDto
