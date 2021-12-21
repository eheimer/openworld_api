import { EntityBase } from '../../utils/entities/EntityBase';
import { Column, Entity } from 'typeorm';

/**
 * @description a unique action available to a monster on its turn
 */
@Entity()
export class Action extends EntityBase {
  /**
   *  example: 'Paralyze Spell'
   */
  @Column() name: string;
  /**
   *  default value for the action
   */
  @Column() value: number;

  @Column() description: string;
  /**
   * determines order of actions
   */
  @Column() initiative: number;
  /**
   * base damage min/max for spells
   */
  @Column() spellDmgRange: string; //base damage min/max for spells
}
