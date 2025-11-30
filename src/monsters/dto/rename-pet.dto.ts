import { IsNotEmpty, IsString } from 'class-validator'
import { getEntity, registerEntity } from "../../entityRegistry"

export class RenamePetDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

registerEntity('RenamePetDto', RenamePetDto)
