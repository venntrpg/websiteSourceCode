import { ATTRIBUTES } from "./constants";
import store from "../store/index";

export function hpByDiff(diff) {
  return diff * 3;
}

export function vimByDiff(diff) {
  return diff * 3;
}

export function mpByDiff(diff) {
  return diff * 3;
}

const attrMaxMap = {
  hp: "maxHp",
  mp: "maxMp",
  vim: "maxVim",
  hero: "maxHero",
};

export function getMaxAttr(attr) {
  return attrMaxMap[attr];
}

export function getBaseAttrFromMax(attr) {
  const pair = Object.entries(attrMaxMap).find((pair) => pair[1] === attr);
  return pair === undefined ? undefined : pair[0];
}

export function getAttrFullName(attr) {
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
  const name = nameMap[attr];
  if (name) {
    return name;
  }
  if (getBaseAttrFromMax(attr) !== undefined) {
    return "Maximum " + getAttrFullName(attr.substring(3).toLowerCase());
  }
  return getAttrDisplayName(attr);
}

export function getAttrDisplayName(attr) {
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

export function getAttrMaxName(attr) {
  return "max" + attr.charAt(0).toUpperCase() + attr.slice(1);
}

export function generateDefaultAdjustMsg(attr, adjust) {
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

export function adjustAttrsAPI(
  character,
  attrAdjustments,
  propegateChanges = true,
  msg = "",
  enforceMaximums = false
) {
  if (Object.keys(attrAdjustments).length === 0) {
    return;
  }

  const clampMap = {
    maxHp: "hp",
    maxVim: "vim",
    maxMp: "mp",
    maxHero: "hero",
  };

  const attrs = {};
  const currentVal = (attr) => {
    return attrs[attr] !== undefined ? attrs[attr] : character[attr];
  };

  // 1. get resulting effects
  Object.entries(attrAdjustments).forEach(([attr, adjustment]) => {
    const newVal = character[attr] + adjustment;
    attrs[attr] = newVal;
    // propegate changes
    if (propegateChanges) {
      // HP & VIM
      if (attr === "str") {
        attrs.maxHp = currentVal("maxHp") + hpByDiff(adjustment);
        attrs.maxVim = currentVal("maxVim") + vimByDiff(adjustment);
      }
      if (attr === "xp") {
        const newLevel = Math.floor(newVal / 1000);
        const oldLevel = Math.floor(character[attr] / 1000);
        const levelDiff = newLevel - oldLevel;
        if (levelDiff !== 0) {
          attrs.maxHp = currentVal("maxHp") + levelDiff;
          attrs.maxVim = currentVal("maxVim") + levelDiff;
        }
      }
      // MP
      if (attr === "wis") {
        attrs.maxMp = Math.max(currentVal("maxMp") + mpByDiff(adjustment), 0);
      }
      // SPEED
      if (attr === "agi") {
        attrs.speed = Math.max(currentVal("speed") + adjustment, 0);
      }
      // INIT
      if (attr === "agi" || attr === "dex") {
        attrs.init = Math.max(currentVal("init") + adjustment, 0);
      }
    }
  });

  // 2. clamp logic
  Object.entries(attrs).forEach(([attr, val]) => {
    if (attr in clampMap) {
      const baseAttr = clampMap[attr];
      if (
        !(baseAttr in attrs) &&
        character[baseAttr] <= character[attr] &&
        character[baseAttr] > val
      ) {
        attrs[baseAttr] = val;
      }
    }
  });

  // 3. enforce minimums
  const minZeros = [
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
  ];
  Object.entries(attrs).forEach(([attr, val]) => {
    if (minZeros.includes(attr) && val < 0 && character[attr] !== 0) {
      attrs[attr] = 0;
    }
  });

  // 4. enforce maximums
  if (enforceMaximums) {
    Object.entries(attrs).forEach(([attr, val]) => {
      const maxAttr = getMaxAttr(attr);
      if (maxAttr && currentVal(maxAttr) && val > currentVal(maxAttr)) {
        attrs[attr] = currentVal(maxAttr);
      }
    });
  }

  // 5. do API call
  store.dispatch("character/updateAttributes", {
    id: character.id,
    attrs,
    msg,
  });
}
