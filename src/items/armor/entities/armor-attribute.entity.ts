import { Entity } from 'typeorm'
import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute"
import { registerEntity } from "../../../entityRegistry"

@Entity()
export class ArmorAttribute extends MagicalItemAttribute {}

registerEntity('ArmorAttribute', ArmorAttribute)
