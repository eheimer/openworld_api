import { EntityBase } from "../../utils/entities/EntityBase"
import { MagicalItemAttribute } from "../../utils/entities/MagicalItemAttribute"
import { Column, Entity } from "typeorm"

@Entity()
export class ArmorAttribute extends MagicalItemAttribute{
}
