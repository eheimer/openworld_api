import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class ArmorAttribute extends MagicalItemAttribute {}

registerEntity('ArmorAttribute', ArmorAttribute)
