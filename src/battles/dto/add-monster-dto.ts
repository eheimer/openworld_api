import { IsNotEmpty, IsNumber } from 'class-validator'

export class AddMonsterDto {
  @IsNotEmpty()
  @IsNumber()
  monsterId: number
}
