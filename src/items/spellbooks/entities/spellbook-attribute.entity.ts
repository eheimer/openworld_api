import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { Entity } from 'typeorm'

@Entity()
export class SpellbookAttribute extends MagicalItemAttribute {}

(globalThis as any).SpellbookAttribute = SpellbookAttribute
