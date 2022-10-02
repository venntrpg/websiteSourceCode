import mexp from "math-expression-evaluator";
import { ATTRIBUTES } from "./constants";
import { attrIsEditable } from "../api/apiUtil";
import { getShopItem } from "./itemUtils";
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
  return Math.floor(newXP / 1000) - Math.floor(originalXP / 1000);
}

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
        // if hp = 15, maxHp = 10 -> maxHp changed to 7, keep hp at 15
      ) {
        attrs[baseAttr] = val;
      }
    }
  });

  // 3. enforce zero minimums
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

  const attrs = adjustAttrsObject(
    character,
    attrAdjustments,
    propegateChanges,
    enforceMaximums
  );

  if (propegateChanges && attrs.xp) {
    const levelDiff = calcLevelDiff(attrs.xp, character.xp);
    if (levelDiff > 0) {
      store.commit("character/setLevelsToProcess", levelDiff);
    }
  }

  store.dispatch("character/updateAttributes", {
    id: character.id,
    attrs,
    msg,
  });
}

export function characterAttributesMap(character: Character) {
  const attrs: CharacterAttributes = {};
  // 1. Directly copy over base attribute values from the character object
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

  const equations: { [attr: string]: string } = {};

  // 2. Fetch effects from items
  character.items.forEach((item) => {
    const shopItem = getShopItem(item);
    if (
      shopItem === undefined ||
      shopItem.uses === undefined ||
      shopItem.uses.adjust === undefined ||
      !item.equipped
    ) {
      return;
    }
    Object.entries(shopItem.uses.adjust.attr).forEach(([attr, val]) => {
      if (typeof val === "string" && typeof attrs[attr].val === "number") {
        // adjust value is an equation instead of a direct adjustment, so we need to pass it on to handle later
        equations[attr] = val;
      } else {
        alterAttrs(attr, val, [item]);
      }
    });
  });

  // 3. Apply burden effects:
  const burden = attrs.burden;
  if (burden !== undefined) {
    alterAttrs("speed", -burden.val);
    alterAttrs("casting", -burden.val);
  }

  // 4. Apply pending equations
  Object.entries(equations).forEach(([attr, equation]) => {
    Object.entries(attrs).forEach(([replaceAttr, replaceVal]) => {
      if (typeof replaceVal.val === "number") {
        equation = equation.replaceAll(replaceAttr, replaceVal.val.toString());
      }
    });
    // ensure all variables have been removed from the equation before attempting to solve it
    if (/^[\d+\-*/() ]+$/.test(equation)) {
      try {
        const parsed = parseInt(mexp.eval(equation));
        if (attrs[attr]) {
          attrs[attr].val = parsed;
        } else {
          alterAttrs(attr, parsed);
        }
      } catch {
        // throw out any errors
      }
    }
  });

  // 5. Enforce zero minimums
  Object.entries(attrs).forEach(([attr, map]) => {
    if (minZeros.has(attr) && typeof map.val === "number" && map.val < 0) {
      attrs[attr].val = 0;
    }
  });

  return attrs;
}
