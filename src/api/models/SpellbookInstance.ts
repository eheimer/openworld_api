import { Entity, ManyToOne, OneToMany } from 'typeorm';

import { EntityBase } from '../../utils/entities/EntityBase';
import { Inventory } from './Inventory';
import { SpellbookInstanceAttribute } from './SpellbookInstanceAttribute';

@Entity()
export class SpellbookInstance extends EntityBase {
  @OneToMany(() => SpellbookInstanceAttribute, (sia) => sia.spellbook, {
    nullable: true
  })
  attributes: SpellbookInstanceAttribute[];

  @ManyToOne(() => Inventory, (i) => i.spellbooks, { nullable: false })
  inventory: Inventory;
}
