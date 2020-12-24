import { EntityBase } from "../../utils/entities/EntityBase"
import { MagicalItemAttribute } from "../../utils/entities/MagicalItemAttribute"
import { Column, Entity } from "typeorm"

/**
 * @description a MagicalItemAttribute that can be applied to an ArmorInstance
 */
@Entity()
export class ArmorAttribute extends MagicalItemAttribute{
}
