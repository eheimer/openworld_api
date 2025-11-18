import { Expose } from 'class-transformer'
import { getEntity, registerEntity } from "../../entityRegistry.js"

export class MonsterDto {
  @Expose() id: number
  @Expose() name: string
}

registerEntity('MonsterDto', MonsterDto)
