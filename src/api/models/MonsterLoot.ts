import { EntityBase } from '../../utils/entities/EntityBase';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ItemCategory } from './ItemCategory';
import { Monster } from './Monster';

@Entity()
export class MonsterLoot extends EntityBase {
  @Column() qty: number;
  @Column() level: number;
  @Column() chance: number;

  @ManyToOne(() => Monster)
  monster: Monster;

  @ManyToOne(() => ItemCategory)
  category: ItemCategory;
}
