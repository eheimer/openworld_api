import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from "../../common/ActiveCondition.js"

@Entity()
export class CharacterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => (globalThis as any).Character, (character) => (character as any).conditions)
  character: any
}

(globalThis as any).CharacterCondition = CharacterCondition
