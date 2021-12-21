import { EntityBase } from '../../utils/entities/EntityBase';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ArmorClass } from './ArmorClass';
import { DamageType } from './DamageType';

@Entity()
export class ClassDamageReduction extends EntityBase {
  @Column() level: number;
  @Column() reduction: string;

  @ManyToOne(() => ArmorClass)
  armorClass: ArmorClass;

  @ManyToOne(() => DamageType)
  damageType: DamageType;
}
