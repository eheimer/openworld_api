import { Entity } from 'typeorm'

import MagicalItemAttribute from '../../utils/entities/MagicalItemAttribute'

/**
 * @description a MagicalItemAttribute that can be applied to an ArmorInstance
 */
@Entity()
export class ArmorAttribute extends MagicalItemAttribute {}

export default ArmorAttribute
