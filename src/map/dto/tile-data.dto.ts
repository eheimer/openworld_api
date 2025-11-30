import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class TileDataDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  tileIndex: number

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  terrain: number
}

