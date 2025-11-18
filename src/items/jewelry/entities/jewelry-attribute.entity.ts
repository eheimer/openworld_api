import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class JewelryAttribute extends MagicalItemAttribute {}

registerEntity('JewelryAttribute', JewelryAttribute)
