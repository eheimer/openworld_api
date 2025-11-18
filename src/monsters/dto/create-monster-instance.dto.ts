import { IsNotEmpty, IsNumberString } from 'class-validator'
import { getEntity, registerEntity } from "../../entityRegistry.js"

export class CreateMonsterInstanceDto {
  @IsNumberString()
  @IsNotEmpty()
  monsterId: string
}

registerEntity('CreateMonsterInstanceDto', CreateMonsterInstanceDto)
