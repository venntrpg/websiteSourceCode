import { lvlStr, lvlInt } from "./CogUtils";
import { COG_TRAIT_TYPE, COG_WEAKNESS_TYPE } from "./CogConstants";

/**
 * Returns map with trait options
 * Abilities may be computed from the results. Special details are in the abilityDetails field
 *  - handled is a boolean. If true, this field is already being included in the cog's stats.
 *  - cost is a map that corresponds to the cost map in abilities. Regular activation string may be built from these values
 *    If this map is not defined, then the ability is passive.
 * levelAdjustments field
 *  - is used when calculating character attributes based on level.
 *  - Special field dmg is referenced during cog ability creation
 * adjustments field
 *  - directly adjusts referenced stats
 * multiplier field
 *  - acts as a multiplier for the given attribute
 * @param {*} cog The cog that this trait is effecting
 * @returns The trait options.
 */
export function traitOptions(cog) {
  const Lstr = lvlStr(cog.level);
  const halfLstr = lvlStr(cog.level, "L/2", (lvl) => Math.round(lvl / 2));
  const doubleLstr = lvlStr(cog.level, "2L", (lvl) => 2 * lvl);
  const tripleLstr = lvlStr(cog.level, "3L", (lvl) => 3 * lvl);
  const quintLstr = lvlStr(cog.level, "5L", (lvl) => 5 * lvl);
  const tenLstr = lvlStr(cog.level, "10L", (lvl) => 10 * lvl);
  return {
    Adaptable: {
      text: "This Cog can spend 1 Action to gain the bonus of another template until the start of their next turn. This effect can occur 3/fight.",
      section: "Combat Meta",
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Great Initiative": {
      text: `This Cog gains +${Lstr} to initiative.`,
      abilityDetails: {
        handled: true,
      },
    },
    "Half Template": {
      text: "This Cog has half the bonus of another template.",
      abilityDetails: {},
    },
    "Small I": {
      text: "This Cog is considered 1 Level lower for Strength, HP, damage, and Speed; they are considered 1 Level higher for Vim, Dexterity, and Agility, and gain 1 Alert at the start of each of their turns. This cannot be taken with Large I.",
      abilityDetails: {
        handled: true,
      },
      levelAdjustments: {
        str: -1,
        hp: -1,
        dmg: -1, // TODO: this will need to be referenced in AbilityCreation
        speed: -1,
        vim: 1,
        dex: 1,
        agi: 1,
      },
    },
    "Small II": {
      text: "This Cog is considered 2 Levels lower for Strength, HP, damage, and Speed; they are considered 3 Levels higher for Vim, Dexterity, and Agility, and gain 2 Alerts at the start of each of their turns.",
      abilityDetails: {
        handled: true,
      },
      levelAdjustments: {
        str: -2,
        hp: -2,
        dmg: -2,
        speed: -2,
        vim: 3,
        dex: 3,
        agi: 3,
      },
    },
    "Large I": {
      text: "This Cog is considered 1 Level higher for Strength, HP, damage, and Speed; they are considered 1 Level lower for Vim, Dexterity, and Agility. They take up 3 adjacent hexes and have a Reach of 2 meters. This cannot be taken with Small I.",
      abilityDetails: {
        handled: true,
      },
      levelAdjustments: {
        str: 1,
        hp: 1,
        dmg: 1,
        speed: 1,
        vim: -1,
        dex: -1,
        agi: -1,
      },
      adjustments: {
        radius: 0.5,
        reach: 1,
      },
    },
    "Large II": {
      text: "This Cog is considered 2 Levels higher for Strength, HP, damage, and Speed; they are considered 3 Levels lower for Vim, Dexterity, and Agility. They take up 7 hexes (1 hex and all surrounding hexes) and have a Reach of 3 meters.",
      abilityDetails: {
        handled: true,
      },
      levelAdjustments: {
        str: 2,
        hp: 2,
        dmg: 2,
        speed: 2,
        vim: -3,
        dex: -3,
        agi: -3,
      },
      adjustments: {
        radius: 1,
        reach: 2,
      },
    },
    "Large III": {
      text: "This Cog is considered 3 Levels higher for Strength, HP, damage, and Speed; they are considered 5 Levels lower for Vim, Dexterity, and Agility. They have a radius of 2 and a Reach of 4 meters.",
      abilityDetails: {
        handled: true,
      },
      levelAdjustments: {
        str: 3,
        hp: 3,
        dmg: 3,
        speed: 3,
        vim: -5,
        dex: -5,
        agi: -5,
      },
      adjustments: {
        radius: 2,
        reach: 3,
      },
    },
    "Second Phase": {
      text: `When this Cog is near-defeated, they may respond in a manner so shocking and situation-changing that it ends the current Encounter and begins a new one. When this Cog is created, specify the condition under which this response is triggered, such as ${doubleLstr} health remaining or the last one of its group alive.`,
      abilityDetails: {},
    },
    "Fast I": {
      text: "This Cog has doubled Speed.",
      section: "Movement",
      abilityDetails: {
        handled: true,
      },
      multiplier: {
        speed: 2,
      },
    },
    "Fast II": {
      text: "This Cog has tripled Speed.",
      multiplier: {
        speed: 3,
      },
    },
    "Flight I": {
      text: "This Cog has a Flight Speed equal to half its Speed.",
      abilityDetails: {}, // TODO: Figure out a way to add this to formatted cog
    },
    "Flight II": {
      text: "This Cog has a Flight Speed equal to its Speed.",
      abilityDetails: {}, // TODO: Figure out a way to add this to formatted cog
    },
    "Swim I": {
      text: "This Cog has a Swim Speed equal to its Speed.",
      abilityDetails: {}, // TODO: Figure out a way to add this to formatted cog
    },
    "Swim II": {
      text: "This Cog has a Swim Speed equal to twice its Speed.",
      abilityDetails: {}, // TODO: Figure out a way to add this to formatted cog
    },
    "Bonus Accuracy I": {
      text: "This Cog has +5 Accuracy.",
      section: "Offenses",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        acc: 5,
      },
    },
    "Bonus Accuracy II": {
      text: "This Cog has +10 Accuracy.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        acc: 10,
      },
    },
    "Bonus Accuracy III": {
      text: "This Cog has +15 Accuracy.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        acc: 15,
      },
    },
    "Bonus AP I": {
      text: "This Cog gains 2 AP.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        ap: 2,
      },
    },
    "Bonus AP II": {
      text: "This Cog gains 5 AP.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        ap: 5,
      },
    },
    "Bonus Damage I": {
      text: "Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +3.",
      abilityDetails: {}, // Could probably calculate this out, but its fine as an ability to whatever
    },
    "Bonus Damage II": {
      text: `Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +9. Additionally, any attack that deals normal damage deals an additional +3 (or ${halfLstr}, whichever is lower) damage. This ability replaces Bonus Damage I.`,
      abilityDetails: {},
    },
    "Bonus Damage III": {
      text: `Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +15. Additionally, any attack that deals normal damage deals an additional +6 (or ${Lstr}, whichever is lower) damage. This ability replaces Bonus Damage II.`,
      abilityDetails: {},
    },
    "Reach I": {
      text: "This Cog's Reach increases by 1 meter.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        reach: 1,
      },
    },
    "Reach II": {
      text: "This Cog's Reach increases by 2 meters.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        reach: 2,
      },
    },
    "Aimed Attacker": {
      text: "By spending 1 Action, this Cog can gain +20 Accuracy to their next attack. This effect can stack.",
      section: "Special Offenses",
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    Prey: {
      text: "This Cog always targets characters who are not Supported if one exists, and deals an additional 2d6 damage with damage-dealing abilities against targets who are not Supported.",
      abilityDetails: {
        handled: true,
      },
    },
    "Frenzy I": {
      text: `When this Cog has ${tripleLstr} health or less, they deal an additional 2d6 damage with damage-dealing abilities (excluding Traits).`,
      abilityDetails: {},
    },
    "Frenzy II": {
      text: "When this Cog is injured, they deal an additional 2d6 damage with damage-dealing abilities (excluding Traits).",
      abilityDetails: {},
    },
    "Full Attack I": {
      text: `This Cog can spend 3 Actions to make three melee attacks with an Accuracy of ${tenLstr} and dealing ${doubleLstr} damage each.`,
      abilityDetails: {
        cost: {
          A: 3,
        },
      },
    },
    "Full Attack II": {
      text: `This Cog can spend 3 Actions to make four melee attacks with an Accuracy of ${quintLstr} and dealing ${tripleLstr} damage each.`,
      abilityDetails: {
        cost: {
          A: 3,
        },
      },
    },
    "Harsh Opener I": {
      text: "For the first Round of combat, this Cog has 5 Actions per turn instead of 3.",
      abilityDetails: {},
    },
    "Harsh Opener II": {
      text: "For the first two Rounds of combat, this Cog has 5 Actions per turn instead of 3.",
      abilityDetails: {},
    },
    Grappler: {
      /* (requires Course of Contenders) */
      text: `When this Cog attempts a grapple, they gain +${halfLstr} to the STR check made to grapple.`,
      abilityDetails: {},
    },
    Powerful: {
      text: "This Cog can spend 2 Actions to charge an attack. Its next attack will deal double damage on all damage types. This effect cannot stack.",
      abilityDetails: {
        cost: {
          A: 2,
        },
      },
    },
    "Thousand Cuts I": {
      text: `By spending 1 Action, this Cog can make a melee attack that deals ${Lstr} damage.`,
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Thousand Cuts II": {
      text: `By spending 1 Action, this Cog can make two melee attacks that deal ${Lstr} damage.`,
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Threatening Aura I": {
      text: "All enemies (to the Cog) are threatened when they come within 1 meter of this Cog and take a -2 penalty to damage while threatened by them.",
      abilityDetails: {},
    },
    "Threatening Aura II": {
      text: "All enemies (to the Cog) are threatened when they come within 4 meters of this Cog and take a -4 penalty to damage while threatened by them.",
      abilityDetails: {},
    },
    "Threatening Aura III": {
      text: "All enemies (to the Cog) are threatened when they come within 12 meters of this Cog and take a -8 penalty to damage while threatened by them.",
      abilityDetails: {},
    },
    Volatile: {
      text: `When this Cog dies, they explode, dealing ${Lstr}d6 damage to all creatures in a radius of ${Lstr} (or smaller, set during Cog creation).`,
      abilityDetails: {},
    },
    Wrestler: {
      /* (requires Course of Contenders) */
      text: "This Cog can use Shove (Wrestler), Pin (Wrestler), and Reverse Maneuver (Wrestler).",
      abilityDetails: {},
    },
    "Alert I": {
      text: `This Cog can spend 1 Action to gain Alert. A Cog can hold only ${Lstr} Alerts at a time.`,
      section: "Defenses",
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Alert II": {
      text: `This Cog can spend 1 Action to gain Alert, and passively gains 1 Alert at the start of each of their turns. A Cog can hold only ${Lstr} Alerts at a time.`,
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Alert III": {
      text: `This Cog can spend 1 Action to gain 2 Alert, and passively gains 1 Alert at the start of each of their turns. A Cog can hold only ${Lstr} Alerts at a time.`,
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Alert IV": {
      text: `This Cog can spend 1 Action to gain 2 Alert, and passively gains 2 Alert at the start of each of their turns. A Cog can hold only ${Lstr} Alerts at a time.`,
      abilityDetails: {
        cost: {
          A: 1,
        },
      },
    },
    "Armored I": {
      text: `This Cog gains ${halfLstr} Armor.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        armor: lvlInt(cog.level, (lvl) => Math.round(lvl / 2)),
      },
    },
    "Armored II": {
      text: `This Cog gains ${Lstr} Armor.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        armor: lvlInt(cog.level),
      },
    },
    "Bonus Vim I": {
      text: "This Cog has +5 Vim.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        vim: 5,
      },
    },
    "Bonus Vim II": {
      text: "This Cog has +10 Vim.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        vim: 10,
      },
    },
    "Bonus Vim III": {
      text: "This Cog has +15 Vim.",
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        vim: 15,
      },
    },
    "Dark Dweller": {
      text: "At the start of each turn, this Cog gains Alert if they are in complete darkness. They lose all Alerts when exposed to bright light.",
      abilityDetails: {},
    },
    "Blocker I": {
      text: "On receiving a glancing blow, this Cog can spend a Reaction to gain +L Armor until its next turn.",
      abilityDetails: {},
    },
    "Blocker II": {
      text: `On receiving a glancing blow or by spending 10 Vim, this Cog can spend a Reaction to gain +${doubleLstr} Armor until its next turn. When this occurs, they may attempt an attack in response as a Free Action.`,
      abilityDetails: {},
    },
    "Dodger I": {
      text: "On receiving a glancing blow, this Cog can spend a Reaction to negate the attack.",
      abilityDetails: {},
    },
    "Dodger II": {
      text: "This Cog can spend a Reaction to negate any attack. When this occurs they may attempt an attack in response as a Free Action.",
      abilityDetails: {
        cost: {
          R: 1,
        },
      },
    },
    "Dodger III": {
      text: "This Cog can spend a Reaction or 5 Vim to negate any attack. When this occurs they may attempt an attack in response as a Free Action.",
      abilityDetails: {
        cost: {
          Special: "1 Reaction or 5 Vim",
        },
      },
    },
    "Extra Health I": {
      text: `This Cog gains ${Lstr} HP. This cannot be taken with any Reduced Health Weakness.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level),
      },
    },
    "Extra Health II": {
      text: `This Cog gains ${tripleLstr} HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level, (lvl) => lvl * 3),
      },
    },
    "Extra Health III": {
      text: `This Cog gains ${quintLstr} HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level, (lvl) => lvl * 5),
      },
    },
    "Parrier I": {
      text: `When this Cog is targeted with a melee attack, if their Accuracy + ${quintLstr} is greater than the attacker's Accuracy, the attack is negated and the Cog may attempt an attack in response as a Free Action.`,
      abilityDetails: {},
    },
    "Parrier II": {
      text: `When this Cog is targeted with a melee attack, if their Accuracy + ${tenLstr} is greater than the attacker's Accuracy, the attack is negated and the Cog may attempt an attack in response as a Free Action.`,
      abilityDetails: {},
    },
    Weaselly: {
      /* (requires Course of Contenders) */
      text: `This Cog gains +${Lstr} to checks made to escape grapples and can use Weasel (Slippery).`,
      abilityDetails: {},
    },
    "Alert Ally": {
      text: "Once per turn, this Cog can spend 1 MP to grant Alert to another Cog.",
      section: "Special Defenses",
      abilityDetails: {
        cost: {
          M: 1,
        },
      },
    },
    "Heal I": {
      text: `By spending 2 Actions and 1 MP, this Cog can heal themselves for ${doubleLstr} HP.`,
      abilityDetails: {
        cost: {
          A: 2,
          M: 1,
        },
      },
    },
    "Heal II": {
      text: `By spending 2 Actions and 1 MP, this Cog can heal themselves or an ally within 12 meters for ${doubleLstr} HP.`,
      abilityDetails: {
        cost: {
          A: 2,
          M: 1,
        },
      },
    },
    "Heal III": {
      text: `By spending 1 Action and 1 MP, this Cog can heal themselves or an ally within 12 meters for ${doubleLstr} HP.`,
      abilityDetails: {
        cost: {
          A: 1,
          M: 1,
        },
      },
    },
    "Stable I": {
      text: "When this Cog is forcibly moved a number of meters, they move only half that distance.",
      abilityDetails: {},
    },
    "Stable II": {
      text: "This Cog is immune to being forcibly moved.",
      abilityDetails: {},
    },
    Patient: {
      text: "This Cog is immune to threatening.",
      abilityDetails: {},
    },
    "Perfect Senses": {
      text: "This Cog is immune to Accuracy debuffs.",
      abilityDetails: {},
    },
    Sturdy: {
      text: "This Cog is immune to being knocked prone.",
      abilityDetails: {},
    },
    "Thorns I": {
      text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 1 HP.",
      abilityDetails: {},
    },
    "Thorns II": {
      text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 3 HP. This ability replaces Thorns I.",
      abilityDetails: {},
    },
    "Thorns III": {
      text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 6 HP. This ability replaces Thorns II.",
      abilityDetails: {},
    },
    "Attribute Damage Resistance I": {
      text: "Takes half damage from attribute damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Attribute Damage Resistance II": {
      text: "Immune to attribute damage.",
      abilityDetails: {},
    },
    "Magic Resistance I": {
      text: "Takes half damage from magic attacks. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Magic Resistance II": {
      text: "Immune to magic attacks.",
      abilityDetails: {},
    },
    "Fire Resistance I": {
      text: "Takes half damage from fire or burn damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Fire Resistance II": {
      text: "Immune to fire attacks and burn damage.",
      abilityDetails: {},
    },
    "Electrical Resistance I": {
      text: "Takes half damage from electrical attacks. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Electrical Resistance II": {
      text: "Immune to electrical attacks.",
      abilityDetails: {},
    },
    "Slashing Resistance I": {
      text: "Takes half damage from slashing attacks and bleed damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Slashing Resistance II": {
      text: "Immune to slashing attacks and bleed damage.",
      abilityDetails: {},
    },
    "Bludgeoning Resistance I": {
      text: "Takes half damage from bludgeoning attacks. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Bludgeoning Resistance II": {
      text: "Immune to bludgeoning attacks.",
      abilityDetails: {},
    },
    "Piercing Resistance I": {
      text: "Takes half damage from piercing attacks and bleed damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Piercing Resistance II": {
      text: "Immune to piercing attacks and bleed damage.",
      abilityDetails: {},
    },
    "Paralysis Resistance I": {
      text: "Takes half damage from paralysis damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Paralysis Resistance II": {
      text: "Immune to paralysis damage.",
      abilityDetails: {},
    },
    "Stun Resistance I": {
      text: "Takes half damage from stun damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Stun Resistance II": {
      text: "Immune to stun damage.",
      abilityDetails: {},
    },
    "Vim Damage Resistance I": {
      text: "Takes half damage from Vim Damage. Cannot be taken with respective Vulnerability.",
      abilityDetails: {},
    },
    "Vim Damage Resistance II": {
      text: "Immune to Vim Damage.",
      abilityDetails: {},
    },
  };
}

export const progressiveTraitOptions = [
  ["Small I", "Small II"],
  ["Large I", "Large II", "Large III"],
  ["Fast I", "Fast II"],
  ["Flight I", "Flight II"],
  ["Swim I", "Swim II"],
  ["Bonus Accuracy I", "Bonus Accuracy II", "Bonus Accuracy III"],
  ["Bonus AP I", "Bonus AP II"],
  ["Bonus Damage I", "Bonus Damage II", "Bonus Damage III"],
  ["Reach I", "Reach II"],
  ["Frenzy I", "Frenzy II"],
  ["Full Attack I", "Full Attack II"],
  ["Harsh Opener I", "Harsh Opener II"],
  ["Thousand Cuts I", "Thousand Cuts II"],
  ["Threatening Aura I", "Threatening Aura II", "Threatening Aura III"],
  ["Alert I", "Alert II", "Alert III", "Alert IV"],
  ["Armored I", "Armored II"],
  ["Bonus Vim I", "Bonus Vim II", "Bonus Vim III"],
  ["Blocker I", "Blocker II"],
  ["Dodger I", "Dodger II", "Dodger III"],
  ["Extra Health I", "Extra Health II", "Extra Health III"],
  ["Parrier I", "Parrier II"],
  ["Heal I", "Heal II", "Heal III"],
  ["Stable I", "Stable II"],
  ["Thorns I", "Thorns II", "Thorns III"],
  ["Attribute Damage Resistance I", "Attribute Damage Resistance II"],
  ["Magic Resistance I", "Magic Resistance II"],
  ["Fire Resistance I", "Fire Resistance II"],
  ["Electrical Resistance I", "Electrical Resistance II"],
  ["Slashing Resistance I", "Slashing Resistance II"],
  ["Bludgeoning Resistance I", "Bludgeoning Resistance II"],
  ["Piercing Resistance I", "Piercing Resistance II"],
  ["Paralysis Resistance I", "Paralysis Resistance II"],
  ["Stun Resistance I", "Stun Resistance II"],
  ["Vim Damage Resistance I", "Vim Damage Resistance II"],
];

export function weaknessOptions(cog) {
  const Lstr = lvlStr(cog.level);
  const doubleLstr = lvlStr(cog.level, "2L", (lvl) => lvl * 2);
  const tripleLstr = lvlStr(cog.level, "3L", (lvl) => lvl * 3);
  const quadLstr = lvlStr(cog.level, "4L", (lvl) => lvl * 4);
  const halfLstr = lvlStr(cog.level, "L/2", (lvl) => Math.round(lvl / 2));
  return {
    "Predatory Nature": {
      text: "This Cog can only attack targets who are not Supported.",
      abilityDetails: {},
    },
    "Simple I": {
      text: `This Cog has ${halfLstr} fewer AP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        ap: lvlInt(cog.level, (lvl) => Math.round(lvl / 2)),
      },
    },
    "Simple II": {
      text: `This Cog has ${Lstr} fewer AP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        ap: lvlInt(cog.level),
      },
    },
    "Simple III": {
      text: `This Cog has only ${halfLstr} AP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        ap: lvlInt(cog.level, (lvl) => lvl + Math.round(lvl / 2)),
      },
    },
    "Slow I": {
      text: "This Cog has halved Speed.",
      abilityDetails: {
        handled: true,
      },
      multiplier: {
        speed: 0.5,
      },
    },
    "Slow II": {
      text: "This Cog has 0 Speed.",
      abilityDetails: {
        handled: true,
      },
      multiplier: {
        speed: 0,
      },
    },
    "Slow Attack": {
      text: "All of this Cog's abilities and action Traits cost 1 Action more to use.",
      // WARNING: THIS REQUIRES SPECIAL CODE
      // Maybe think of a better way of doing this???
      abilityDetails: {
        handled: true,
      },
    },
    "Reduced Health I": {
      text: `This Cog loses ${Lstr} HP. If other weaknesses would reduce their health to 0 or less, they have 1 HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level),
      },
    },
    "Reduced Health II": {
      text: `This Cog loses ${doubleLstr} HP. If other weaknesses would reduce their health to 0 or less, they have 1 HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level),
      },
    },
    "Reduced Health III": {
      text: `This Cog loses ${tripleLstr} HP. If other weaknesses would reduce their health to 0 or less, they have 1 HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level),
      },
    },
    "Reduced Health IV": {
      text: `This Cog loses ${quadLstr} HP. If other weaknesses would reduce their health to 0 or less, they have 1 HP.`,
      abilityDetails: {
        handled: true,
      },
      adjustments: {
        hp: lvlInt(cog.level),
      },
    },
    "Vulnerable to Attribute Damage": {
      text: "Takes 50% more damage from attribute damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Magic": {
      text: "Takes 50% more damage from magical attacks, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Fire": {
      text: "Takes 50% more damage from fire and burn damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Electricity": {
      text: "Takes 50% more damage from electrical damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Bleeding": {
      text: "Takes 50% more damage from bleed damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Slashing": {
      text: "Takes 50% more damage from slashing attacks, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Piercing": {
      text: "Takes 50% more damage from piercing attacks, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Bludgeoning": {
      text: "Takes 50% more damage from bludgeoning attacks, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Paralysis": {
      text: "Takes 50% more damage from paralysis damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Stun": {
      text: "Takes 50% more damage from stun damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Vulnerable to Vim Damage": {
      text: "Takes 50% more damage from Vim damage, rounded up. This Weakness may be taken more than once.",
      abilityDetails: {},
    },
    "Blinded by Bright Light": {
      text: "When exposed to bright light, this Cog is blinded.",
      abilityDetails: {},
    },
    "Weakened by Light": {
      text: "This Cog rolls 1d6 less for all damage types in dim light or 2d6 less for all damage types in bright light.",
      abilityDetails: {},
    },
    "Flees When Injured": {
      text: "When this Cog has half of their health remaining, they attempt to flee.",
      abilityDetails: {},
    },
    "Flees When Alone": {
      text: "When this Cog has no allies remaining, they attempt to flee. This Weakness may be taken more than once; when taken X times, the Cog flees when there are only X allies remaining, including itself.",
      abilityDetails: {},
    },
  };
}

export const progressiveWeaknessOptions = [
  ["Simple I", "Simple II", "Simple III"],
  ["Slow I", "Slow II"],
  [
    "Reduced Health I",
    "Reduced Health II",
    "Reduced Health III",
    "Reduced Health IV",
  ],
];

const traitWeaknessExclusionPairs = [
  ["Bonus AP I", "Simple I"],
  ["Fast I", "Slow I"],
  ["Extra Health I", "Reduced Health I"],
  ["Attribute Damage Resistance I", "Vulnerable to Attribute Damage"],
  ["Magic Resistance I", "Vulnerable to Magic"],
  ["Fire Resistance I", "Vulnerable to Fire"],
  ["Electrical Resistance I", "Vulnerable to Electricity"],
  ["Slashing Resistance I", "Vulnerable to Slashing"],
  ["Bludgeoning Resistance I", "Vulnerable to Bludgeoning"],
  ["Piercing Resistance I", "Vulnerable to Piercing"],
  ["Paralysis Resistance I", "Vulnerable to Paralysis"],
  ["Stun Resistance I", "Vulnerable to Stun"],
  ["Vim Damage Resistance I", "Vulnerable to Vim Damage"],
];

export function traitAndWeaknessNames(cog) {
  return [
    ...Object.keys(traitOptions(cog)),
    ...Object.keys(weaknessOptions(cog)),
  ];
}

export function disabledTraits(cog) {
  const exclusionMap = {};
  traitWeaknessExclusionPairs.forEach((pair) => {
    exclusionMap[pair[1]] = pair[0];
  });

  return cog.weaknesses
    .filter((weakness) => exclusionMap[weakness] !== undefined)
    .map((weakness) => exclusionMap[weakness]);
}

export function disabledWeaknesses(cog) {
  const exclusionMap = {};
  traitWeaknessExclusionPairs.forEach((pair) => {
    exclusionMap[pair[0]] = pair[1];
  });

  return cog.traits
    .filter((trait) => exclusionMap[trait] !== undefined)
    .map((trait) => exclusionMap[trait]);
}

// actually works on both traits and weaknesses
export function bestSelectedTraitsMap(cog) {
  const allTraits = { ...traitOptions(cog), ...weaknessOptions(cog) };
  const bestSelectedTraits = [];
  const selectedTraits = {};

  const progressiveOptions = [
    ...progressiveTraitOptions,
    ...progressiveWeaknessOptions,
  ];
  const cogTraits = [...cog.traits, ...cog.weaknesses];

  const selectedProgressiveTraits = cogTraits.filter((trait) =>
    progressiveOptions.some((row) => row.includes(trait))
  );
  const bestOfRows = {};
  selectedProgressiveTraits.forEach((trait) => {
    const row = progressiveOptions.findIndex((row) => row.includes(trait));
    const col = progressiveOptions[row].indexOf(trait);
    if (bestOfRows[row] === undefined || bestOfRows[row] < col) {
      bestOfRows[row] = col;
    }
  });
  Object.entries(bestOfRows).forEach((pair) => {
    bestSelectedTraits.push(progressiveOptions[pair[0]][pair[1]]);
  });
  cogTraits
    .filter((trait) => !selectedProgressiveTraits.includes(trait))
    .forEach((trait) => {
      bestSelectedTraits.push(trait);
    });

  bestSelectedTraits.forEach((trait) => {
    selectedTraits[trait] = allTraits[trait];
  });
  return selectedTraits;
}

function sumOfTraitMap(traits, map, attr) {
  return Object.values(traits).reduce((sum, trait) => {
    if (trait[map] !== undefined && trait[map][attr] !== undefined) {
      return sum + trait[map][attr];
    }
    return sum;
  }, 0);
}

export function attrLevelAdjustments(traits, attr) {
  return sumOfTraitMap(traits, "levelAdjustments", attr);
}

export function attrAdjustments(traits, attr) {
  return sumOfTraitMap(traits, "adjustments", attr);
}

export function attrMultipliers(traits, attr) {
  return Object.values(traits).reduce((sum, trait) => {
    if (
      trait.multiplier !== undefined &&
      trait.multiplier[attr] !== undefined
    ) {
      return sum * trait.multiplier[attr];
    }
    return sum;
  }, 1);
}

export function formatTraits(cog, traits) {
  return Object.entries(traits)
    .filter((pair) => pair[1].abilityDetails !== undefined)
    .map((pair) => {
      const trait = pair[1];
      let activation = "Passive";
      let cost = { Passive: true };
      if (trait.abilityDetails.cost !== undefined) {
        const activationList = Object.entries(trait.abilityDetails.cost).map(
          (activationPair) => {
            const type = activationPair[0];
            let val = activationPair[1];
            let pluralStr = val > 1 ? "s" : "";
            let label = type;
            switch (type) {
              case "A":
                // fun hardcoded edge case here for now - oh well
                if (cog.weaknesses.includes("Slow Attack")) {
                  val += 1;
                  pluralStr = "s";
                }
                label = "Action" + pluralStr;
                break;
              case "R":
                label = "Reaction" + pluralStr;
                break;
              case "M":
                label = "MP";
                break;
              case "V":
                label = "Vim";
                break;
              case "Special":
                label = "";
            }
            return `${val} ${label}`;
          }
        );
        activation = activationList.join(", ");
        cost = trait.abilityDetails.cost;
      }
      const handledString = trait.abilityDetails.handled
        ? "\n(Note: any attribute adjustments have already been automatically handled by the website.)"
        : "";
      const effect = trait.text + handledString;
      const name = pair[0];
      const type = cog.traits.includes(name)
        ? COG_TRAIT_TYPE
        : COG_WEAKNESS_TYPE;
      const ability = {
        name,
        effect,
        activation,
        cost,
        // special cogTrait fields
        special_ability_type: type,
      };
      return ability;
    });
}
