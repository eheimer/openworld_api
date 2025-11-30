import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from '../../common/ActiveCondition'
import { Character } from '../../games/characters/entities/character.entity'

@Entity()
export class CharacterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => Character, (character) => character.conditions)
  character: Character
}
