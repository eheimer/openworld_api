import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"

@Entity()
export class JewelryAttribute extends MagicalItemAttribute {}

(globalThis as any).JewelryAttribute = JewelryAttribute
