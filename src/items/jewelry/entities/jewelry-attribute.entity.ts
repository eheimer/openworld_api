import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class JewelryAttribute extends MagicalItemAttribute {}

registerEntity('JewelryAttribute', JewelryAttribute)
