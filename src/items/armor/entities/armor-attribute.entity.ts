import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"

@Entity()
export class ArmorAttribute extends MagicalItemAttribute {}

(globalThis as any).ArmorAttribute = ArmorAttribute
