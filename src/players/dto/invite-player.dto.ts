import { IsEmail, IsNotEmpty } from 'class-validator'

export class InvitePlayerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
