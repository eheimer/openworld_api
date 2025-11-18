import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from "../../common/ActiveCondition.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity()
export class CharacterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => getEntity('Character') as any, (character) => (character as any).conditions)
  character: any
}

registerEntity('CharacterCondition', CharacterCondition)
