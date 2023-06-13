import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { Character } from '../../games/characters/entities/character.entity'
import { ActiveCondition } from '../../common/ActiveCondition'

@Entity()
export class CharacterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => Character, (character) => character.conditions, { onDelete: 'CASCADE' })
  character: Character
}
