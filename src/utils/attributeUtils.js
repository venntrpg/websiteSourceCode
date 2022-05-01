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

export function adjustAttrsAPI(
  character,
  attrAdjustments,
  propegateChanges,
  msg
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
  Object.entries(attrAdjustments).forEach((pair) => {
    const attr = pair[0];
    const adjustment = pair[1];
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
  Object.entries(attrs).forEach((pair) => {
    const attr = pair[0];
    const val = pair[1];
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
  Object.entries(attrs).forEach((pair) => {
    const attr = pair[0];
    const val = pair[1];
    if (minZeros.includes(attr) && val < 0 && character[attr] !== 0) {
      attrs[attr] = 0;
    }
  });

  // 4. do API call
  store.dispatch("character/updateAttributes", {
    id: character.id,
    attrs,
    msg,
  });
}
