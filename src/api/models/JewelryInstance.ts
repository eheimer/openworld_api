import { EntityBase } from '../../utils/entities/EntityBase';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Gem } from './Gem';
import { Inventory } from './Inventory';
import { JewelryInstanceAttribute } from './JewelryInstanceAttribute';
import { JewelryLocation } from './JewelryLocation';

@Entity()
export class JewelryInstance extends EntityBase {
  @Column() equipped: boolean;
  @Column() damaged: boolean;

  @ManyToOne(() => Gem, { nullable: false })
  gem: Gem;

  @ManyToOne(() => JewelryLocation, { nullable: false })
  location: JewelryLocation;

  @OneToMany(() => JewelryInstanceAttribute, (jia) => jia.jewelry, {
    nullable: true
  })
  attributes: JewelryInstanceAttribute[];

  @ManyToOne(() => Inventory, (i) => i.jewelry, { nullable: false })
  inventory: Inventory;
}
