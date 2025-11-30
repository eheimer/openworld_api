import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from "../../common/ActiveCondition"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class CharacterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => getEntity('Character') as any, (character) => (character as any).conditions)
  character: any
}

registerEntity('CharacterCondition', CharacterCondition)
