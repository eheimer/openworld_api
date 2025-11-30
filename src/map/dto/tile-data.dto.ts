import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { getEntity, registerEntity } from "../../entityRegistry"

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

registerEntity('TileDataDto', TileDataDto)
