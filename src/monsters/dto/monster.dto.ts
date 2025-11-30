import { Expose } from 'class-transformer'
import { getEntity, registerEntity } from "../../entityRegistry"

export class MonsterDto {
  @Expose() id: number
  @Expose() name: string
}

registerEntity('MonsterDto', MonsterDto)
