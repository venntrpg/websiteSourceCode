import { lvlStr, lvlInt } from "./CogUtils";

// data to drive functions
function cogTypeMap(lvl) {
  const L = lvlStr(lvl);
  return {
    arcanae: {
      title: "Arcanae",
      about: "This Cog is a magical being, creature, or creation.",
      tactics: "Set by GM or use the Tactics of another Type",
      pko: "Set by GM or use the Tactics of another Type",
      attrs: {},
    },
    automata: {
      title: "Automata",
      about:
        "This Cog is a robotic construction, or otherwise technologically animated.",
      details: [
        "Their Charisma, Wisdom, and Spirit are set to -2 and cannot be increased",
        `Their Technology is ${L}`,
        "They do not need to eat, breathe, or sleep",
      ],
      tactics:
        "Automatons spread out evenly, each targeting a different enemy where possible",
      pko: "Automatons don’t interact with the PCs on PKO",
      attrs: {
        cha: -2,
        wis: -2,
        spi: -2,
        tek: lvlInt(lvl),
      },
    },
    beastFlora: {
      title: "Beast / Flora",
      about: "This Cog is an animal or plant of bestial instinct.",
      details: [
        "Their Wisdom, Technology, and Intelligence are set to -2 and cannot be increased",
        `Their Strength, Dexterity, Perception, and Agility are ${L}`,
      ],
      tactics: "Beasts swarm the closest enemy",
      pko: "Beasts eat everything deemed edible that the PCs carry on them",
      attrs: {
        wis: -2,
        tek: -2,
        int: -2,
        str: lvlInt(lvl),
        dex: lvlInt(lvl),
        per: lvlInt(lvl),
        agi: lvlInt(lvl),
      },
    },
    humanoid: {
      title: "Humanoid",
      about:
        "This Cog is a sentient creature, such as humans, elves, orcs, etc.",
      tactics:
        "Humanoids are unpredictable and use clever strategies, such as focusing the enemy healer or using hazards to their advantage",
      pko: "Humanoids steal everything deemed valuable from the PCs",
      attrs: {},
    },
    monster: {
      title: "Monster",
      about:
        "This Cog is a chaotic and exotic beast, including most enemies found in the Tributaries.",
      details: [`Their Strength, Dexterity, Perception, and Agility are ${L}`],
      tactics: "Monsters attack the closest enemy.",
      pko: "Monsters eat all of the PCs food and destroy their Lux Wards.",
      attrs: {
        str: lvlInt(lvl),
        dex: lvlInt(lvl),
        per: lvlInt(lvl),
        agi: lvlInt(lvl),
      },
    },
    undead: {
      title: "Undead",
      about: "This Cog was raised from the dead by dark magicks or curses.",
      details: [
        "Their Charisma, Technology, Spirit, and Intelligence are set to -2 and cannot be increased",
        "They do not need to eat, breathe, or sleep",
      ],
      tactics:
        "Tactics: Undead choose a single strategy, set by the GM, and attempt to execute it. For example:",
      tacticsExamples: [
        "All attack the closest target",
        "All attack the farthest target",
        "All defend their ally healer",
        "All stay adjacent to each other and attack who they can",
      ],
      pko: "Undead steal all silver pieces and valuable objects, then destroy all Lux Wards",
      attrs: {
        cha: -2,
        tek: -2,
        spi: -2,
        int: -2,
      },
    },
  };
}

export const cogTypesList = Object.keys(cogTypeMap(""));

export function cogTypeCopy(lvl, option) {
  // returns undefined if not found
  return cogTypeMap(lvl)[option];
}

export function cogTypeAttrVal(lvl, option, attr) {
  // returns undefined if not found
  const details = cogTypeCopy(lvl, option);
  if (details !== undefined) {
    return details.attrs[attr];
  }
  return undefined;
}
