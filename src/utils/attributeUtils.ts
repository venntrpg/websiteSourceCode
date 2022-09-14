import { ATTRIBUTES } from "./constants";
import { attrIsEditable } from "../api/apiUtil";
import { calculateItemArmor } from "./itemUtils";
import store from "../store/index";

export function hpByDiff(diff: number) {
  return diff * 3;
}

export function vimByDiff(diff: number) {
  return diff * 3;
}

export function mpByDiff(diff: number) {
  return diff * 3;
}

const attrMaxMap: { [attr in keyof Character]?: keyof Character } = {
  hp: "maxHp",
  mp: "maxMp",
  vim: "maxVim",
  hero: "maxHero",
};

export function getMaxAttr(attr: string) {
  if (attr in attrMaxMap) {
    return attrMaxMap[attr as keyof typeof attrMaxMap];
  }
  return undefined;
}

export function getBaseAttrFromMax(attr: string) {
  const pair = Object.entries(attrMaxMap).find((pair) => pair[1] === attr);
  return pair === undefined ? undefined : (pair[0] as keyof Character);
}

export function getAttrFullName(attr: string): string {
  const nameMap = {
    per: "Perception",
    tek: "Technology",
    agi: "Agility",
    dex: "Dexterity",
    int: "Intelligence",
    spi: "Spirit",
    str: "Strength",
    wis: "Wisdom",
    cha: "Charisma",
    hero: "Hero Points",
  };
  if (attr in nameMap) {
    return nameMap[attr as keyof typeof nameMap];
  }
  if (getBaseAttrFromMax(attr) !== undefined) {
    return "Maximum " + getAttrFullName(attr.substring(3).toLowerCase());
  }
  return getAttrDisplayName(attr);
}

export function getAttrDisplayName(attr: string) {
  if (attr === "init") {
    return "Initiative";
  }
  if (attr === "maxBulk") {
    return "Carrying Capacity";
  }
  if (attr.length <= 2 || ATTRIBUTES.includes(attr)) {
    return attr.toUpperCase();
  }
  return attr.charAt(0).toUpperCase() + attr.slice(1);
}

export function getAttrMaxName(attr: string) {
  return "max" + attr.charAt(0).toUpperCase() + attr.slice(1);
}

export function generateDefaultAdjustMsg(attr: string, adjust: number) {
  if (adjust === 0) {
    return "";
  }
  const increased = adjust > 0;
  if (["hp", "mp", "vim", "hero", "xp", "sp"].includes(attr)) {
    let pre = "";
    switch (attr) {
      case "hp":
        pre = increased ? "Healed" : "Lost";
        break;
      case "mp":
      case "vim":
        pre = increased ? "Gained" : "Lost";
        break;
      case "hero":
        pre = increased ? "Gained" : "Used";
        break;
      case "xp":
        pre = increased ? "Earned" : "Lost";
        break;
      case "sp":
        pre = increased ? "Gained" : "Spent";
        break;
    }
    return `${pre} ${Math.abs(adjust)} ${attr}`;
  }
  let pre = "Increased";
  if (!increased) {
    pre = "Decreased";
  }
  return `${pre} ${attr} by ${Math.abs(adjust)}`;
}

export function calcLevelDiff(newXP: number, originalXP: number) {
  return Math.floor((newXP - originalXP) / 1000);
}

// essentially a helper function for adjustAttrsAPI. This returns the attrsObject to pass to updateAttributes
export function adjustAttrsObject(
  character: Character,
  attrAdjustments: AttributeAdjustments,
  propegateChanges = true,
  enforceMaximums = false
) {
  const attrs: AttributeAdjustments = {};
  const currentVal = (attr: keyof AttributeAdjustments): number => {
    if (attrs[attr] !== undefined) {
      return attrs[attr] as number;
    }
    if (typeof character[attr] !== "number") {
      return 0;
    }
    return character[attr] as number;
  };

  // 1. get resulting effects
  Object.entries(attrAdjustments).forEach(([attr, adjustment]) => {
    if (adjustment === undefined) {
      return; // exit early to satisfy TS
    }
    const newVal = currentVal(attr as keyof AttributeAdjustments) + adjustment;
    attrs[attr as keyof AttributeAdjustments] = newVal;
    // propegate changes
    if (propegateChanges) {
      // HP & VIM
      if (attr === "str") {
        attrs.maxHp = currentVal("maxHp") + hpByDiff(adjustment);
        attrs.maxVim = currentVal("maxVim") + vimByDiff(adjustment);
      }
      if (attr === "xp") {
        const levelDiff = calcLevelDiff(newVal, character.xp);
        if (levelDiff !== 0) {
          attrs.maxHp = currentVal("maxHp") + levelDiff;
          attrs.maxVim = currentVal("maxVim") + levelDiff;
        }
      }
      // MP
      if (attr === "wis") {
        attrs.maxMp = currentVal("maxMp") + mpByDiff(adjustment);
      }
      // SPEED
      if (attr === "agi") {
        attrs.speed = currentVal("speed") + adjustment;
      }
      // INIT
      if (attr === "agi" || attr === "dex") {
        attrs.init = currentVal("init") + adjustment;
      }
    }
  });

  // 2. clamp logic
  Object.entries(attrs).forEach(([attr, val]) => {
    const baseAttr = getBaseAttrFromMax(attr);
    if (typeof baseAttr === "string") {
      const originalBaseVal = character[baseAttr];
      const originalVal = character[attr as keyof Character];
      if (
        val !== undefined &&
        typeof originalBaseVal === "number" &&
        typeof originalVal === "number" &&
        originalBaseVal <= originalVal &&
        currentVal(baseAttr) > val
        // example case here is hp = 10, maxHp = 10 -> maxHp changed to 7, hp should also be changed to 7
      ) {
        attrs[baseAttr] = val;
      }
    }
  });

  // 3. enforce minimums
  const minZeros = new Set([
    "hp",
    "maxHp",
    "vim",
    "maxVim",
    "mp",
    "maxMp",
    "hero",
    "maxHero",
    "xp",
    "armor",
    "speed",
  ]);
  Object.entries(attrs).forEach(([attr, val]) => {
    if (val !== undefined && minZeros.has(attr) && val < 0) {
      attrs[attr as keyof AttributeAdjustments] = 0;
    }
  });

  // 4. enforce maximums
  if (enforceMaximums) {
    Object.entries(attrs).forEach(([attr, val]) => {
      const maxAttr = getMaxAttr(attr);
      if (
        val !== undefined &&
        maxAttr &&
        currentVal(maxAttr) &&
        val > currentVal(maxAttr)
      ) {
        attrs[attr as keyof AttributeAdjustments] = currentVal(maxAttr);
      }
    });
  }

  return attrs;
}

export function adjustAttrsAPI(
  character: Character,
  attrAdjustments: AttributeAdjustments,
  propegateChanges = true,
  msg = "",
  enforceMaximums = false
) {
  if (Object.keys(attrAdjustments).length === 0) {
    return;
  }

  store.dispatch("character/updateAttributes", {
    id: character.id,
    attrs: adjustAttrsObject(
      character,
      attrAdjustments,
      propegateChanges,
      enforceMaximums
    ),
    msg,
  });
}

export function characterAttributesMap(character: Character) {
  const attrs: CharacterAttributes = {};
  // 1. lay down ground work
  Object.entries(character).forEach(([attr, val]) => {
    if (
      attrIsEditable(attr) &&
      (typeof val === "string" || typeof val === "number")
    ) {
      attrs[attr] = { val, original: val, items: [], abilities: [] };
    }
  });

  const alterAttrs = (
    attr: string,
    adjust: string | number,
    items: Item[] = [],
    abilities: Ability[] = []
  ) => {
    if (attrs[attr] === undefined) {
      attrs[attr] = { val: adjust, items, abilities };
    } else {
      const val = attrs[attr].val;
      if (typeof val === "string" || typeof adjust === "string") {
        attrs[attr].val = val;
      } else {
        attrs[attr].val = val + adjust;
      }
      attrs[attr].items.push(...items);
      attrs[attr].abilities.push(...abilities);
    }
  };

  // 2. Fetch burden from items
  const burdenMap = calculateItemArmor(character.items);
  if (burdenMap !== undefined) {
    alterAttrs("armor", burdenMap.armor, burdenMap.items);
    alterAttrs("shield", burdenMap.shield, burdenMap.items);
    alterAttrs("burden", burdenMap.burden, burdenMap.items);
  }

  // 3. Apply burden effects:
  const burden = attrs.burden;
  if (burden !== undefined) {
    alterAttrs("speed", -burden.val);
    alterAttrs("casting", -burden.val);
  }

  return attrs;
}
