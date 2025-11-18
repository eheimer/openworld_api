import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { Entity } from 'typeorm'
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class SpellbookAttribute extends MagicalItemAttribute {}

registerEntity('SpellbookAttribute', SpellbookAttribute)
