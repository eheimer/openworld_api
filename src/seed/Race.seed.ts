export const RaceSeed = [
  {
    id: 1,
    name: 'Accursed',
    description: `Good creatures attack as if evil, Permanent Corpse Skin, and 50% greater damage from Undead Superslayer.
Immune to cold terrain damage and 5 pt variance bonus to tracking attempts on water/snow.
Whenever a Cursed is Hidden or Stealthing, they may apply their condition to any ship they Helm. (Leaving the Helm reveals the ship and all aboard).
May walk one space in water and never drown, and instead of hunger/sleep,  the cursed have a custom track of 16 spaces. When it runs empty, they disappear from the game, unable to be interacted with, for 10 real world minutes. If in combat by themselves, combat will end.
When killed, suffer fame loss and looting, but 3 turns later, awaken with 1 hp. Never become ghosts.`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2
  },
  {
    id: 2,
    name: 'Angelfolk',
    description: `No necromancy or spirit speak.
Unable to flee combat.`,
    movement: 'fly 3 / move 2',
    hpReplenish: 2,
    staminaReplenish: 4,
    manaReplenish: 2,
    hunger: 14,
    sleep: 18
  },
  {
    id: 3,
    name: 'Drow',
    description: `No spellweaving or chivalry.
agility, clumsy, cure twice per day.
Can wield 2 one-handed weapons and choose between them on swing, parry is treated as two-handed.
+10 Skill check bonus in dungeons, Malas, Deep Jungles. Harsh penalty -20 and 5 damage per turn in ice, desert, badlands, Open water. Penalty in all other terrain -15.`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 15,
    sleep: 17
  },
  {
    id: 4,
    name: 'Dullahan',
    description: `While mounted on a horse or a horse like creature you have a movement speed of 5 and deal +4 melee damage.
Must carry its head at all times because of this the dullahan only has one hand to use in combat (Can still cast), should the head be disarmed, the Dullahan has all its success rolls halved until the head is rearmed (Head may never be stolen. Upon resurrection, Dulahan has a new head).
Precast time for Necromancy spells is reduced by one round, and cost 5 less mana.`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 15,
    sleep: 17
  },
  {
    id: 5,
    name: 'Elf',
    description: `When rolling a spawn of Iron or Wood, they may immediately reroll their spawn chance but must keep the result of the second roll.
+20 bonus to maximum mana, -15 maximum hp.
Lower Strength requirement on weapons by 1.`,
    movement: 'move 2, ignore terrain',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 16,
    sleep: 16
  },
  {
    id: 6,
    name: 'Fairy',
    description: `Have a 7% bonus on hiding and stealth when trying to remain hidden.
Only has 7 vs. 8 stat points.
Can’t enter civilized (guarded) hexes.`,
    movement: 'fly 2 / move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 16
  },
  {
    id: 7,
    name: 'Gargoyle',
    description: `unable to ride a mount of any kind.
While at or under 75%, 50%, and 25 % tiers of Hunger/Sleep =   Base Damage +5, Base Spell Damage +2. Cap of +30 and +12 Base Melee and Spell Damage.
Exceptional imbuers, have increased chance of success all around (refer to imbuing for details).
Cannot take fishing or eat fish, and may only cross water aboard a ship.`,
    movement: 'fly 4 / move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 16,
    sleep: 16
  },
  {
    id: 8,
    name: 'Goblin',
    description: `May eat any card slot object and regain 4 hunger.
Good creatures will attack Goblins. Attacking a Goblin does not criminally flag a PC. Guards can be called on Goblins in Civilized towns.
Cannot equip two handed weapons.
Pets will not obey Goblins, and won’t allow them to mount.
Goblins break all ties in their favor in contested loot.`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 20,
    sleep: 14
  },
  {
    id: 9,
    name: 'Human',
    description: `Higher carry capacity, and +6 card carry.
An additional d6 on resource pulls.`,
    movement: 'move 2',
    hpReplenish: 4,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 16,
    sleep: 16
  },
  {
    id: 10,
    name: 'Kobold',
    description: `Benefit from pack tactics. This applies to other kobolds and creatures with the ability under the kobold’s control.
Whenever you gain gold from anything besides trade, get an extra 10% of the total gained. Additionally, you can always loot gold before other players.
If kobolds are ever outnumbered 2:1 they are unable to fight due to fear, while afraid they cannot perform any hostile actions.`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 14,
    sleep: 18
  },
  {
    id: 11,
    name: 'Nereid',
    description: `Unable to equip armor to the boot location.
Reduce the barding difficulty of monsters by 5.`,
    movement: 'Swim 5 / move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 17,
    sleep: 17
  },
  {
    id: 12,
    name: 'Ophidian',
    description: `Immune to Poison Lev 4 and lower.
Substitutes Healing for Veterinary when healing self.
(Anatomy still used to support self Healing). Additionally, 50% greater damage from Reptile Superslayer, Snake or Ophidian Slayer 100%.
-30% Hit Chance with ranged or Thrown weapons.
All instruments played are considered exceptional. / Adds or increases poison level by 1 on their equipped weapon for 1 ongoing action. / Opponents trying to break away have a 50% chance of failing. Breakaway damage is still taken. This is applied as a penalty to stealth breakaways (may always move away, but take damage upon failing roll). (Choose 1 when making character).`,
    movement: 'move 2',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 16,
    sleep: 16
  },
  {
    id: 13,
    name: 'Pandaren',
    description: `Additional 6 base damage for wrestling and can parry with bare hands, two open hands count as two handing (crit fail doubles damage taken). 
Can only eat fruits and veggies, but increase sleep track by half hunger gained (can still drink potions).`,
    movement: 'move 2, ignore terrain',
    hpReplenish: 2,
    staminaReplenish: 2,
    manaReplenish: 2,
    hunger: 18,
    sleep: 12
  }
]
