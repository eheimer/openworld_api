export const MonsterSeed = [
  {
    id: 1,
    name: `Acid Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: Level 5
Bard Diff: 84
Tame Diff: NA
Pack instinct: None
Control Slots: NA
Food Pref: NA`,
    karma: `5`,
    gold: `400-500`,
    alignment: `Evil`,
    hp: `196-213`,
    bard: `84`,
    taming: `NA`,
    resistF: `40-50`,
    resistC: `20-30`,
    resistP: `10-20`,
    resistE: `30-40`,
    resistPh: `45-55`,
    magery: `70-85`,
    evalInt: `70-85`,
    aggroPriority: 3,
    tactics: `80-90`,
    resistSpell: `2-3`,
    anatomy: `30-60`,
    strength: `326-355`,
    dexterity: `66-85`,
    intelligence: `271-295`,
    baseDmg: `9-15`,
    preferredFood: `NA`,
    controlSlots: 0,
    specials: `CORROSIVE (35):weapons striking and armor struck by creature take a penalty to their durability check`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 2,
    name: `Air Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental, Air
Karma/Fame: Level 3
Bard Diff: 75
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `76-93`,
    bard: `75`,
    taming: `0`,
    resistF: `15-25`,
    resistC: `10-20`,
    resistP: `55-65`,
    resistE: `25-35`,
    resistPh: `35-45`,
    magery: `60-75`,
    evalInt: `60-75`,
    aggroPriority: 3,
    tactics: `60-80`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `126-155`,
    dexterity: `166-185`,
    intelligence: `101-125`,
    baseDmg: `8-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `DEAFENING WINDS: taking a precast action while adjacent to monster = automatic disruption`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 3,
    name: `Ancient Wyrm`,
    hoverStats: `Resist: 5
Slayer: Dragon, Reptile
Karma/Fame: Level 5
Bard Diff: 160
Tame Diff: na
Pack instinct: None
Control Slots: 5
Food Pref: Meat`,
    karma: `5`,
    gold: `1720-2500`,
    alignment: `Evil`,
    hp: `1177-2500`,
    bard: `160`,
    taming: `na`,
    resistF: `80-90`,
    resistC: `70-80`,
    resistP: `60-70`,
    resistE: `60-70`,
    resistPh: `70-80`,
    magery: `110-140`,
    evalInt: `90-100`,
    aggroPriority: 4,
    tactics: `110-140`,
    resistSpell: `5`,
    anatomy: `120`,
    strength: `1025-1425`,
    dexterity: `81-148`,
    intelligence: `475-675`,
    baseDmg: `24-33`,
    preferredFood: `Meat`,
    controlSlots: 5,
    specials: `ARMORED: weapons striking this creature must make durability checks upon successful hits.
 - TAILSWIPE: AOE, Melee damage to all enemies within range 3 - DISPEL: if an opponent summoned a creature, monster will cast dispel on creature in place of its until creature is dispelled. (interupt) -  CURING 80%: if poisoned Monster will replace next action with a cure attempt. (interrupt) -  DETECT HIDDEN 80% (Interrupt): immediately upon hiding and every round after, will replace action if no visible targets are on combat map.- BREATH: Chaos Damage`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 7
  },
  {
    id: 4,
    name: `Balron`,
    hoverStats: `Resist: 3
Slayer: Demon
Karma/Fame: Level 5
Bard Diff: 115
Tame Diff: not tameable
Pack instinct: None
Control Slots: 
Food Pref: `,
    karma: `5`,
    gold: `1200-1650`,
    alignment: `Evil`,
    hp: `592-711`,
    bard: `115`,
    taming: `not tameable`,
    resistF: `60-80`,
    resistC: `50-60`,
    resistP: `100`,
    resistE: `40-50`,
    resistPh: `65-80`,
    magery: `95-100`,
    evalInt: `90-100`,
    aggroPriority: 4,
    tactics: `90-100`,
    resistSpell: `3-4`,
    anatomy: `25-50`,
    strength: `986-1185`,
    dexterity: `177-255`,
    intelligence: `151-250`,
    baseDmg: `22-29`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CURING 80% : if poisoned. Monster will replace next action with a cure attempt.(Interrupt)    - *FLYING: monster can move up to 5 spaces on a move action toward target in aggro priority ignoring terrain, if monster has no valid target in LOS. -  DISPEL: if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled.(interrupt) - DETECT HIDDEN LOS 80% - DCI 20%`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: null
  },
  {
    id: 5,
    name: `Bone Knight`,
    hoverStats: `Resist: 2
Slayer: undead
Karma/Fame: Level 1
Bard Diff: 70
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `1`,
    gold: `175-275`,
    alignment: `Evil`,
    hp: `118-150`,
    bard: `70`,
    taming: `0`,
    resistF: `20-30`,
    resistC: `50-60`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `35-45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `90-100`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `196-250`,
    dexterity: `76-95`,
    intelligence: `36-60`,
    baseDmg: `8-18`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `HEALTH SIPHON:: Healing spells cast adjacent to this monster, heal it rather than intended target. - TAUNT: Monster is Aggro Priority 1 to any Pets in LOS`,
    animate: true,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 6,
    name: `Blood Elemental`,
    hoverStats: `Resist: 3
Slayer: Elemental
Karma/Fame: Level 5
Bard Diff: 94
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `700-900`,
    alignment: `Evil`,
    hp: `316-369`,
    bard: `94`,
    taming: `na`,
    resistF: `20-30`,
    resistC: `40-50`,
    resistP: `50-60`,
    resistE: `30-40`,
    resistPh: `55-65`,
    magery: `85-100`,
    evalInt: `85-100`,
    aggroPriority: 3,
    tactics: `80-100`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `526-615`,
    dexterity: `66-85`,
    intelligence: `226-350`,
    baseDmg: `17-27`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `TERROR TO BEHOLD:-25% to Hit chance and casting success if in LOS of blood elemental. - CURING 70% : if poisoned. Monster will replace next action with a cure attempt.(Interrupt)   - DISPEL: 80%`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 7,
    name: `Buccaneer`,
    hoverStats: `Resist: 0
Slayer: repond
Karma/Fame: Level 2
Bard Diff: 70
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `175-275`,
    alignment: `Evil`,
    hp: `118-150`,
    bard: `70`,
    taming: `0`,
    resistF: `20-30`,
    resistC: `20-30`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `20-40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `90-100`,
    resistSpell: ``,
    anatomy: ``,
    strength: `100-150`,
    dexterity: `76-95`,
    intelligence: `36-60`,
    baseDmg: `8-15`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `Potion Range 7`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 8,
    name: `Buccaneer Lord`,
    hoverStats: `0`,
    karma: `3`,
    gold: `800-1275`,
    alignment: `Evil`,
    hp: `250-400`,
    bard: `70`,
    taming: `0`,
    resistF: `20-30`,
    resistC: `20-30`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `35-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: `100`,
    strength: `250-300`,
    dexterity: `76-95`,
    intelligence: `36-60`,
    baseDmg: `10-18`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CURE POT: 85% (Interrupt) replace action if unsuccessful. - HEAL POT: d6+20 at end of turn. -  PARRY: 30% all attacks and spells`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 9,
    name: `Deamon`,
    hoverStats: `Resist: 3
Slayer: Demon
Karma/Fame: Level 4
Bard Diff: 90
Tame Diff: not tameable
Pack instinct: None
Control Slots: 
Food Pref: `,
    karma: `4`,
    gold: `560-650`,
    alignment: `Evil`,
    hp: `301-325`,
    bard: `90`,
    taming: `not tameable`,
    resistF: `50-60`,
    resistC: `30-40`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `45-60`,
    magery: `70-80`,
    evalInt: `70-80`,
    aggroPriority: 3,
    tactics: `70-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `476-505`,
    dexterity: `76-95`,
    intelligence: `301-325`,
    baseDmg: `7-20`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CURING 75% : if poisoned. Monster will replace next action with a cure attempt. - FLYING: monster can move up to 5 spaces on a move action toward target in aggro priority ignoring terrain, if monster has no valid target in LOS`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 10,
    name: `Dire Wolf`,
    hoverStats: `Resist: 2
Slayer: Wolf
Karma/Fame: Level 2
Bard Diff: 50
Tame Diff: 34,0,0,0
Pack instinct: Canine
Control Slots: 1
Food Pref: Meat`,
    karma: `2`,
    gold: ``,
    alignment: `Evil`,
    hp: `58-72`,
    bard: `50`,
    taming: `34,0,0,0`,
    resistF: `10-20`,
    resistC: `5-10`,
    resistP: `5-10`,
    resistE: `10-15`,
    resistPh: `20-25`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50-70`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `96-120`,
    dexterity: `81-105`,
    intelligence: `36-60`,
    baseDmg: `20-32`,
    preferredFood: `Meat`,
    controlSlots: 1,
    specials: `PACK INSTINCT : (Canine) damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map`,
    animate: false,
    packInstinct: `Canine`,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 11,
    name: `Displacer Beast`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 3
Bard Diff: 98
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `400-600`,
    alignment: `Evil`,
    hp: `230-300`,
    bard: `98`,
    taming: `na`,
    resistF: `25-45`,
    resistC: `25-45`,
    resistP: `25-45`,
    resistE: `25-45`,
    resistPh: `25-45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2-4`,
    anatomy: `100`,
    strength: `150-300`,
    dexterity: `65-100`,
    intelligence: `80`,
    baseDmg: `5-18`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `HIDE (30 HP): If monster drops below listed hp total it hides until and takes no actions till fully healed.  - AMBIDEXTROUS (2): may attack up to two opponents per turn within 2 tiles of creature. -  UNYIELDING FLESH: If creature took no damage this round, it heals 15hp during delay phase. -  DETECT HIDDEN (80%): immediately upon hiding and every round after, will replace action if no visible targets are on combat map`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 12,
    name: `Dragon`,
    hoverStats: `Resist: 4
Slayer: Dragon, Reptile
Karma/Fame: Level 5
Bard Diff: 105
Tame Diff: 12,0,0,0
Pack instinct: None
Control Slots: 4
Food Pref: Meat`,
    karma: `5`,
    gold: `1000-1200`,
    alignment: `Evil`,
    hp: `478-500`,
    bard: `105`,
    taming: `12,0,0,0`,
    resistF: `60-70`,
    resistC: `30-40`,
    resistP: `25-35`,
    resistE: `35-45`,
    resistPh: `55-65`,
    magery: `30-40`,
    evalInt: `30-40`,
    aggroPriority: 3,
    tactics: `98-100`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `796-825`,
    dexterity: `86-105`,
    intelligence: `436-475`,
    baseDmg: `16-22`,
    preferredFood: `Meat`,
    controlSlots: 4,
    specials: `ARMORED: weapons striking this creature must make durability checks upon successful hits. - TAILSWIPE: AOE, Melee damage to all enemies within range 3 - DISPEL: if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled - CURING (60%) - DETECT HIDDEN LOS (70%)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 2
  },
  {
    id: 13,
    name: `Skeletal Dragon`,
    hoverStats: `Resist: 5
Slayer: Dragon, Undead
Karma/Fame: Level 5
Bard Diff: 126
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: na`,
    karma: `5`,
    gold: `1600-1800`,
    alignment: `Evil`,
    hp: `558-599`,
    bard: `118-127`,
    taming: `na`,
    resistF: `40-60`,
    resistC: `40-60`,
    resistP: `70-80`,
    resistE: `40-60`,
    resistPh: `75-80`,
    magery: `80-100`,
    evalInt: `80-100`,
    aggroPriority: 3,
    tactics: `98-100`,
    resistSpell: `5`,
    anatomy: ``,
    strength: `898-1030`,
    dexterity: `68-200`,
    intelligence: `488-620`,
    baseDmg: `29-35`,
    preferredFood: `na`,
    controlSlots: 0,
    specials: `TAILSWIPE: AOE, Melee damage to all enemies within range 3 - DISPEL: if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled.(Interrupt) -POISON IMMUNITY (5) - PROVOCATION IMMUNITY - DETECT HIDDEN LOS (80%) - PET DESTROYER: 3x damage to pets (melee, spells and breath)`,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 3
  },
  {
    id: 14,
    name: `Dread Spider`,
    hoverStats: `Resist: 2
Slayer: Arachnid, Spider
Karma/Fame: Level 4
Bard Diff: 117
Tame Diff: na
Pack instinct: none
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `450-650`,
    alignment: `Evil`,
    hp: `500-750`,
    bard: `100-120`,
    taming: `na`,
    resistF: `52-60`,
    resistC: `51-59`,
    resistP: `100`,
    resistE: `50-60`,
    resistPh: `52-57`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `85-90`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `400`,
    dexterity: `134-155`,
    intelligence: `291-330`,
    baseDmg: `6-16`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (5): poison of listed level or less have no effect on this creature. - WEB (interrupt): 60% - a character who makes a ranged attack against/breaks away from this monster has a chance of being pulled adjacent to the monster if within LOS. - DISPEL (80%)`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 15,
    name: `Earth Elemental`,
    hoverStats: `Resist: 3
Slayer: Elemental, Earth Elem
Karma/Fame: Level 3
Bard Diff: 68
Tame Diff: 
Pack instinct: None
Control Slots: 2
Food Pref: `,
    karma: `3`,
    gold: `10-20`,
    alignment: `Evil`,
    hp: `76-93`,
    bard: `68`,
    taming: `0`,
    resistF: `10-20`,
    resistC: `10-20`,
    resistP: `15-25`,
    resistE: `15-25`,
    resistPh: `30-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-100`,
    resistSpell: `2-4`,
    anatomy: ``,
    strength: `126-155`,
    dexterity: `66-85`,
    intelligence: `71-92`,
    baseDmg: `17-32`,
    preferredFood: `0`,
    controlSlots: 2,
    specials: `ARMORED: weapons striking this creature must make durability checks upon successful hits`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 16,
    name: `Ettin`,
    hoverStats: `Resist: 2
Slayer: Repond
Karma/Fame: Level 1
Bard Diff: 47
Tame Diff: not tameable
Pack instinct: None
Control Slots: 
Food Pref: Chicken`,
    karma: `1`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `82-99`,
    bard: `47`,
    taming: `not tameable`,
    resistF: `15-25`,
    resistC: `40-50`,
    resistP: `15-25`,
    resistE: `15-25`,
    resistPh: `35-40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50-70`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `136-165`,
    dexterity: `56-75`,
    intelligence: `31-55`,
    baseDmg: `7-17`,
    preferredFood: `Chicken`,
    controlSlots: 0,
    specials: `CRUSHING: any armor location damaged by a melee strike must make a durability check at -40% - DUAL HEADED: may attack 2 adjacent opponents per round. (roll seperately)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 17,
    name: `Evil Mage`,
    hoverStats: `Resist: 4
Slayer: mage
Karma/Fame: Level 2
Bard Diff: 73
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `49-63`,
    bard: `73`,
    taming: `0`,
    resistF: `5-10`,
    resistC: ``,
    resistP: `5-10`,
    resistE: `5-10`,
    resistPh: `15-20`,
    magery: `75-100`,
    evalInt: `75-100`,
    aggroPriority: 3,
    tactics: `65-88`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `81-105`,
    dexterity: `96-120`,
    intelligence: `96-120`,
    baseDmg: `5-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `DISPEL (60%) : if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING (60%) : if poisoned. Monster will replace next action with a cure attempt`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 18,
    name: `Fire Beetle`,
    hoverStats: `Resist: 2
Slayer: beetle, Flame
Karma/Fame: Level 3
Bard Diff: 84
Tame Diff: 12,0,0,0
Pack instinct: None
Control Slots: 3
Food Pref: Chicken`,
    karma: `3`,
    gold: ``,
    alignment: `Evil`,
    hp: `100-200`,
    bard: `84`,
    taming: `12,0,0,0`,
    resistF: `70-75`,
    resistC: `10`,
    resistP: `30`,
    resistE: `30`,
    resistPh: `40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `40-100`,
    resistSpell: `2-4`,
    anatomy: ``,
    strength: `150-300`,
    dexterity: `65-100`,
    intelligence: `500`,
    baseDmg: `7-20`,
    preferredFood: `Chicken`,
    controlSlots: 3,
    specials: `SUBDUE (30): monster cannot be tamed unless below the listed hit point total.-  RANGED AGGRESSION: (interrupt) If hit with a ranged attack, monster will move as an interrupt toward the attacker and make an immediate melee attack. Move Speed 6. -  ARMORED - FAST HEALING: monster recovers 10 hp during delay phase`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: null
  },
  {
    id: 19,
    name: `Fire Elemental`,
    hoverStats: `Resist: 3
Slayer: Elemental, Fire Elemental, Flame
Karma/Fame: Level 3
Bard Diff: 75
Tame Diff: not tameable
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `3`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `88-108`,
    bard: `75`,
    taming: `not tameable`,
    resistF: `100-140`,
    resistC: `5-10`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `35-45`,
    magery: `60-75`,
    evalInt: `60-75`,
    aggroPriority: 3,
    tactics: `80-100`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `126-155`,
    dexterity: `166-185`,
    intelligence: `75-105`,
    baseDmg: `7-14`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `VOLITILE: (d20 Fire) : melee attacks against this monster cause fire damage to the attacker every hit`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: null
  },
  {
    id: 20,
    name: `Giant Beetle`,
    hoverStats: `Resist: 4
Slayer: beetle
Karma/Fame: Level 3
Bard Diff: 88
Tame Diff: 100,92,42,0
Pack instinct: None
Control Slots: 3
Food Pref: meat`,
    karma: `3`,
    gold: ``,
    alignment: `Evil`,
    hp: `200`,
    bard: `88`,
    taming: `100,92,42,0`,
    resistF: `20-30`,
    resistC: `20-30`,
    resistP: `20-30`,
    resistE: `20-30`,
    resistPh: `40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2-4`,
    anatomy: ``,
    strength: `300`,
    dexterity: `100`,
    intelligence: `500`,
    baseDmg: `7-20`,
    preferredFood: `meat`,
    controlSlots: 3,
    specials: `SUBDUE: (30): monster cannot be tamed unless below the listed hit point total. - RANGED AGGRESSION: (interrupt) If hit with a ranged attack, monster will move as an interrupt toward the attacker and make an immediate melee attack. Move Speed 6. - ARMORED - FAST HEALING: monster regains 10 hp every delay phase - MOUNT (4) - PACK ANIMAL: weight Limit 1000/20 cards or 500 /10 cards if mounted`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 21,
    name: `Giant Spider`,
    hoverStats: `Resist: 1
Slayer: Arachnid, Spider
Karma/Fame: Level 1
Bard Diff: 58
Tame Diff: 82,32,0,0
Pack instinct: Arachnid
Control Slots: 1
Food Pref: meat`,
    karma: `1`,
    gold: `25-50`,
    alignment: `Evil`,
    hp: `46-60`,
    bard: `58`,
    taming: `82,32,0,0`,
    resistF: ``,
    resistC: ``,
    resistP: `25-35`,
    resistE: ``,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `35-50`,
    resistSpell: `1-2`,
    anatomy: ``,
    strength: `76-100`,
    dexterity: `76-95`,
    intelligence: `36-60`,
    baseDmg: `5-13`,
    preferredFood: `meat`,
    controlSlots: 1,
    specials: `POISON IMMUNITY (2): poison of listed level or less have no effect on this creature.  -  PACK INSTINCT : (Arachnid) damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map.`,
    animate: false,
    packInstinct: `Arachnid`,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 22,
    name: `Gargoyle`,
    hoverStats: `Resist: 3
Slayer: Demon, Gargoyle
Karma/Fame: Level 3
Bard Diff: 73
Tame Diff: 
Pack instinct: None
Control Slots: 1
Food Pref: Chicken`,
    karma: `3`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `88-105`,
    bard: `73`,
    taming: `0`,
    resistF: `25-35`,
    resistC: `5-10`,
    resistP: `15-25`,
    resistE: ``,
    resistPh: `30-35`,
    magery: `70-85`,
    evalInt: `70-85`,
    aggroPriority: 2,
    tactics: `50-70`,
    resistSpell: `3`,
    anatomy: ``,
    strength: `146-175`,
    dexterity: `76-95`,
    intelligence: `81-105`,
    baseDmg: `7-14`,
    preferredFood: `Chicken`,
    controlSlots: 1,
    specials: `STONE SKIN: (20 HP): Monster turns to stone for 6 turns if hp drops below listed amount, is impervious to damage and is blocking terrain. After duration, Monster returns to normal at full health.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 23,
    name: `Gazer`,
    hoverStats: `Resist: 2
Slayer: none
Karma/Fame: Level 3
Bard Diff: 73
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `58-75`,
    bard: `73`,
    taming: `0`,
    resistF: `40-50`,
    resistC: `20-30`,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `20-30`,
    magery: `50-65`,
    evalInt: `50-65`,
    aggroPriority: 3,
    tactics: `50-70`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `96-125`,
    dexterity: `86-105`,
    intelligence: `141-165`,
    baseDmg: `5-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `AMBIDEXTROUS(5): Monster will make a single attack against up to 5 targets per round in LOS. -    CURING (60%): if poisoned. Monster will replace next action with a cure attempt`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 24,
    name: `Elder Gazer`,
    hoverStats: `Resist: 5
Slayer: none
Karma/Fame: Level 3
Bard Diff: 90
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `400-600`,
    alignment: `Evil`,
    hp: `178-195`,
    bard: `90`,
    taming: `na`,
    resistF: `60-70`,
    resistC: `40-50`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `45-55`,
    magery: `90-100`,
    evalInt: `90-100`,
    aggroPriority: 4,
    tactics: `80-100`,
    resistSpell: `5-6`,
    anatomy: `60-100`,
    strength: `296-325`,
    dexterity: `86-105`,
    intelligence: `291-385`,
    baseDmg: `8-19`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `AMBIDEXTROUS(5): Monster will make a single attack against up to 5 targets per round in LOS. Move actions will move into LOS of Next target. - CURING (80%): if poisoned. Monster will replace next action with a cure attempt. (Interrupt)  Dispel (Interrupt)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 25,
    name: `Great Hart`,
    hoverStats: `Resist: 1
Slayer: none
Karma/Fame: Level 0
Bard Diff: 27
Tame Diff: 82,32,0,0
Pack instinct: none
Control Slots: 1
Food Pref: fruit/vege`,
    karma: `0`,
    gold: ``,
    alignment: `nuetral`,
    hp: `27-41`,
    bard: `27`,
    taming: `82,32,0,0`,
    resistF: ``,
    resistC: `5-10`,
    resistP: ``,
    resistE: ``,
    resistPh: `20-25`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: `29-47`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `41-71`,
    dexterity: `47-77`,
    intelligence: `27-57`,
    baseDmg: `7-13`,
    preferredFood: `fruit/vege`,
    controlSlots: 1,
    specials: ``,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 26,
    name: `Greater Dragon`,
    hoverStats: `Resist: 2
Slayer: Dragon, Reptile
Karma/Fame: Level 5
Bard Diff: 160
Tame Diff: 2,0,0,0
Pack instinct: None
Control Slots: 5
Food Pref: Meat`,
    karma: `5`,
    gold: `1720-2500`,
    alignment: `Evil`,
    hp: `1000-2000`,
    bard: `160`,
    taming: `2,0,0,0`,
    resistF: `65-90`,
    resistC: `40-55`,
    resistP: `40-60`,
    resistE: `50-75`,
    resistPh: `60-85`,
    magery: `110-140`,
    evalInt: `90-100`,
    aggroPriority: 4,
    tactics: `110-140`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `1025-1425`,
    dexterity: `81-148`,
    intelligence: `475-675`,
    baseDmg: `24-33`,
    preferredFood: `Meat`,
    controlSlots: 5,
    specials: `ARMORED: weapons striking this creature must make durability checks upon successful hits. - TAILSWIPE: AOE, Melee damage to all enemies within range 3 - DISPEL (95%) interrupt - CURING (95%) interrupt - DETECT HIDDEN (95%) interrupt`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 2
  },
  {
    id: 27,
    name: `Griffin`,
    hoverStats: `Resist: 3
Slayer: Dragon
Karma/Fame: Level 5
Bard Diff: 109
Tame Diff: 3,0,0,0
Pack instinct: none
Control Slots: 5
Food Pref: Fish`,
    karma: `5`,
    gold: `1500-1900`,
    alignment: `Evil`,
    hp: `900-1100`,
    bard: `98-115`,
    taming: `3,0,0,0`,
    resistF: `70-90`,
    resistC: `15-25`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `55-70`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100-110`,
    resistSpell: `3-4`,
    anatomy: `75-80`,
    strength: `1200-1420`,
    dexterity: `170-270`,
    intelligence: `300-325`,
    baseDmg: `18-30`,
    preferredFood: `Fish`,
    controlSlots: 5,
    specials: `MOUNT (4): once tamed, creature may be ridden as a Flying mount`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 28,
    name: `Hell Hound`,
    hoverStats: `Resist: 3
Slayer: Wolf, Flame
Karma/Fame: Level 3
Bard Diff: 63
Tame Diff: 29,0,0,0
Pack instinct: Canine
Control Slots: 1
Food Pref: Meat`,
    karma: `3`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `66-125`,
    bard: `63`,
    taming: `29,0,0,0`,
    resistF: `30-40`,
    resistC: ``,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `25-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50-70`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `102-150`,
    dexterity: `81-105`,
    intelligence: `36-60`,
    baseDmg: `11-17`,
    preferredFood: `Meat`,
    controlSlots: 1,
    specials: `PACK INSTINCT:: (Canine) damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map`,
    animate: false,
    packInstinct: `Canine`,
    damageType: 2,
    breathDmgType: 2
  },
  {
    id: 29,
    name: `Horse`,
    hoverStats: `Resist: 1
Slayer: none
Karma/Fame: Level -1
Bard Diff: 26
Tame Diff: 100,92,42,0
Pack instinct: none
Control Slots: 1
Food Pref: fruit/vege`,
    karma: `0`,
    gold: ``,
    alignment: `nuetral`,
    hp: `27-41`,
    bard: `26`,
    taming: `100,92,42,0`,
    resistF: ``,
    resistC: ``,
    resistP: ``,
    resistE: ``,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: `21-42`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `22-98`,
    dexterity: `56-75`,
    intelligence: `6-10`,
    baseDmg: `4-6`,
    preferredFood: `fruit/vege`,
    controlSlots: 1,
    specials: `MOUNT(4): once tamed, creature may be ridden as a mount`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 30,
    name: `Imp`,
    hoverStats: `Resist: 2
Slayer: Deamon
Karma/Fame: Karma 2
Bard Diff: 65
Tame Diff: 34,0,0,0
Pack instinct: None
Control Slots: 1
Food Pref: meat`,
    karma: `2`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `20-30`,
    bard: `65`,
    taming: `34,0,0,0`,
    resistF: `40-50`,
    resistC: `20-30`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `25-35`,
    magery: `90-100`,
    evalInt: `20-30`,
    aggroPriority: 3,
    tactics: `42-50`,
    resistSpell: `1-2`,
    anatomy: ``,
    strength: `91-115`,
    dexterity: `61-80`,
    intelligence: `86-105`,
    baseDmg: `10-14`,
    preferredFood: `meat`,
    controlSlots: 1,
    specials: `HUNGER PAINS*: target reduces Hunger track 8 steps. (Resistable)`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 31,
    name: `Lich`,
    hoverStats: `Resist: 4
Slayer: Undead, Mage
Karma/Fame: Level 4
Bard Diff: 85
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `275-324`,
    alignment: `Evil`,
    hp: `103-120`,
    bard: `85`,
    taming: `0`,
    resistF: `20-30`,
    resistC: `50-60`,
    resistP: `55-65`,
    resistE: `40-50`,
    resistPh: `40-60`,
    magery: `70-80`,
    evalInt: `100`,
    aggroPriority: 4,
    tactics: `70-90`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `171-200`,
    dexterity: `126-145`,
    intelligence: `276-305`,
    baseDmg: `24-26`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY(5): immune to all poison levels - DISPEL (70%)  (interrupt)`,
    animate: true,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 32,
    name: `Lich Lord`,
    hoverStats: `Resist: 7
Slayer: Undead, Mage
Karma/Fame: Level 5
Bard Diff: 106
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `450-600`,
    alignment: `Evil`,
    hp: `250-303`,
    bard: `106`,
    taming: `0`,
    resistF: `30-40`,
    resistC: `50-60`,
    resistP: `50-60`,
    resistE: `40-50`,
    resistPh: `40-50`,
    magery: `90-100`,
    evalInt: `90-100`,
    aggroPriority: 4,
    tactics: `50-70`,
    resistSpell: `6-8`,
    anatomy: ``,
    strength: `416-505`,
    dexterity: `146-165`,
    intelligence: `566-655`,
    baseDmg: `24-26`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (5) -  DISPEL (80%). (interupt) - TELEPORT: if monster loses LOS to all potential targets, ignore all blocking terrain and move monster adjacent to target in aggro priority up to 10 spaces away (Interrupt) - DETECT HIDDEN (80%`,
    animate: true,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 33,
    name: `Medusa`,
    hoverStats: `Resist: 5
Slayer: Repond
Karma/Fame: Level 5
Bard Diff: 160
Tame Diff: Not Tameable
Pack instinct: None
Control Slots: na
Food Pref: Meat`,
    karma: `5`,
    gold: `1500-3000`,
    alignment: `Evil`,
    hp: `1000-2000`,
    bard: `160`,
    taming: `Not Tameable`,
    resistF: `50-60`,
    resistC: `55-65`,
    resistP: `70-90`,
    resistE: `65-75`,
    resistPh: `55-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 4,
    tactics: `125-135`,
    resistSpell: `5`,
    anatomy: `90-100`,
    strength: `1378-1442`,
    dexterity: `129-143`,
    intelligence: `575-671`,
    baseDmg: `21-28`,
    preferredFood: `Meat`,
    controlSlots: 0,
    specials: `ARTIFACT DROP: 10% - AVOID GAZE: DCI 20 -  RANGED MASTERY: May make ranged attacks vs adjacent enemies. -  WILD GAZE: Pets/summons in LOS of Medusa go wild and attack according to Aggro Priority until Medusa is slain. - STONE CORPSE: character corpses are stone and cannot be looted while Medusa is alive. - POISON IMMUNITY (5) -  CORRUPT: All opponents in line of sight lose d6 Karma levels (RESISTABLE)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 34,
    name: `Mummy`,
    hoverStats: `Resist: 0
Slayer: Undead
Karma/Fame: Level 3
Bard Diff: 63
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `305-315`,
    alignment: `Evil`,
    hp: `100-200`,
    bard: `63`,
    taming: `0`,
    resistF: `10-20`,
    resistC: `50-60`,
    resistP: `20-30`,
    resistE: `20-30`,
    resistPh: `45-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `35-50`,
    resistSpell: ``,
    anatomy: ``,
    strength: `346-370`,
    dexterity: `71-90`,
    intelligence: `26-40`,
    baseDmg: `13-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (1): poison of listed level or less have no effect on this creature`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 35,
    name: `Nightmare`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 3
Bard Diff: 85
Tame Diff: 10,0,0,0
Pack instinct: None
Control Slots: 2
Food Pref: Meat`,
    karma: `3`,
    gold: `400-500`,
    alignment: `Evil`,
    hp: `298-315`,
    bard: `85`,
    taming: `10,0,0,0`,
    resistF: `30-40`,
    resistC: `30-40`,
    resistP: `30-40`,
    resistE: `20-30`,
    resistPh: `55-65`,
    magery: `10-50`,
    evalInt: `10-50`,
    aggroPriority: 2,
    tactics: `98-100`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `496-525`,
    dexterity: `86-125`,
    intelligence: `86-125`,
    baseDmg: `16-22`,
    preferredFood: `Meat`,
    controlSlots: 2,
    specials: `MOUNT(4): once tamed, creature may be ridden as a mount`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: 2
  },
  {
    id: 36,
    name: `Ogre`,
    hoverStats: `Resist: 2
Slayer: Repond, Ogre
Karma/Fame: Level 1
Bard Diff: 49
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: meat`,
    karma: `1`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `100-117`,
    bard: `49`,
    taming: `not tameable`,
    resistF: `15-25`,
    resistC: `15-25`,
    resistP: `15-25`,
    resistE: `25`,
    resistPh: `30-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-70`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `166-195`,
    dexterity: `46-65`,
    intelligence: `46-70`,
    baseDmg: `9-11`,
    preferredFood: `meat`,
    controlSlots: 0,
    specials: `CRUSHING: any armor location damaged by a melee strike must make a durability check at -30%  - Weapon Resistance(Maces)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 37,
    name: `Ogre Lord`,
    hoverStats: `Resist: 5
Slayer: Repond, Ogre
Karma/Fame: Level 4
Bard Diff: 90
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `600-650`,
    alignment: `Evil`,
    hp: `476-552`,
    bard: `90`,
    taming: `not tameable`,
    resistF: `30-40`,
    resistC: `30-40`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `45-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `90-100`,
    resistSpell: `5-6`,
    anatomy: ``,
    strength: `767-945`,
    dexterity: `66-75`,
    intelligence: `46-70`,
    baseDmg: `20-25`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY(2) -  CRUSHING: any armor location damaged by a melee strike must make a durability check at -50% -  Weapon Resistance(Maces`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 38,
    name: `Orc `,
    hoverStats: `Resist: 3
Slayer: Repond, orc
Karma/Fame: Level 2
Bard Diff: 73
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: Players`,
    karma: `2`,
    gold: `147-215`,
    alignment: `Evil`,
    hp: `95-123`,
    bard: `73`,
    taming: `not tameable`,
    resistF: `30-40`,
    resistC: `20-30`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `25-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `75-90`,
    resistSpell: `2-3`,
    anatomy: `100`,
    strength: `147-215`,
    dexterity: `81-100`,
    intelligence: `61-85`,
    baseDmg: `4-14`,
    preferredFood: `Players`,
    controlSlots: 0,
    specials: `BOLA: If not adjacent to opponnent, replace action with, dismount the closest mounted opponent within 8 tiles. Opponent struck cannot remount this combat. - BLEED: target takes an additional 6pts direct damage for 5 rounds during delay phase`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 39,
    name: `Pack Horse`,
    hoverStats: `Resist: 1
Slayer: 
Karma/Fame: Level -1
Bard Diff: 32
Tame Diff: Must Buy
Pack instinct: None
Control Slots: 1
Food Pref: fruit. veg`,
    karma: `0`,
    gold: ``,
    alignment: `Nuetral`,
    hp: `61-80`,
    bard: `32`,
    taming: `100,92,42,0`,
    resistF: `10-15`,
    resistC: `20-25`,
    resistP: `10-15`,
    resistE: `10-15`,
    resistPh: `20-25`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: `30-44`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `44-120`,
    dexterity: `36-55`,
    intelligence: `6-10`,
    baseDmg: `7-16`,
    preferredFood: `fruit. veg`,
    controlSlots: 1,
    specials: `PACK ANIMAL: weight Limit 1000/20 cards - UNINTERESTING: The Pack Horse is always the last target choice in enemy aggro priority`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 40,
    name: `Pixie`,
    hoverStats: `Resist: 6
Slayer: fey
Karma/Fame: Karma -2
Bard Diff: 84
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Good`,
    hp: `15-20`,
    bard: `84`,
    taming: `na`,
    resistF: `40-50`,
    resistC: `40-50`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `80-90`,
    magery: `90-100`,
    evalInt: `90-100`,
    aggroPriority: 3,
    tactics: `10-20`,
    resistSpell: `4-6`,
    anatomy: ``,
    strength: `21-30`,
    dexterity: `300-400`,
    intelligence: `200-250`,
    baseDmg: `9-15`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `PIXIE DUST: target reduces sleep track 8 steps. (RESISTIBLE) - INVISIBILITY: DCI 20`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 41,
    name: `Giant Rat`,
    hoverStats: `Resist: 1
Slayer: Vermin
Karma/Fame: Level 0
Bard Diff: 25
Tame Diff: 100,92,42,0
Pack instinct: none
Control Slots: 1
Food Pref: fish`,
    karma: `0`,
    gold: `25-50`,
    alignment: `Evil`,
    hp: `26-39`,
    bard: `25`,
    taming: `100,92,42,0`,
    resistF: `5-10`,
    resistC: ``,
    resistP: `25-30`,
    resistE: ``,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `30-44`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `32-74`,
    dexterity: `46-65`,
    intelligence: `16-30`,
    baseDmg: `5-11`,
    preferredFood: `fish`,
    controlSlots: 1,
    specials: ``,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 42,
    name: `Ratman`,
    hoverStats: `Resist: 1
Slayer: Repond
Karma/Fame: Level 0
Bard Diff: 49
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: Chicken`,
    karma: `0`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `58-72`,
    bard: `49`,
    taming: `not tameable`,
    resistF: `10-20`,
    resistC: `10-20`,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `25-30`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50-75`,
    resistSpell: `1-2`,
    anatomy: ``,
    strength: `96-120`,
    dexterity: `81-100`,
    intelligence: `36-60`,
    baseDmg: `4-5`,
    preferredFood: `Chicken`,
    controlSlots: 0,
    specials: `LOOT (interrupt): Loot 1 equipped item or inventory item if nothing equipped. Can loot bodies they did not kill`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 43,
    name: `Ratman Archer`,
    hoverStats: `Resist: 3
Slayer: Repond
Karma/Fame: Level 0
Bard Diff: 73
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: `30-35`,
    alignment: `Evil`,
    hp: `88-108`,
    bard: `73`,
    taming: `not tameable`,
    resistF: `10-20`,
    resistC: `10-20`,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `25-30`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50-75`,
    resistSpell: `2-3`,
    anatomy: `60-100`,
    strength: `146-180`,
    dexterity: `101-130`,
    intelligence: `116-140`,
    baseDmg: `4-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `LOOT (interrupt): Loot 1 equipped item or inventory item if nothing equipped. Can loot bodies they did not kill`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 44,
    name: `Ratman Mage`,
    hoverStats: `Resist: 2
Slayer: Repond
Karma/Fame: Level 1
Bard Diff: 78
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `1`,
    gold: `27-35`,
    alignment: `Evil`,
    hp: `88-108`,
    bard: `78-82`,
    taming: `not tameable`,
    resistF: `10-20`,
    resistC: `10-20`,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `40-45`,
    magery: `70-80`,
    evalInt: `70-80`,
    aggroPriority: 3,
    tactics: `50-75`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `146-180`,
    dexterity: `101-130`,
    intelligence: `186-210`,
    baseDmg: `7-14`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: ``,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 45,
    name: `Reptalon`,
    hoverStats: `Resist: 3
Slayer: Dragon, Reptile
Karma/Fame: Level 5
Bard Diff: 118
Tame Diff: 4,0,0,0
Pack instinct: None
Control Slots: 5
Food Pref: Meat`,
    karma: `5`,
    gold: `1600-2500`,
    alignment: `Evil`,
    hp: `800-1000`,
    bard: `115-120`,
    taming: `4,0,0,0`,
    resistF: `35-45`,
    resistC: `35-45`,
    resistP: `50-65`,
    resistE: `70-85`,
    resistPh: `50-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100-108`,
    resistSpell: `3`,
    anatomy: `55-60`,
    strength: `1000-1025`,
    dexterity: `81-148`,
    intelligence: `250-290`,
    baseDmg: `21-28`,
    preferredFood: `Meat`,
    controlSlots: 5,
    specials: `MOUNT (Move 4): May be ridden as a mount once tamed. Cannot Fly while Mounted - DCI 15`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: 5
  },
  {
    id: 46,
    name: `Rotting Corpse`,
    hoverStats: `Resist: 10
Slayer: Undead
Karma/Fame: Level 5
Bard Diff: 129
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `1050-1275`,
    alignment: `Evil`,
    hp: `1200`,
    bard: `129`,
    taming: `0`,
    resistF: `20-30`,
    resistC: `50-70`,
    resistP: `40-50`,
    resistE: `20-30`,
    resistPh: `35-45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `10`,
    anatomy: ``,
    strength: `301-350`,
    dexterity: `75`,
    intelligence: `151-200`,
    baseDmg: `8-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY(5): immune to all poison levels`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 47,
    name: `Rune Beetle`,
    hoverStats: `Resist: 4
Slayer: Beetle
Karma/Fame: Level 5
Bard Diff: 112
Tame Diff: 12,0,0,0
Pack instinct: None
Control Slots: 3
Food Pref: Fuit, Veg`,
    karma: `5`,
    gold: `1000-1200`,
    alignment: `Evil`,
    hp: `310-360`,
    bard: `112`,
    taming: `12,0,0,0`,
    resistF: `35-50`,
    resistC: `35-50`,
    resistP: `75-95`,
    resistE: `40-60`,
    resistPh: `40-65`,
    magery: `100-110`,
    evalInt: `100-125`,
    aggroPriority: 4,
    tactics: `80-95`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `400-465`,
    dexterity: `125-170`,
    intelligence: `375-450`,
    baseDmg: `15-22`,
    preferredFood: `Fuit, Veg`,
    controlSlots: 3,
    specials: `ARMOR CORRUPTION:Opponents damage resists are -50 for 4 rounds - Bleed: target takes an additional 6pts direct damage for 5 rounds in delay phase.- ARMORED: weapons striking this creature must make durability checks upon successful hits`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 48,
    name: `Serpent,Giant`,
    hoverStats: `Resist: 1
Slayer: Reptile, Snake
Karma/Fame: Level 3
Bard Diff: 71
Tame Diff: na
Pack instinct: none
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `112-129`,
    bard: `71`,
    taming: `na`,
    resistF: `5-10`,
    resistC: `10-20`,
    resistP: `70-90`,
    resistE: `10-20`,
    resistPh: `30-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `65-70`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `186-215`,
    dexterity: `56-80`,
    intelligence: `66-85`,
    baseDmg: `19-35`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `COIL: Adjacent target is paralyzed for 4 rounds`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 49,
    name: `Sheep`,
    hoverStats: `Resist: 0
Slayer: na
Karma/Fame: Level 0
Bard Diff: 6.6
Tame Diff: 100,100,78,28
Pack instinct: none
Control Slots: 1
Food Pref: Fruits, Veggies`,
    karma: `0`,
    gold: ``,
    alignment: `nuetral`,
    hp: `18`,
    bard: `6.6`,
    taming: `100,100,78,28`,
    resistF: ``,
    resistC: ``,
    resistP: ``,
    resistE: ``,
    resistPh: `5-15`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: `5`,
    resistSpell: ``,
    anatomy: ``,
    strength: `30`,
    dexterity: `15`,
    intelligence: `5`,
    baseDmg: `1-4`,
    preferredFood: `Fruits, Veggies`,
    controlSlots: 1,
    specials: `SHEAR: collect 1d4 leather hides per calender day`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 50,
    name: `Siren`,
    hoverStats: `Resist: 2
Slayer: None
Karma/Fame: Level 2
Bard Diff: 87
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `88-108`,
    bard: `87`,
    taming: `not tameable`,
    resistF: `30-40`,
    resistC: `25-35`,
    resistP: `10-20`,
    resistE: `10-20`,
    resistPh: `40-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `80-90`,
    resistSpell: `2-3`,
    anatomy: `60-100`,
    strength: `251-350`,
    dexterity: `61-80`,
    intelligence: `101-150`,
    baseDmg: `7-10`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `RANGED MASTERY: May make ranged attacks vs adjacent enemies. -  ELUSIVE: may breakaway from adjacent enemies without drawing attacks of Opportunity. - SIREN SONG (Resistable): Roll d6 and replace next action with an Arm/Disarm action for that armor slot. Disarmed item may not be rearmed while Siren is alive or in LOS`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 51,
    name: `Skeleton`,
    hoverStats: `Resist: 2
Slayer: undead
Karma/Fame: Level 0
Bard Diff: 39
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: `25-50`,
    alignment: `Evil`,
    hp: `34-48`,
    bard: `39`,
    taming: `0`,
    resistF: `5-10`,
    resistC: `25-40`,
    resistP: `25-35`,
    resistE: `5-15`,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `45-60`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `56-80`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `3-7`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `HEALTH SIPHON: Healing spells cast adjacent to this monster, heal it rather than target.-TAUNT: Monster is Aggro Priority 1 to any Pets in LOS`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 52,
    name: `Succubus`,
    hoverStats: `Resist: 4
Slayer: Demon
Karma/Fame: Level 5
Bard Diff: 107
Tame Diff: not tameable
Pack instinct: None
Control Slots: 
Food Pref: `,
    karma: `5`,
    gold: `1000-1200`,
    alignment: `Evil`,
    hp: `312-353`,
    bard: `107`,
    taming: `not tameable`,
    resistF: `70-80`,
    resistC: `30-40`,
    resistP: `40-50`,
    resistE: `50-60`,
    resistPh: `80-90`,
    magery: `100`,
    evalInt: `100`,
    aggroPriority: 4,
    tactics: `80-90`,
    resistSpell: `4-6`,
    anatomy: ``,
    strength: `488-620`,
    dexterity: `121-170`,
    intelligence: `498-675`,
    baseDmg: `5-8`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CURING (80%) if poisoned. Monster will replace next action with a cure attempt.(interrupt) - FLYING: monster can move up to 5 spaces on a “move” action toward target in aggro priority ignoring terrain, if monster has no valid target. -LIFE DRAIN: AOE 2 (d20+10 Energy): Any opponents within 2 tiles of a Succubus during its delay phase incurs energy damage which is added to the succubus' hp pool up to max.  -   DISPEL (75%) (Interrupt):  -  CORRUPT: All opponents in line of sight lose d6 Karma Levels (Resistable)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 53,
    name: `(Sum) Air Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: 
Bard Diff: 85
Tame Diff: 
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Neutral`,
    hp: `150`,
    bard: `85`,
    taming: `0`,
    resistF: `15-25`,
    resistC: `10-20`,
    resistP: `55-65`,
    resistE: `25-35`,
    resistPh: `35-45`,
    magery: `70`,
    evalInt: `70`,
    aggroPriority: 3,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `200`,
    dexterity: `200`,
    intelligence: `100`,
    baseDmg: `8-10`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `DEAFENING WINDS: taking a precast action while adjacent to monster = automatic disruption`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 54,
    name: `(Sum) Earth Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental, Earth Elem
Karma/Fame: 
Bard Diff: 68
Tame Diff: 
Pack instinct: None
Control Slots: 2
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Neutral`,
    hp: `180`,
    bard: `68`,
    taming: `0`,
    resistF: `10-20`,
    resistC: `10-20`,
    resistP: `15-25`,
    resistE: `15-25`,
    resistPh: `30-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `200`,
    dexterity: `70`,
    intelligence: `70`,
    baseDmg: `13-21`,
    preferredFood: `0`,
    controlSlots: 2,
    specials: `HARD TO DISPELl (40): Reduce any attempt to dispel this monster by 40%`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 55,
    name: `(Sum) Blade Spirit`,
    hoverStats: `Resist: 2
Slayer: 
Karma/Fame: 
Bard Diff: 75
Tame Diff: na
Pack instinct: None
Control Slots: 2
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `0`,
    hp: `75`,
    bard: `75`,
    taming: `na`,
    resistF: `40-50`,
    resistC: `30-40`,
    resistP: `100`,
    resistE: `20-30`,
    resistPh: `30-40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `150`,
    dexterity: `150`,
    intelligence: `100`,
    baseDmg: `3-7`,
    preferredFood: `0`,
    controlSlots: 2,
    specials: `Blade Spirit cannot be commanded. Summon next to an opponent in LOS. Will attack opponents in aggro priority until dispelled or killed`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 56,
    name: `(Sum) Energy Vortex`,
    hoverStats: `Resist: 4
Slayer: 
Karma/Fame: 
Bard Diff: 75
Tame Diff: na
Pack instinct: None
Control Slots: 2
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `0`,
    hp: `150`,
    bard: `75`,
    taming: `na`,
    resistF: `40-50`,
    resistC: `40-50`,
    resistP: `40-50`,
    resistE: `90-100`,
    resistPh: `60-70`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `200`,
    dexterity: `200`,
    intelligence: `100`,
    baseDmg: `6-7`,
    preferredFood: `0`,
    controlSlots: 2,
    specials: `Vortex cannot be commanded. Summon next to an opponent in LOS. Will attack opponents in aggro priority until dispelled or killed`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 57,
    name: `(Sum) Deamon`,
    hoverStats: `Resist: 3
Slayer: Demon
Karma/Fame: 
Bard Diff: 90
Tame Diff: not tameable
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Evil`,
    hp: `200`,
    bard: `90`,
    taming: `not tameable`,
    resistF: `50-60`,
    resistC: `30-40`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `45-60`,
    magery: `70-80`,
    evalInt: `70-80`,
    aggroPriority: 3,
    tactics: `70-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `200`,
    dexterity: `110`,
    intelligence: `150`,
    baseDmg: `7-20`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `Curing (70%) : if poisoned. Monster will replace next action with a cure attempt. - FLYING: monster can move up to 5 spaces during action phase toward target in aggro priority ignoring terrain, if monster has no valid target.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 58,
    name: `(Sum) Fire Elemental`,
    hoverStats: `Resist: 3
Slayer: Elemental, Fire Elemental, Flame
Karma/Fame: 
Bard Diff: 75
Tame Diff: not tameable
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Evil`,
    hp: `200`,
    bard: `75`,
    taming: `not tameable`,
    resistF: `70-80`,
    resistC: `5-10`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `35-45`,
    magery: `60-75`,
    evalInt: `60-75`,
    aggroPriority: 3,
    tactics: `80-100`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `200`,
    dexterity: `200`,
    intelligence: `100`,
    baseDmg: `7-9`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `VOLATILE (1-20 Fire) : melee attacks against this monster cause fire damage to the attacker every hit`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: null
  },
  {
    id: 59,
    name: `(Sum) Natures Fury`,
    hoverStats: `Resist: 2
Slayer: 
Karma/Fame: 
Bard Diff: 75
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `0`,
    hp: `20`,
    bard: `75`,
    taming: `na`,
    resistF: ``,
    resistC: ``,
    resistP: ``,
    resistE: ``,
    resistPh: `80`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `150`,
    dexterity: `150`,
    intelligence: `100`,
    baseDmg: `1-3`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `Furies cannot be commanded. Summon next to an opponent in LOS. Will attack opponents in aggro priority until dispelled or killed - PACK INSTINCT`,
    animate: false,
    packInstinct: `NaturesFury`,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 60,
    name: `(Sum) Revenant`,
    hoverStats: `Resist: 5
Slayer: 
Karma/Fame: 
Bard Diff: Immune
Tame Diff: 
Pack instinct: None
Control Slots: 3
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Evil`,
    hp: `200`,
    bard: ``,
    taming: `0`,
    resistF: `20`,
    resistC: `60-70`,
    resistP: `100`,
    resistE: `60-70`,
    resistPh: `60-70`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 0,
    tactics: `100`,
    resistSpell: `5`,
    anatomy: ``,
    strength: `200`,
    dexterity: `150`,
    intelligence: `150`,
    baseDmg: `18-19`,
    preferredFood: `0`,
    controlSlots: 3,
    specials: `HUNTER: Revenant only attacks the target of the spell chosen upon casting, until death. If target is not in range during action phase, Revenant Moves 4 toward Target. Dispels itself upon death of target. - ALL SEEING: Revenant can freely attack hidden and stealthing Characters. - POISON IMMUNITY (5)`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 61,
    name: `(Sum) Water Elemental`,
    hoverStats: `Resist: 4
Slayer: Elemental, water Elemental
Karma/Fame: 
Bard Diff: 80
Tame Diff: 
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Neutral`,
    hp: `165`,
    bard: `80`,
    taming: `0`,
    resistF: `10-25`,
    resistC: `10-25`,
    resistP: `60-70`,
    resistE: `5-10`,
    resistPh: `35-45`,
    magery: `70`,
    evalInt: `70`,
    aggroPriority: 3,
    tactics: `100`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `200`,
    dexterity: `70`,
    intelligence: `100`,
    baseDmg: `15-20`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `WATER WALK: Monster can freely move across land or water without penalty. -  DISPEL (50%): if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING (60%) : if poisoned. Monster will replace next action with a cure attempt. - WEAPON VULNERABILITY (Mace). - WEAPON RESISTANCE: Swords/Fencing `,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 62,
    name: `Titan`,
    hoverStats: `Resist: 4
Slayer: Repond
Karma/Fame: Level 4
Bard Diff: 93
Tame Diff: not tameable
Pack instinct: None
Control Slots: 
Food Pref: `,
    karma: `4`,
    gold: `600-800`,
    alignment: `Evil`,
    hp: `322-351`,
    bard: `93`,
    taming: `not tameable`,
    resistF: `30-40`,
    resistC: `25-35`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `35-45`,
    magery: `85-100`,
    evalInt: `85-100`,
    aggroPriority: 4,
    tactics: `60-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `536-585`,
    dexterity: `126-146`,
    intelligence: `281-305`,
    baseDmg: `13-16`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CURING (80%) : if poisoned. Monster will replace next action with a cure attempt.(Interrupt)    - DISPEL (75%): if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled.(interrupt)  -  GRAB: target is thrown at a non adjecent opponent in LOS, range 10. Both Targets take the full melee damage. Place thrown target adjacent to struck target, furthest from Titan.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 63,
    name: `Unicorn`,
    hoverStats: `Resist: 3
Slayer: Fey
Karma/Fame: Level -4
Bard Diff: 86
Tame Diff: 10,0,0,0
Pack instinct: None
Control Slots: 2
Food Pref: fruit, grain`,
    karma: `0`,
    gold: `300-350`,
    alignment: `Good`,
    hp: `191-210`,
    bard: `86`,
    taming: `10,0,0,0`,
    resistF: `25-40`,
    resistC: `25-40`,
    resistP: `56-65`,
    resistE: `25-40`,
    resistPh: `55-65`,
    magery: `60-80`,
    evalInt: `80-90`,
    aggroPriority: 2,
    tactics: `93-100`,
    resistSpell: `3`,
    anatomy: `65-100`,
    strength: `296-325`,
    dexterity: `96-115`,
    intelligence: `186-225`,
    baseDmg: `16-22`,
    preferredFood: `fruit, grain`,
    controlSlots: 2,
    specials: `CURE MASTER (90%): will attempt to cure an adjacent poisoned master and replace current action with cure, even while mounted. -  MOUNT (4): if tamed, creature can be ridden as a mount. - POISON IMMUNITY (5)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 64,
    name: `Wandering Healer`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level -3
Bard Diff: 96
Tame Diff: not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Good`,
    hp: `304-400`,
    bard: `96`,
    taming: `not tameable`,
    resistF: `40-50`,
    resistC: `40-50`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `40-50`,
    magery: `82-100`,
    evalInt: `82-100`,
    aggroPriority: 4,
    tactics: `82-100`,
    resistSpell: `2-3`,
    anatomy: `73-98`,
    strength: `146-180`,
    dexterity: `101-130`,
    intelligence: `186-210`,
    baseDmg: `10-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `DISPEL (75%) - CURING (75%) - BENEVOLENT: a ghost character with positive karma will be resurrected and healed to max hp when encountering a wandering healer. Roll for additional encounter at current location upon healing`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 65,
    name: `War Cat`,
    hoverStats: `Resist: 3
Slayer: Fey
Karma/Fame: Level -5
Bard Diff: 131
Tame Diff: 4,0,0,0
Pack instinct: None
Control Slots: 4
Food Pref: Fruit, Veg`,
    karma: `0`,
    gold: `1500-1900`,
    alignment: `Evil`,
    hp: `1010-1275`,
    bard: `127-131`,
    taming: `4,0,0,0`,
    resistF: `25-45`,
    resistC: `70-85`,
    resistP: `30-50`,
    resistE: `70-85`,
    resistPh: `50-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `93-100`,
    resistSpell: `3`,
    anatomy: `65-100`,
    strength: `1200-1225`,
    dexterity: `150-170`,
    intelligence: `250-275`,
    baseDmg: `21-28`,
    preferredFood: `Fruit, Veg`,
    controlSlots: 4,
    specials: `HEALER: If adjacent to injuried master, will replace current acction with Heal d20+25, Delay 5. Wont repeat until resolved. - MOUNT (4): if tamed, creature can be ridden as a mount. - BLEED: target takes an additional 6pts direct damage for 5 rounds in delay phase.`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 66,
    name: `Water Elemental`,
    hoverStats: `Resist: 5
Slayer: Elemental, water Elemental
Karma/Fame: Level 3
Bard Diff: 80
Tame Diff: 
Pack instinct: None
Control Slots: 4
Food Pref: `,
    karma: `3`,
    gold: `175-225`,
    alignment: `Neutral`,
    hp: `76-93`,
    bard: `80`,
    taming: `0`,
    resistF: `10-25`,
    resistC: `10-25`,
    resistP: `60-70`,
    resistE: `5-10`,
    resistPh: `35-45`,
    magery: `60-75`,
    evalInt: `60-75`,
    aggroPriority: 3,
    tactics: `60-75`,
    resistSpell: `4-5`,
    anatomy: ``,
    strength: `126-155`,
    dexterity: `66-85`,
    intelligence: `101-125`,
    baseDmg: `7-9`,
    preferredFood: `0`,
    controlSlots: 4,
    specials: `WATER WALK: Monster can freely move across land or water without penalty. -  DISPEL (50%): if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING (60%) : if poisoned. Monster will replace next action with a cure attempt. - WEAPON VULNERABILITY (Mace). - WEAPON RESISTANCE: Swords/Fencing`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 67,
    name: `Wolf`,
    hoverStats: `Resist: 1
Slayer: Wolf
Karma/Fame: Level 0
Bard Diff: 32
Tame Diff: 70,20,0,0
Pack instinct: Canine
Control Slots: 1
Food Pref: Meat`,
    karma: `0`,
    gold: ``,
    alignment: `Nuetral`,
    hp: `34-48`,
    bard: `32`,
    taming: `70,20,0,0`,
    resistF: `10-15`,
    resistC: `20-25`,
    resistP: `10-15`,
    resistE: `10-15`,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: `45-60`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `56-80`,
    dexterity: `56-75`,
    intelligence: `31-55`,
    baseDmg: `4-10`,
    preferredFood: `Meat`,
    controlSlots: 1,
    specials: `PACK INSTINCT : (Canine) damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map. -  TRACKING:  Add a bonus to your tracking roll equal to the number of pets with Tracking in your pack.(master must have at least tracking level 1)`,
    animate: false,
    packInstinct: `Canine`,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 68,
    name: `Wyvern`,
    hoverStats: `Resist: 2
Slayer: Reptile
Karma/Fame: Level 2
Bard Diff: 80
Tame Diff: na
Pack instinct: none
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `175-225`,
    alignment: `Evil`,
    hp: `125-141`,
    bard: `80`,
    taming: `na`,
    resistF: `30-40`,
    resistC: `20-30`,
    resistP: `90-100`,
    resistE: `30-40`,
    resistPh: `35-45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `65-90`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `202-240`,
    dexterity: `153-209`,
    intelligence: `51-90`,
    baseDmg: `8-19`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (4)`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 69,
    name: `Zombie`,
    hoverStats: `Resist: 1
Slayer: Undead
Karma/Fame: Level 0
Bard Diff: 34
Tame Diff: Not tameable
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `28-42`,
    bard: `34`,
    taming: `Not tameable`,
    resistF: ``,
    resistC: `20-30`,
    resistP: `5-10`,
    resistE: ``,
    resistPh: `15-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `35-50`,
    resistSpell: `1-2`,
    anatomy: ``,
    strength: `46-70`,
    dexterity: `31-50`,
    intelligence: `26-40`,
    baseDmg: `3-7`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SHRIEK:: roll % dice. 0-40 spawn 1d4 zombies, 41-60 spawn 1d4 mummies, 61-85 spawn Lich, 86-100 spawn Rotting Corpse`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 70,
    name: `Abomidable Hulk`,
    hoverStats: `Resist: 1
Slayer:  Ice, Snow
Karma/Fame: Level 5
Bard Diff: 130
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `1000-1400`,
    alignment: `Evil`,
    hp: `1200-1800`,
    bard: `130`,
    taming: `na`,
    resistF: `50-60`,
    resistC: `60-70`,
    resistP: `25-30`,
    resistE: `45-55`,
    resistPh: `60-75`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `120`,
    resistSpell: `1`,
    anatomy: `120`,
    strength: `450-800`,
    dexterity: `96-145`,
    intelligence: `71-95`,
    baseDmg: `20-30`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `Artifact drop: 5% , Rage(500): Double Damage while below 500 hp.`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 71,
    name: `(Tame)Bake Kitsune`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 4
Bard Diff: 96
Tame Diff: 29,0,0,0
Pack instinct: none
Control Slots: 2
Food Pref: Fish`,
    karma: `4`,
    gold: `700-1000`,
    alignment: `Evil`,
    hp: `310-350`,
    bard: `96`,
    taming: `29,0,0,0`,
    resistF: `70-90`,
    resistC: `40-60`,
    resistP: `40-60`,
    resistE: `40-60`,
    resistPh: `40-60`,
    magery: `80-90`,
    evalInt: `80-90`,
    aggroPriority: 4,
    tactics: `70-90`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `170-220`,
    dexterity: `125-145`,
    intelligence: `375-425`,
    baseDmg: `32-45`,
    preferredFood: `Fish`,
    controlSlots: 2,
    specials: `IMPERSONATE: hits against its master have 30% of hitting this monster instead while adjacent to master. - COPY CAT(interrupt): Kitsune will Teleport, Recall, Hide and Stealth to follow their master. -  PROTECTIVE INSTINCT: A Kitsune will replace its current action for a move, to move adjacent to its master if not. A Kitsune will only move adjacent to a monster if it can remain adjacent to its master. - CURING/DISPELING(90%)(interrupt)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 72,
    name: `Bake Kitsune`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 4
Bard Diff: 96
Tame Diff: 19,10,0,0
Pack instinct: none
Control Slots: 2
Food Pref: Fish`,
    karma: `4`,
    gold: `700-1000`,
    alignment: `Evil`,
    hp: `310-350`,
    bard: `96`,
    taming: `19,10,0,0`,
    resistF: `70-90`,
    resistC: `40-60`,
    resistP: `40-60`,
    resistE: `40-60`,
    resistPh: `40-60`,
    magery: `80-90`,
    evalInt: `80-90`,
    aggroPriority: 4,
    tactics: `70-90`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `170-220`,
    dexterity: `125-145`,
    intelligence: `375-425`,
    baseDmg: `32-45`,
    preferredFood: `Fish`,
    controlSlots: 2,
    specials: `CONFUSION: Characters have a 60 second limit to turn prep against this monster.- MIMIC: successful hits against monster have 40% chance to targeting a random party member or pet in range. If no alternative target in range, attack misses. -  CURING/DISPELING(90%)(interrupt)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 73,
    name: `Terathan Avenger`,
    hoverStats: `Resist: 2
Slayer: Arachnid, Terathan
Karma/Fame: Level 5
Bard Diff: 92
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `550-600`,
    alignment: `Evil`,
    hp: `296-372`,
    bard: `92`,
    taming: `na`,
    resistF: `30-40`,
    resistC: `35-45`,
    resistP: `90-100`,
    resistE: `35-45`,
    resistPh: `40-50`,
    magery: `70-100`,
    evalInt: `70-100`,
    aggroPriority: 3,
    tactics: `80-95`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `467-645`,
    dexterity: `56-75`,
    intelligence: `126-150`,
    baseDmg: `18-22`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ACID BLAST:: upon death, all opponents within 3 tiles take 2d20 poison damage, and all armor and equipped weapons must make durabilty check at -30%. Pets take double damage.(Terathans Immune) - ARMORED`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 74,
    name: `Bogling`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 1
Bard Diff: 62
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `1`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `58-72`,
    bard: `62`,
    taming: `na`,
    resistF: `10-20`,
    resistC: `15-25`,
    resistP: `15-25`,
    resistE: `15-25`,
    resistPh: `20-25`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `96-120`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `5-7`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (5),  Poison Skin: melee attacks against this monster deal 5 direct damage to the attacker upon hits`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 75,
    name: `Bone Magi`,
    hoverStats: `Resist: 2
Slayer: mage,Undead
Karma/Fame: Level 3
Bard Diff: 72
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `125-150`,
    alignment: `Evil`,
    hp: `46-60`,
    bard: `72`,
    taming: `na`,
    resistF: `20-30`,
    resistC: `50-60`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `35-40`,
    magery: `60-70`,
    evalInt: `60-70`,
    aggroPriority: 3,
    tactics: `45-60`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `76-100`,
    dexterity: `96-120`,
    intelligence: `186-210`,
    baseDmg: `3-7`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SWORDS: Melee attacks are swords for purpose of Durability Checks.- DISPEL (65%) : if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING (65%): if poisoned. Monster will replace next action with a cure attempt. - POISON IMMUNITY (2)`,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 76,
    name: `Bog Thing`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level 5
Bard Diff: 86
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `275-325`,
    alignment: `Evil`,
    hp: `481-540`,
    bard: `86`,
    taming: `na`,
    resistF: `20-25`,
    resistC: `10-15`,
    resistP: `40-50`,
    resistE: `20-25`,
    resistPh: `30-40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `70-85`,
    resistSpell: `3`,
    anatomy: ``,
    strength: `801-900`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `10-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (5)-  BARD IMMUNITY - DEVOUR(100): If below 100 hp, monster will replace current action with "Heal d20+60".  This devours a present Bogling.  If no boglings present, follow random action.  Once triggered, Bog Thing will devour until fully healed or all Boglings are devoured. - SEED (25%): Chance every round after, character is instantly killed and New Bog Thing is Spawned from Corpse. Remove curse will remove this condition.`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 77,
    name: `Boura`,
    hoverStats: `Resist: 2
Slayer: none
Karma/Fame: Level 3
Bard Diff: 80
Tame Diff: 100,56,6,0
Pack instinct: None
Control Slots: 3
Food Pref: Fuit,Veg`,
    karma: `3`,
    gold: `250-300`,
    alignment: `Evil`,
    hp: `575-666`,
    bard: `80`,
    taming: `100,56,6,0`,
    resistF: `30-40`,
    resistC: `50-60`,
    resistP: `40-50`,
    resistE: `30-40`,
    resistPh: `55-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `95-104`,
    resistSpell: `2-3`,
    anatomy: `95-104`,
    strength: `377-518`,
    dexterity: `56-75`,
    intelligence: `25-30`,
    baseDmg: `20-24`,
    preferredFood: `Fuit,Veg`,
    controlSlots: 3,
    specials: `STUN: on a successful hit, adjacent opponents are paralyzed. No RESIST.   - MACE: attacks are considered mace for durability checks. -  MOUNT (3): can be ridden if tamed`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 78,
    name: `British Knight`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: `100`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `14-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: ` MORTAL STRIKE: Target cannot heal for 5 rounds - PARALYZING BLOW - Attack Does no Damage. - PARRY: 30%  -  BANDAGE: trigger in delay phase of round 6, cure 120% or Heal d20+40 hp. - SWORDS: damage purposes -  WRESTLER: replace damage with d4+10 if disarmed. Automatically Rearm at end of turn. - ARTILLERYMAN: 1 knight reloads a cannon as two. May move cannons alone.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 79,
    name: `British Archer`,
    hoverStats: `Resist: 2
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: `100`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `10-18`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: ` MORTAL STRIKE: Target cannot heal for 5 rounds - PARALYZING BLOW: A successful Paralyzing Blow will leave the target stunned, unable to move, attack, or cast spells, for a 3 rounds. The duration is broken by combat damage in the same way as paralyze spell. Attack Does no Damage. - BANDAGE: trigger in delay phase of round 6, cure 120% or Heal d20+40 hp.- ARCHERY: range 10, damage purposes`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 80,
    name: `Drake`,
    hoverStats: `Resist: 3
Slayer: Dragon, Reptile
Karma/Fame: Level 4
Bard Diff: 80
Tame Diff: 32,0,0,0
Pack instinct: None
Control Slots: 2
Food Pref: Meat`,
    karma: `4`,
    gold: `275-325`,
    alignment: `Evil`,
    hp: `241-251`,
    bard: `80`,
    taming: `32,0,0,0`,
    resistF: `50-60`,
    resistC: `40-50`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `45-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `65-90`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `401-430`,
    dexterity: `101-140`,
    intelligence: `101-140`,
    baseDmg: `11-17`,
    preferredFood: `Meat`,
    controlSlots: 2,
    specials: `ARMORED - CRUSHING: Melee attacks cause -20% to durability check on armored locations`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: 2
  },
  {
    id: 81,
    name: `Elite Ninja`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `Evil`,
    hp: `250-350`,
    bard: ``,
    taming: `na`,
    resistF: `45-65`,
    resistC: `25-45`,
    resistP: `40-60`,
    resistE: `40-65`,
    resistPh: `35-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `115-130`,
    resistSpell: `3-4`,
    anatomy: `115-130`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `14-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `Hide/stealth(lv4): via smoke bomb   Shadow Strike: +50% damage and attacker is hidden.  Defense Mastery: DCI 15  Mirror Image: images dispelled upon hiding    Slicing: Swords and Fencing for purpose of durablity.  Mortal Strike: Target cannot heal for 5 r`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 82,
    name: `Fan Dancer`,
    hoverStats: `Resist: 3
Slayer: Deamon
Karma/Fame: Level 4
Bard Diff: 97
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `700-1000`,
    alignment: `Evil`,
    hp: `350-420`,
    bard: `97`,
    taming: `na`,
    resistF: `50-70`,
    resistC: `50-70`,
    resistP: `50-70`,
    resistE: `40-60`,
    resistPh: `40-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 4,
    tactics: `70-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `315-375`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `10-20`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `FAN FLAMES: double fire damage of all allies in LOS -  Deflect Damage: 40% chance to deflect half damage taken back on attacker regardless of type. - SLICING: Swords and Fencing for purpose of durablity. - MORTAL STRIKE: Target cannot heal for 5 rounds - PET SLAYER: Double damage to Pets and add one aggravation token to pet for each successful hit.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 83,
    name: `Flesh Golem`,
    hoverStats: `Resist: 2
Slayer: undead
Karma/Fame: Level 2
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `106-120`,
    bard: ``,
    taming: `na`,
    resistF: `25-35`,
    resistC: `15-25`,
    resistP: `60-70`,
    resistE: `30-40`,
    resistPh: `50-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `176-200`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `18-22`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `PUTRID: Pets will never attack this creature. -BARD IMMUNITY -.  WRETCH: successful melee hits against this creature, lowers the attackers hunger track 1 step. -  BLEED: hit character takes an additional 6 direct damage during the delay phase for 5 rounds`,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 84,
    name: `Frost Giant`,
    hoverStats: `Resist: 5
Slayer: Ogre, Repond, Ice
Karma/Fame: Level 5
Bard Diff: 89
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: Fuit,Veg`,
    karma: `5`,
    gold: `750-950`,
    alignment: `Evil`,
    hp: `476-552`,
    bard: `89`,
    taming: `na`,
    resistF: ``,
    resistC: `60-70`,
    resistP: `100`,
    resistE: `40-50`,
    resistPh: `45-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `90-100`,
    resistSpell: `5-6`,
    anatomy: `95-104`,
    strength: `767-945`,
    dexterity: `56-75`,
    intelligence: `66-70`,
    baseDmg: `20-25`,
    preferredFood: `Fuit,Veg`,
    controlSlots: 0,
    specials: `FREEZE: on a successful hit, adjacent opponents are paralyzed. RESISTABLE. -  FENCING/SWORDS: attacks are considered Fencing or Swords for durability`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 85,
    name: `Chaos Dragoon`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level 4
Bard Diff: 103
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `400-500`,
    alignment: `Evil`,
    hp: `276-350`,
    bard: `103`,
    taming: `na`,
    resistF: `15-25`,
    resistC: `50`,
    resistP: `25-35`,
    resistE: `25-35`,
    resistPh: `45-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `120`,
    resistSpell: `2-3`,
    anatomy: `120`,
    strength: `276-350`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `24-26`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CHARGE: Attack combined with full move in straight line, will attack at anypoint in move while adjacent and continue past target. Does not draw attacks of opportunity.  - MOUNTED: All moves are 4 while mounted. If dismounted or killed, must fight its mounted swamp dragon. Replace Charge with Melee if dismounted -  UNSHAKABLE(50): 50% chance to avoid a dismount attempt against it`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 86,
    name: `Frost Ooze`,
    hoverStats: `Resist: 6
Slayer: Ice
Karma/Fame: Level 2
Bard Diff: 15
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `100-300`,
    alignment: `Evil`,
    hp: `65-125`,
    bard: `15`,
    taming: `na`,
    resistF: ``,
    resistC: `40-50`,
    resistP: `20-30`,
    resistE: `10-20`,
    resistPh: `10-20`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 1,
    tactics: ``,
    resistSpell: `5-6`,
    anatomy: ``,
    strength: `18-30`,
    dexterity: `56-75`,
    intelligence: `66-70`,
    baseDmg: `3-9`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `TOXIC: Hits by and against this creature cause a durability check at -30%  -  REFLECTIVE(75%): Spells that target Ooze have 75% chance of targeting caster instead.-  DISPEL(85%)(Interrupt) -  DETECT HIDDEN(interrupt) 85%: Reveal a hidden target in LOS, replace current action until revealed`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 87,
    name: `Hellsteed`,
    hoverStats: `Resist: 5
Slayer: undead
Karma/Fame: Level 0
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: 
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Evil`,
    hp: `201-220`,
    bard: ``,
    taming: `na`,
    resistF: `90`,
    resistC: ``,
    resistP: `100`,
    resistE: ``,
    resistPh: `60-70`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50`,
    resistSpell: `5`,
    anatomy: ``,
    strength: `201-210`,
    dexterity: `101-110`,
    intelligence: `101-115`,
    baseDmg: `20-24`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY (5), BARD IMMUNITY`,
    animate: true,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: 4
  },
  {
    id: 88,
    name: `Ice Fiend`,
    hoverStats: `Resist: 2
Slayer: Demon
Karma/Fame: Level 5
Bard Diff: 90
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `650-800`,
    alignment: `Evil`,
    hp: `243-500`,
    bard: `90`,
    taming: `na`,
    resistF: `10-20`,
    resistC: `90-120`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `55-65`,
    magery: `60-70`,
    evalInt: `60-70`,
    aggroPriority: 3,
    tactics: `100`,
    resistSpell: `2`,
    anatomy: `120`,
    strength: `225-400`,
    dexterity: `96-120`,
    intelligence: `186-210`,
    baseDmg: `8-19`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SWORDS: Melee attacks are swords for purpose of Durability Checks. - DISPEL(85%): if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING(90%): if poisoned. Monster will replace next action with a cure attempt. - POISON IMMUNITY(3) - DETECT HIDDEN(interrupt) 85%: Reveal a hidden target in LOS, replace current action until revealed - COLD AURA: Deal melee damage to all targets w/in 6 tiles of Fiend`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 89,
    name: `Korpre`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 1
Bard Diff: 60
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `1`,
    gold: ``,
    alignment: `Evil`,
    hp: `58`,
    bard: `60`,
    taming: `na`,
    resistF: `35`,
    resistC: `5`,
    resistP: `100`,
    resistE: `1`,
    resistPh: `45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `15`,
    resistSpell: ``,
    anatomy: `15`,
    strength: `26`,
    dexterity: `19`,
    intelligence: `17`,
    baseDmg: `1-5`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SPLIT(15): if reduced to listed hp amount and not slain, creature fully heals and clones itself. -  COMBINE: if 4 or more Korpre are on the same combat map, remove 3 and  spawn a single Void Elemental on a random opponent. -  CHAOS DAMAGE TYPE: d6, 5-6 energy`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 90,
    name: `Minax Rider`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: `100`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `18-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CONCUSSION BLOW- automatically strikes head location. Reduce targets mana by 30. - DISARM - Target disarms current weapon, may not rearm that weapon this turn. - PARRY:30% -   BANDAGE: trigger in delay phase of round 6, cure 120% or Heal d20+40 hp. MACES: damage purposes - DIRE WOLF MOUNT: if dismounted or slain, mount will attack. Riders Movement now 2 - WRESTLER: replace damage with d4+10 if disarmed. Automatically Rearm at end of turn.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 91,
    name: `Minax Mariner`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: `100`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `18-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CONCUSSION BLOW: automatically strikes head location. Reduce targets mana by 30.  - DISARM: Target disarms current weapon, may not rearm that weapon this turn. - PARRY:30% -    BANDAGE: trigger in delay phase of round 6, cure 120% or Heal d20+40 hp. - FENCING: damage purposes - WRESTLER: replace damage with d4+10 if disarmed. Automatically Rearm at end of turn. - MOVE(2): Movement of 2 while on land`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 92,
    name: `Minax Marine (Officer)`,
    hoverStats: `Resist: 2
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `900-1200`,
    alignment: `War Status`,
    hp: `225-350`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `45-65`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `45-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: `100`,
    strength: `200-250`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `20-25`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: ` CRUSHINGBLOW: -30 Stamina/ -40% Durability. -  PARRY:30% - BANDAGE: trigger in delay phase of round 6, cure 120% or Heal d20+40 hp.-  FENCING: damage purposes -  WRESTLER: replace damage with d4+10 if disarmed. Automatically Rearm at end of turn. - DISPEL (75%)`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 93,
    name: `Mind Flayer`,
    hoverStats: `Resist: 4
Slayer: mage
Karma/Fame: Level 5
Bard Diff: 72
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `125-150`,
    alignment: `Evil`,
    hp: `300-500`,
    bard: `72`,
    taming: `na`,
    resistF: `20-30`,
    resistC: `20-30`,
    resistP: `20-30`,
    resistE: `20-30`,
    resistPh: `20-30`,
    magery: `110-150`,
    evalInt: `100-130`,
    aggroPriority: 4,
    tactics: `45-60`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `76-100`,
    dexterity: `96-120`,
    intelligence: `500-800`,
    baseDmg: `3-7`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `DISPEL(85%)(Interrupt): if an opponent summoned a creature, monster will cast dispel on creature in place of its next action until creature is dispelled. - CURING(80%)(interrupt): if poisoned. Monster will replace next action with a cure attempt. - POISON IMMUNITY (2) -  CHARM: Priority Target will make next attack against random party member. Priorty 1 are party's Highest control slot Pet. `,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 94,
    name: `Minion-Horde Minion`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 1
Bard Diff: NA
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `1`,
    gold: ``,
    alignment: `Evil`,
    hp: `58-72`,
    bard: ``,
    taming: `na`,
    resistF: `50`,
    resistC: ``,
    resistP: `25`,
    resistE: `25`,
    resistPh: `50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `75`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `9-13`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `GATHER LOOT: Minion will gather loot from kills for the party.  Acts Before Party. Caster decides what the Minion Leaves for the group.  Inventory: Can hold up to 10 Card Items in its inventory for caster, like a pack animal`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 95,
    name: `Minion-Shadow Wisp`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: 
Bard Diff: NA
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `none`,
    hp: `10-24`,
    bard: ``,
    taming: `na`,
    resistF: `10-15`,
    resistC: `10-15`,
    resistP: `10-15`,
    resistE: `95-100`,
    resistPh: `10-15`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `16-40`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `2-5`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `DARK ENERGY: 30% chance per delay phase of giving mana to a caster and casters party members with negative Karma. Mana returned = negative karma x 2`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 96,
    name: `Minion-Vampire Bat`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: 
Bard Diff: NA
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `none`,
    hp: `75-90`,
    bard: ``,
    taming: `na`,
    resistF: `10-15`,
    resistC: `10-15`,
    resistP: `10-15`,
    resistE: `95-100`,
    resistPh: `10-15`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `16-40`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `4-14`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `BLOOD DRINK: All damage points dealt by bat are gained as life by the caster.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 97,
    name: `Minion-Dark Wolf`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: 
Bard Diff: NA
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `none`,
    hp: `50-70`,
    bard: ``,
    taming: `na`,
    resistF: `25-40`,
    resistC: `25-40`,
    resistP: `25-40`,
    resistE: `25-40`,
    resistPh: `40-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `40`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `10-20`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `STAMINA REGEN (15): Caster gains +15 stamina regen - WOLF MASTERY: May tame and then command any wolf, including Dire and Bake Kitsune at 100% success. Tamed do not require food and remain wild, cannot be stabled.  If caster has Taming and Animal Lore, pets remain tame even when Dark Wolf is dispelled`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 98,
    name: `Minion-Death Adder`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: 
Bard Diff: NA
Tame Diff: na
Pack instinct: None
Control Slots: 1
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `none`,
    hp: `50-70`,
    bard: ``,
    taming: `na`,
    resistF: ``,
    resistC: ``,
    resistP: `95-100`,
    resistE: ``,
    resistPh: `10`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `40`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `1-3`,
    preferredFood: `0`,
    controlSlots: 1,
    specials: `SNAKE PROVOCATION: Caster may use Provacation as a Lev 4 Bard (Musicianship+Provocation) vs Snakes`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 99,
    name: `Moon Wolf`,
    hoverStats: `Resist: 2
Slayer: Demon
Karma/Fame: Level 4
Bard Diff: 77
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `976-1056`,
    alignment: `Evil`,
    hp: `380-440`,
    bard: `77`,
    taming: `na`,
    resistF: `50-70`,
    resistC: `50-70`,
    resistP: `50-70`,
    resistE: `50-70`,
    resistPh: `40-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100-110`,
    resistSpell: `2-3`,
    anatomy: `100-110`,
    strength: `400-450`,
    dexterity: `150-200`,
    intelligence: `16-40`,
    baseDmg: `15-22`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SHIFTER: monster reflects 100% damage of a random type each hit. d6 1=Physical, 2=fire, 3=Cold, 4=Poison, 5=Energy, 6=none    - CLAWS: damage is considered fencing for durability`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 100,
    name: `Mound of Maggots`,
    hoverStats: `Resist: 0
Slayer: undead
Karma/Fame: Level 1
Bard Diff: NA
Tame Diff: NA
Pack instinct: None
Control Slots: 1
Food Pref: Chicken`,
    karma: `1`,
    gold: ``,
    alignment: `Evil`,
    hp: `60-70`,
    bard: ``,
    taming: `NA`,
    resistF: ``,
    resistC: ``,
    resistP: `100`,
    resistE: ``,
    resistPh: `90`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50`,
    resistSpell: ``,
    anatomy: ``,
    strength: `61-70`,
    dexterity: `61-70`,
    intelligence: `10`,
    baseDmg: `3-5`,
    preferredFood: `Chicken`,
    controlSlots: 1,
    specials: ``,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 101,
    name: `Agate Elemental`,
    hoverStats: `Resist: 0
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-153`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(4) - GAS ATTACK: 30% chance of 30 direct damage, AOE 5 tiles upon successfully striking monster`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 102,
    name: `Shadow Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-153`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(4) - PET/SPELL IMMUNITY.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 103,
    name: `Violite Elemental`,
    hoverStats: `Resist: 4
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-153`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(4) - REFLECTIVE: 50% chance of reflecting any damage taken to attacker. `,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 104,
    name: `Ice Elemental`,
    hoverStats: `Resist: 1
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-153`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(4) - SHATTER:  Explode on death 50 Cold damge, AOE 5 tiles`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 105,
    name: `White Wyrm`,
    hoverStats: `Resist: 4
Slayer: Dragon, Reptile
Karma/Fame: Level 5
Bard Diff: 108
Tame Diff: 8,0,0,0
Pack instinct: None
Control Slots: 4
Food Pref: 25 gold= 4 `,
    karma: `5`,
    gold: `1200-1400`,
    alignment: `Evil`,
    hp: `433-456`,
    bard: `108`,
    taming: `8,0,0,0`,
    resistF: `10-25`,
    resistC: `80-90`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `55-70`,
    magery: `100-120`,
    evalInt: `100-120`,
    aggroPriority: 4,
    tactics: `98-100`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `721-760`,
    dexterity: `101-140`,
    intelligence: `386-425`,
    baseDmg: `11-17`,
    preferredFood: `25 gold= 4 `,
    controlSlots: 4,
    specials: `ARMORED - CURING(90%) (interrupt) -  Dispel(85%): (interrupt) - SOUL SIPHON: drain Mana and Stamina equal to listed amount from all characters in line of breath attack.  Add total amount drained to Wyrms lost HP - DCI 15`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: 5
  },
  {
    id: 106,
    name: `Gold Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-353`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(4) - GAS ATTACK: 30% chance of 30 direct damage to 5 tiles upon successfully striking monster LUCKY: parry 40% `,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 107,
    name: `Verite Elemental`,
    hoverStats: `Resist: 0
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-353`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED(-40%) - POISON IMMUNITY(4) - CRUSHING: locations struck by monster make durability checks at  -40%`,
    animate: false,
    packInstinct: ``,
    damageType: 2,
    breathDmgType: null
  },
  {
    id: 108,
    name: `Valorite Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: Level 3
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `30-1000`,
    alignment: `Evil`,
    hp: `136-353`,
    bard: ``,
    taming: `na`,
    resistF: `30-100`,
    resistC: `30-100`,
    resistP: `30-100`,
    resistE: `30-100`,
    resistPh: `30-100`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: ``,
    anatomy: ``,
    strength: `176-450`,
    dexterity: `56-75`,
    intelligence: `46-70`,
    baseDmg: `15-32`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - POISON IMMUNITY(5) -  REFLECTIVE= 50% chance of reflecting any damage taken to attacker - PET/SPELL IMMUNITY - BARD IMMUNITY - DCI 20`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 109,
    name: `Patchwork Skeleton`,
    hoverStats: `Resist: 4
Slayer: undead
Karma/Fame: Level 1
Bard Diff: 60
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `1`,
    gold: `58-72`,
    alignment: `Evil`,
    hp: `34-48`,
    bard: `60`,
    taming: `na`,
    resistF: `50-60`,
    resistC: `70-80`,
    resistP: `100`,
    resistE: `40-50`,
    resistPh: `55-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `96-120`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `10-14`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: ``,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 110,
    name: `Quickling`,
    hoverStats: `Resist: 4
Slayer: Fey
Karma/Fame: Level 3
Bard Diff: 93
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `3`,
    gold: `200-250`,
    alignment: `Evil`,
    hp: `120-160`,
    bard: `93`,
    taming: `na`,
    resistF: `50-60`,
    resistC: `15-25`,
    resistP: `20-50`,
    resistE: `65-75`,
    resistPh: `55-65`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 3,
    tactics: `110`,
    resistSpell: `3-4`,
    anatomy: `100`,
    strength: `120-140`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `10-14`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `PESTER: Successful hits against a pet add 1 aggravation token. - SPOIL: on a successful hit, discard all food items from targets inventory. - FLEE: if not adjacent to an opponent and below 60 hp, replace monsters actions with a full move toward map edge.`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 111,
    name: `Raptor`,
    hoverStats: `Resist: 3
Slayer: Reptile
Karma/Fame: Level 4
Bard Diff: 86
Tame Diff: 4,0,0,0
Pack instinct: Raptor
Control Slots: 2
Food Pref: Fish`,
    karma: `4`,
    gold: `449`,
    alignment: `Evil`,
    hp: `342-400`,
    bard: `86`,
    taming: `4,0,0,0`,
    resistF: `50-60`,
    resistC: `40-50`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `45-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `75-100`,
    resistSpell: `3`,
    anatomy: ``,
    strength: `401-464`,
    dexterity: `81-105`,
    intelligence: `36-60`,
    baseDmg: `11-17`,
    preferredFood: `Fish`,
    controlSlots: 2,
    specials: `PACK INSTINCT : (Raptor) damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map. -  SHRIEK: spawn an additional 1d2 Raptors around priority target. Max 6 (Pets do not shriek) -  BLEED`,
    animate: false,
    packInstinct: `Raptor`,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 112,
    name: `Ronin`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `Evil`,
    hp: `250-350`,
    bard: ``,
    taming: `na`,
    resistF: `45-65`,
    resistC: `25-45`,
    resistP: `40-60`,
    resistE: `40-65`,
    resistPh: `55-70`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `115-130`,
    resistSpell: `3-4`,
    anatomy: `115-130`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `20-25`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMORED - SWORDS: Swords for purpose of durablity. - PARRY: (40): percent chance to parry melee, ranged and spell attacks that target this creature. -  COUNTERATTACK: (interrupt) melee attack against a parried attacker`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 113,
    name: `Sabretooth Tiger`,
    hoverStats: `Resist: 3
Slayer: none
Karma/Fame: Level 4
Bard Diff: 73
Tame Diff: 25,10,0,0
Pack instinct: none
Control Slots: 2
Food Pref: meat`,
    karma: `4`,
    gold: `200-400`,
    alignment: `Evil`,
    hp: `362-423`,
    bard: `70-80`,
    taming: `25,10,0,0`,
    resistF: `31-40`,
    resistC: `50-64`,
    resistP: `26-34`,
    resistE: `38-45`,
    resistPh: `48-65`,
    magery: `80-90`,
    evalInt: `80-90`,
    aggroPriority: 2,
    tactics: `110`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `496-523`,
    dexterity: `125-145`,
    intelligence: `375-425`,
    baseDmg: `21-28`,
    preferredFood: `meat`,
    controlSlots: 2,
    specials: `DETECT HIDDEN (90%) LOS: If hidden opponent is in LOS of Tiger, Roll % as its action to reveal`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 114,
    name: `Scorpion`,
    hoverStats: `Resist: 1
Slayer: Arachnid, Scorpion
Karma/Fame: Level 1
Bard Diff: 66
Tame Diff: 100,56,6,0
Pack instinct: None
Control Slots: 1
Food Pref: Meat`,
    karma: `1`,
    gold: `57-65`,
    alignment: `Evil`,
    hp: `50-63`,
    bard: `66`,
    taming: `100,56,6,0`,
    resistF: `10-15`,
    resistC: `20-25`,
    resistP: `40-50`,
    resistE: `10-15`,
    resistPh: `20-25`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-75`,
    resistSpell: `1`,
    anatomy: ``,
    strength: `73-115`,
    dexterity: `76-95`,
    intelligence: `10-30`,
    baseDmg: `5-10`,
    preferredFood: `Meat`,
    controlSlots: 1,
    specials: `PACK INSTINCT: damage bonus of melee and special attacks based upon the number of other monsters of the same type on combat map`,
    animate: false,
    packInstinct: `Scorpion`,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 115,
    name: `Shadowlord Assassin`,
    hoverStats: `Resist: 4
Slayer: none
Karma/Fame: Level 4
Bard Diff: na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `750-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: ``,
    taming: `na`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: `100`,
    strength: `125-175`,
    dexterity: `56-75`,
    intelligence: `85-105`,
    baseDmg: `14-23`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ARMOR IGNORE - ignore damage reduction of targeted location -INFECTIOUS STRIKE - Deadly Poison -30 Cure. -  PARRY:30% - FENCING: damage purposes  POISONER: 40% Lethal Poison -35 cure, otherwise Deadly - DETECT HIDDEN(80%) LOS -  WRESTLER: replace damage with d4+10 if disarmed. Automatically Rearm at end of turn.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 116,
    name: `Shadowlord Bomber`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 4
Bard Diff: 70
Tame Diff: 
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `600-900`,
    alignment: `War Status`,
    hp: `100-150`,
    bard: `70`,
    taming: `0`,
    resistF: `20-50`,
    resistC: `20-50`,
    resistP: `20-50`,
    resistE: `20-50`,
    resistPh: `20-50`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `100`,
    resistSpell: ``,
    anatomy: ``,
    strength: `100-150`,
    dexterity: `76-95`,
    intelligence: `36-60`,
    baseDmg: `8-15`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `CRUSHING BLOW: reduce targets stamina by 30. -40% to durability check this hit.- CONFLAG BOMB: d8+14 3 tiles, 2 turn - CURE POTION: 85% (Interrupt) replace action if unsuccessful. - GREATER HEAL POTION: d6+20 at end of turn. - PARRY: 30% all attacks and spells. - MACES: damage purposes - REARM: will rearm at end of turn if disarmed.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 117,
    name: `Silver Serpent`,
    hoverStats: `Resist: 4
Slayer: Reptile, Snake
Karma/Fame: Level 4
Bard Diff: 80
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `250-300`,
    alignment: `Evil`,
    hp: `97-216`,
    bard: `80`,
    taming: `na`,
    resistF: `5-10`,
    resistC: `5-10`,
    resistP: `100`,
    resistE: `5-10`,
    resistPh: `35-45`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `80-95`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `161-360`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `5-21`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `HYPNOSIS: Ranged attacks against this creature have 40% of targeting a random Party member or Pet`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 118,
    name: `Skeletal Steed`,
    hoverStats: `Resist: 4
Slayer: undead
Karma/Fame: Level 0
Bard Diff: 49
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Evil`,
    hp: `41-50`,
    bard: `49`,
    taming: `na`,
    resistF: ``,
    resistC: `90-95`,
    resistP: `100`,
    resistE: `10-15`,
    resistPh: `50-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `50`,
    resistSpell: `4`,
    anatomy: ``,
    strength: `91-100`,
    dexterity: `56-75`,
    intelligence: `46-60`,
    baseDmg: `5-12`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `POISON IMMUNITY(5)`,
    animate: true,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 119,
    name: `Snow Elemental`,
    hoverStats: `Resist: 1
Slayer: Elemental, Ice, Snow
Karma/Fame: Level 4
Bard Diff: 78
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `250-350`,
    alignment: `Evil`,
    hp: `196-213`,
    bard: `78`,
    taming: `na`,
    resistF: `10-15`,
    resistC: `60-70`,
    resistP: `25-35`,
    resistE: `25-35`,
    resistPh: `44-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `120`,
    resistSpell: `1`,
    anatomy: `120`,
    strength: `196-213`,
    dexterity: `96-145`,
    intelligence: `71-95`,
    baseDmg: `11-17`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ABSORB: Swords,Fencing,Ranged : Half Damage -  AURA OF COLD: Characters adjacent to Snow Elemental suffer 20 cold damage during delay phase.`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 120,
    name: `(Sum) Stone Titan`,
    hoverStats: `Resist: 
Slayer: 
Karma/Fame: 
Bard Diff: 111.3
Tame Diff: 
Pack instinct: None
Control Slots: 5
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `0`,
    hp: `391`,
    bard: `111.3`,
    taming: `0`,
    resistF: `44`,
    resistC: `44`,
    resistP: `83`,
    resistE: `57`,
    resistPh: `56`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 0,
    tactics: ``,
    resistSpell: ``,
    anatomy: ``,
    strength: `650`,
    dexterity: `180`,
    intelligence: `200`,
    baseDmg: `16-20`,
    preferredFood: `0`,
    controlSlots: 5,
    specials: `AGGRO: 1:Closest opponent, 2: highest aggro or intel`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 121,
    name: `Terathan Queen`,
    hoverStats: `Resist: 5
Slayer: Arachnid, Terathan
Karma/Fame: Level 5
Bard Diff: Na
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `1000-1500`,
    alignment: `Evil`,
    hp: `600-850`,
    bard: ``,
    taming: `na`,
    resistF: `55-65`,
    resistC: `35-45`,
    resistP: `90-100`,
    resistE: `55-65`,
    resistPh: `65-75`,
    magery: `100-150`,
    evalInt: `100-150`,
    aggroPriority: 4,
    tactics: `80-95`,
    resistSpell: `5`,
    anatomy: ``,
    strength: `200-225`,
    dexterity: `56-75`,
    intelligence: `450-650`,
    baseDmg: `18-22`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ACID BLAST: upon death, all opponents within 3 tiles take 2d20 poison damage, and all armor and equipped weapons must make durabilty check at -30%. Pets take double damage. -  ARMORED - BIRTH: 1-50% Spawn 1d4 Terathan warrior, 51-100% 1d2 Avengers.- CURING/DISPEL: (interrupt) any Terrathans/summons in LOS. - MAJESTIC: opponents who target Queen become Aggro priority 1 to all Terathan til death.`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 122,
    name: `Swamp Dragon`,
    hoverStats: `Resist: 0
Slayer: none
Karma/Fame: Level 2
Bard Diff: 59
Tame Diff: 12,0,0,0
Pack instinct: none
Control Slots: 2
Food Pref: meat`,
    karma: `2`,
    gold: ``,
    alignment: `Evil`,
    hp: `121-180`,
    bard: `59`,
    taming: `12,0,0,0`,
    resistF: `20-30`,
    resistC: `20-30`,
    resistP: `20-30`,
    resistE: `30-40`,
    resistPh: `35-40`,
    magery: `80-90`,
    evalInt: `80-90`,
    aggroPriority: 2,
    tactics: `70-90`,
    resistSpell: ``,
    anatomy: ``,
    strength: `201-300`,
    dexterity: `125-145`,
    intelligence: `375-425`,
    baseDmg: `7-9`,
    preferredFood: `meat`,
    controlSlots: 2,
    specials: `MOUNT(4): Rideable once tamed. - SHIELDING: randomly distribute 15 points to all resists, per crafting rules. While mounted, add these resists to the rider. Generated upon taming`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 123,
    name: `Terathan Warrior`,
    hoverStats: `Resist: 2
Slayer: Arachnid, Terathan
Karma/Fame: Level 2
Bard Diff: 70
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `125-175`,
    alignment: `Evil`,
    hp: `100-129`,
    bard: `70`,
    taming: `na`,
    resistF: `20-30`,
    resistC: `25-35`,
    resistP: `30-40`,
    resistE: `25-35`,
    resistPh: `30-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `80-100`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `166-215`,
    dexterity: `96-145`,
    intelligence: `41-65`,
    baseDmg: `7-17`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `ACID BLAST: upon death, all opponents within 3 tiles take 2d20 poison damage, and all armor and equipped weapons must make durabilty check at -30%. Pets take double damage.(Terathan's Immune) -  ARMORED`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  },
  {
    id: 124,
    name: `Wailing Banshee`,
    hoverStats: `Resist: 3
Slayer: undead
Karma/Fame: Level 2
Bard Diff: 60
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `34-48`,
    bard: `60`,
    taming: `na`,
    resistF: `25-30`,
    resistC: `70-80`,
    resistP: `70-80`,
    resistE: `40-50`,
    resistPh: `50-60`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `55-80`,
    resistSpell: `3-4`,
    anatomy: ``,
    strength: `96-120`,
    dexterity: `56-75`,
    intelligence: `16-40`,
    baseDmg: `10-14`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `LIFE CURSE(curse): target cannot heal damage.  Remains in effect until  4 turns after last banshee is slain`,
    animate: true,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: null
  },
  {
    id: 125,
    name: `Wraith`,
    hoverStats: `Resist: 2
Slayer: Undead
Karma/Fame: Level 2
Bard Diff: 68
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `46-60`,
    bard: `68`,
    taming: `na`,
    resistF: ``,
    resistC: `15-25`,
    resistP: `10-20`,
    resistE: ``,
    resistPh: `25-30`,
    magery: `60-70`,
    evalInt: `60-70`,
    aggroPriority: 2,
    tactics: `45-60`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `76-100`,
    dexterity: `96-120`,
    intelligence: `36-60`,
    baseDmg: `7-11`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `INCORPOREAL: DCI 25 -  Poison Immunity (2)`,
    animate: true,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: null
  },
  {
    id: 126,
    name: `Void Elemental`,
    hoverStats: `Resist: 2
Slayer: Elemental
Karma/Fame: Level 5
Bard Diff: 150
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `800-2000`,
    alignment: `Evil`,
    hp: `2500-2650`,
    bard: `150`,
    taming: `na`,
    resistF: `55-65`,
    resistC: `55-65`,
    resistP: `100`,
    resistE: `65-75`,
    resistPh: `65-75`,
    magery: `60-73`,
    evalInt: `60-75`,
    aggroPriority: 2,
    tactics: `60-75`,
    resistSpell: `2`,
    anatomy: ``,
    strength: `376-403`,
    dexterity: `183-230`,
    intelligence: `164-213`,
    baseDmg: `15-17`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `SWORDS: Melee attacks are swords for purpose of Durability Checks.- CONSUME: corpses of fallen opponents are consumed and replaced with a void orb. All loot is lost. -   TELEPORT: if creature cannot end movement adjacent to an opponent after a move action, creature will teleport up to 10 spaces, adjacent to furthest opponent in range.`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 127,
    name: `Deep Sea Serpent`,
    hoverStats: `Resist: 2
Slayer: Snake, Reptile
Karma/Fame: Level 4
Bard Diff: 77
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `4`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `225-300`,
    bard: `77`,
    taming: `na`,
    resistF: `70-80`,
    resistC: `40-50`,
    resistP: `30-40`,
    resistE: `15-20`,
    resistPh: `30-40`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-70`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `251-425`,
    dexterity: `58-85`,
    intelligence: `58-85`,
    baseDmg: `7-14`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `REACH(4): Creature can make melee attacks against enemies up to 4 tiles away. - DIVE(20): Creature at listed hp or less during action phase will end combat and flee. No attacks of opportunity. Remove creature from combat board`,
    animate: false,
    packInstinct: ``,
    damageType: 3,
    breathDmgType: 2
  },
  {
    id: 128,
    name: `Fairy Dragon`,
    hoverStats: `Resist: 5
Slayer: Dragon, Reptile
Karma/Fame: Level -5
Bard Diff: 110
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: fish`,
    karma: `0`,
    gold: `1500-1750`,
    alignment: `Good`,
    hp: `393-409`,
    bard: `110`,
    taming: `na`,
    resistF: `42-48`,
    resistC: `43-50`,
    resistP: `43-50`,
    resistE: `40-46`,
    resistPh: `18-29`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `94-98`,
    resistSpell: `5`,
    anatomy: `94-98`,
    strength: `506-561`,
    dexterity: `226-245`,
    intelligence: `401-580`,
    baseDmg: `15-20`,
    preferredFood: `fish`,
    controlSlots: 0,
    specials: `CHARGE: Full move 4 and Melee attack, continue past target - HEAL: self target, if full hp, will target closest injured ally. Can Heal Invisible Allies - BLINK: creature becomes invisible and relocates to a new tile based off its current facing (d8 facing, d6 distance).  If AOE attacked, roll location dice to see if the assigned area is rolled, if not, creature stays invisible and undamaged. Place hidden marker on creatures location.  -  Next time creature takes an action, roll location dice to determine its starting location prior. - CHAOS DAMAGE (D4): no physical damage`,
    animate: false,
    packInstinct: ``,
    damageType: 7,
    breathDmgType: null
  },
  {
    id: 129,
    name: `Kraken`,
    hoverStats: `Resist: 3
Slayer: Snake, Reptile
Karma/Fame: Level 5
Bard Diff: 81
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `5`,
    gold: `400-600`,
    alignment: `Evil`,
    hp: `454-568`,
    bard: `81`,
    taming: `na`,
    resistF: `30-40`,
    resistC: `30-40`,
    resistP: `20-30`,
    resistE: `10-20`,
    resistPh: `45-55`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-70`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `756-780`,
    dexterity: `226-245`,
    intelligence: `58-85`,
    baseDmg: `19-33`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `REACH(6): Creature can make melee attacks against enemies up to 6 tiles away. - DIVE(30): Creature at listed hp or less during action phase will end combat and flee. No attacks of opportunity. Remove from combat board - AMBIDEXTROUS(8): Melee attacks can target up to 8 enemies in within reach.`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 4
  },
  {
    id: 130,
    name: `Sea Serpent`,
    hoverStats: `Resist: 2
Slayer: Snake, Reptile
Karma/Fame: Level 2
Bard Diff: 73
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `2`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `110-127`,
    bard: `73`,
    taming: `na`,
    resistF: `50-60`,
    resistC: `30-40`,
    resistP: `30-40`,
    resistE: `15-20`,
    resistPh: `25-35`,
    magery: ``,
    evalInt: ``,
    aggroPriority: 2,
    tactics: `60-70`,
    resistSpell: `2-3`,
    anatomy: ``,
    strength: `168-225`,
    dexterity: `58-85`,
    intelligence: `58-85`,
    baseDmg: `7-13`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `REACH(2): Creature can make melee attacks against enemies up to 2 tiles away`,
    animate: false,
    packInstinct: ``,
    damageType: 1,
    breathDmgType: 3
  },
  {
    id: 131,
    name: `(Sum) Pixie`,
    hoverStats: `Resist: 6
Slayer: fey
Karma/Fame: Karma -2
Bard Diff: 84
Tame Diff: na
Pack instinct: None
Control Slots: na
Food Pref: `,
    karma: `0`,
    gold: ``,
    alignment: `Good`,
    hp: `15-20`,
    bard: `84`,
    taming: `na`,
    resistF: `40-50`,
    resistC: `40-50`,
    resistP: `40-50`,
    resistE: `40-50`,
    resistPh: `80-90`,
    magery: `90-100`,
    evalInt: `90-100`,
    aggroPriority: 3,
    tactics: `10-20`,
    resistSpell: `4-6`,
    anatomy: ``,
    strength: `21-30`,
    dexterity: `300-400`,
    intelligence: `200-250`,
    baseDmg: `9-15`,
    preferredFood: `0`,
    controlSlots: 0,
    specials: `Pixie Dust: target reduces sleep track 8 steps. RESISTABLE Invisibility: DCI 20`,
    animate: false,
    packInstinct: ``,
    damageType: 5,
    breathDmgType: null
  },
  {
    id: 132,
    name: `(Sum) Imp`,
    hoverStats: `Resist: 2
Slayer: Deamon
Karma/Fame: Karma 2
Bard Diff: 65
Tame Diff: 34,0,0,0
Pack instinct: None
Control Slots: 1
Food Pref: meat`,
    karma: `2`,
    gold: `50-100`,
    alignment: `Evil`,
    hp: `20-30`,
    bard: `65`,
    taming: `34,0,0,0`,
    resistF: `40-50`,
    resistC: `20-30`,
    resistP: `30-40`,
    resistE: `30-40`,
    resistPh: `25-35`,
    magery: `90-100`,
    evalInt: `20-30`,
    aggroPriority: 3,
    tactics: `42-50`,
    resistSpell: `1-2`,
    anatomy: ``,
    strength: `91-115`,
    dexterity: `61-80`,
    intelligence: `86-105`,
    baseDmg: `10-14`,
    preferredFood: `meat`,
    controlSlots: 1,
    specials: `Hunger Pains*: target reduces Hunger track 8 steps. RESISTABLE`,
    animate: false,
    packInstinct: ``,
    damageType: 4,
    breathDmgType: null
  }
]
