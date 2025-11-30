import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute"
import { Entity } from 'typeorm'
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class SpellbookAttribute extends MagicalItemAttribute {}

registerEntity('SpellbookAttribute', SpellbookAttribute)
