import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { EntityBase } from '../../utils/entities/EntityBase';
import { EquipLocation } from './EquipLocation';

/**
 * @description location that Armor can be equipped
 */
@Entity()
export class ArmorLocation extends EntityBase {
  @Column() name: string;

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation;
}
