import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateMonsterInstanceDto {
  @IsNumber()
  @IsNotEmpty()
  monsterId: number
}

