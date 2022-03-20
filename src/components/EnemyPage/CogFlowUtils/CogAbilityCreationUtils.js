import { lvlStr, lvlInt } from "./CogUtils";
import { bestSelectedTraitsMap, attrLevelAdjustments } from "./CogTraitsUtils";
import { COG_ABILITY_TYPE } from "./CogConstants";

// effects that require the user to specify how much AP to spend
const specialCogAbilityEffects = [
  "Empower",
  "Piercing",
  "Protecting",
  "Sharpen",
  "Sickening",
  "Stiffening",
];

const cogDamageTypes = [
  "normalDamage",
  "burningDamage",
  "bleedingDamage",
  "armorDamage",
  "stunDamage",
  "paralysisDamage",
];

// filters full list of selected effects and just returns ones that require special inputs
export function activeCogAbilitySpecialEffects(selectedEffects) {
  return selectedEffects.filter((effect) =>
    specialCogAbilityEffects.includes(effect)
  );
}

// cogAbilitiesOptionsMap helper for getting a map of special effects to their AP costs defined by the user
function cogSpecialEffectsAPMap(ability) {
  const activeSpecialEffects = activeCogAbilitySpecialEffects(ability.effects);
  const map = {};
  specialCogAbilityEffects.forEach((effect) => {
    if (activeSpecialEffects.includes(effect)) {
      const cost = parseInt(ability.specialEffectsCosts[effect]);
      if (isNaN(cost)) {
        map[effect] = "X";
      } else {
        map[effect] = cost;
      }
    } else {
      map[effect] = "X";
    }
  });
  return map;
}

// cogAbilitiesOptionsMap helper for formatting special effect AP costs
function cogSpecialEffectsAP(specialEffectsAPMap, effect, def, fun) {
  const ap = specialEffectsAPMap[effect];
  if (!isNaN(ap)) {
    return fun(ap);
  }
  return def;
}

// cogAbilitiesOptionsMap helper for getting the cog's damage depending on what options they have selected
function specialDamageLevel(level, ability) {
  if (!level) {
    return level;
  }
  const lvl = parseInt(level);
  if (ability.speed === "fast") {
    // Handle special case where damage is calculated as 3 levels lower
    return lvl - 3;
  }
  return level;
}

function normalDamageLevel(cog, ability) {
  if (!cog.level) {
    return 0;
  }
  let level = parseInt(cog.level);
  if (ability.speed === "fast") {
    level = level - 3;
  } else if (ability.speed === "slow") {
    level = level + 1;
  }
  // TODO: Maybe there is a more efficient / less spagetti code way to do this, but I guess it works for now
  level += attrLevelAdjustments(bestSelectedTraitsMap(cog), "dmg");
  return level;
}

function normalDamageDiceCount(level) {
  if (level < 0) {
    return 0;
  }
  if (level <= 2) {
    return 1;
  }
  if (level <= 4) {
    return 2;
  }
  if (level <= 6) {
    return 3;
  }
  if (level <= 8) {
    return 4;
  }
  if (level <= 12) {
    return 6;
  }
  if (level <= 12) {
    return 9;
  }
  return level;
}

function normalDamageStr(cog, ability, modifier) {
  const level = normalDamageLevel(cog, ability);
  let diceCount = normalDamageDiceCount(level) + modifier;
  if (diceCount < 0) {
    diceCount = 0;
  }
  let rollAdjustmentNumber = 0;
  // special cases
  if (cog.template === "bruiser") {
    // bruiser type cogs get +6 on regular damage
    rollAdjustmentNumber += 6;
  }
  let rollAdjustment = "";
  if (level === 0) {
    rollAdjustment = "/2";
  }
  if ([2, 3, 5, 7, 10].includes(level)) {
    rollAdjustmentNumber += 3;
  } else if ([4, 6, 8, 11, 13].includes(level)) {
    rollAdjustmentNumber += 6;
  } else if ([12, 14].includes(level)) {
    rollAdjustmentNumber += 12;
  }
  if (rollAdjustmentNumber > 0) {
    rollAdjustment += "+" + rollAdjustmentNumber;
  }
  return diceCount + "d6" + rollAdjustment;
}

export function cogAbilitiesOptionsMap(cog, ability) {
  // create map with special effect AP costs
  const specialEffectsAPMap = cogSpecialEffectsAPMap(ability);
  // setup special strings for options
  const sharpenEffectX = cogSpecialEffectsAP(
    specialEffectsAPMap,
    "Sharpen",
    "5X",
    (ap) => ap * 5
  );
  const piercingEffectX = cogSpecialEffectsAP(
    specialEffectsAPMap,
    "Piercing",
    "2X",
    (ap) => ap * 2
  );
  // other constants used in options
  const specialEffectDmgLevel = specialDamageLevel(cog.level, ability);
  const specialDmgHalfL = lvlStr(specialEffectDmgLevel, "L/2", (lvl) =>
    Math.max(Math.round(lvl / 2), 0)
  );
  const specialDmgL = lvlStr(specialEffectDmgLevel, "L", (lvl) =>
    Math.max(lvl, 0)
  );
  const specialDmgDoubleL = lvlStr(specialEffectDmgLevel, "2L", (lvl) =>
    Math.max(lvl * 2, 0)
  );
  // fun hardcoded edge case here for now - oh well
  const actionSpeedAdjustment = cog.weaknesses.includes("Slow Attack") ? 1 : 0;
  // actual map
  return {
    // range
    melee: { ap: 0, desc: "Melee", type: "range" },
    ranged: { ap: 2, desc: "12m", type: "range" },
    long: { ap: 4, desc: "60m", type: "range" },
    // speed
    fast: {
      ap: "x2",
      desc: `${1 + actionSpeedAdjustment} Action`,
      type: "speed",
      optionDetails:
        "Added Effects: The Cog's Level is treated as 3 lower for the purpose of all damage.",
    },
    regular: {
      ap: 3,
      desc: `${2 + actionSpeedAdjustment} Actions`,
      type: "speed",
    },
    slow: {
      ap: 0,
      desc: `${3 + actionSpeedAdjustment} Actions`,
      type: "speed",
      optionDetails:
        "The Cog's Level is treated as 1 higher for the purpose of normal damage.",
    },
    // resistance checks type attack
    res0: {
      ap: 0,
      desc: `DL:  ${lvlStr(cog.level, "6 + L", (lvl) => lvl + 6)}`,
      type: "res",
    },
    res1: {
      ap: 1,
      desc: `DL:  ${lvlStr(cog.level, "7 + L", (lvl) => lvl + 7)}`,
      type: "res",
    },
    res2: {
      ap: 2,
      desc: `DL:  ${lvlStr(cog.level, "8 + L", (lvl) => lvl + 8)}`,
      type: "res",
    },
    res3: {
      ap: 4,
      desc: `DL:  ${lvlStr(cog.level, "9 + L", (lvl) => lvl + 9)}`,
      type: "res",
    },
    res4: {
      ap: 6,
      desc: `DL:  ${lvlStr(cog.level, "10 + L", (lvl) => lvl + 10)}`,
      type: "res",
    },
    res5: {
      ap: 8,
      desc: `DL:  ${lvlStr(cog.level, "11 + L", (lvl) => lvl + 11)}`,
      type: "res",
    },
    // attribute damage type attack
    attr0: {
      ap: 0,
      desc: "Deal 1 attribute damage.",
      type: "attr",
      num: 1,
    },
    attr1: {
      ap: 3,
      desc: "Deal 2 attribute damage.",
      type: "attr",
      num: 2,
    },
    attr2: {
      ap: 8,
      desc: "Deal 3 attribute damage.",
      type: "attr",
      num: 3,
    },
    // fear type attack
    fear0: {
      ap: 0,
      desc: "Deal 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn (target's choice).",
      type: "fear",
      paralysis: 1,
      stun: 3,
    },
    fear1: {
      ap: 4,
      desc: "Deal 2 paralysis damage and 5 stun damage or must flee the Cog on their next turn (target's choice).",
      type: "fear",
      paralysis: 2,
      stun: 5,
    },
    // normal damage type
    norm0: {
      ap: 1,
      desc: `Deal ${normalDamageStr(cog, ability, -2)} damage`,
      type: "norm",
    },
    norm1: {
      ap: 2,
      desc: `Deal ${normalDamageStr(cog, ability, -1)} damage`,
      type: "norm",
    },
    norm2: {
      ap: 3,
      desc: `Deal ${normalDamageStr(cog, ability, 0)} damage`,
      type: "norm",
    },
    norm3: {
      ap: 5,
      desc: `Deal ${normalDamageStr(cog, ability, 1)} damage`,
      type: "norm",
    },
    norm4: {
      ap: 7,
      desc: `Deal ${normalDamageStr(cog, ability, 2)} damage`,
      type: "norm",
    },
    // burn damage type
    burn0: {
      ap: 2,
      desc: `Deal ${specialDmgHalfL} burning damage.`,
      type: "burn",
    },
    burn1: {
      ap: 4,
      desc: `Deal ${specialDmgL} burning damage.`,
      type: "burn",
    },
    burn2: {
      ap: 6,
      desc: `Deal ${specialDmgDoubleL} burning damage.`,
      type: "burn",
    },
    // bleed damage type
    bleed0: {
      ap: 2,
      desc: `Deal ${specialDmgHalfL} bleeding damage.`,
      type: "bleed",
    },
    bleed1: {
      ap: 4,
      desc: `Deal ${specialDmgL} bleeding damage.`,
      type: "bleed",
    },
    bleed2: {
      ap: 6,
      desc: `Deal ${specialDmgDoubleL} bleeding damage.`,
      type: "bleed",
    },
    // armor damage
    armor0: {
      ap: 4,
      desc: `Deal 1 armor damage.`,
      type: "armor",
    },
    // stun damage
    stun0: {
      ap: 4,
      desc: "Deal 1 stun damage on direct hits.",
      type: "stun",
    },
    // paralysis damage
    paralysis0: {
      ap: 4,
      desc: "Deal 1 paralysis damage on direct hits.",
      type: "paralysis",
    },
    // Effects
    Adapting: {
      ap: 5,
      desc: "When this ability is used, until the start of the Cog's next turn, after resolving an attack they gain resistance to that type of attack.",
      type: "effect",
    },
    Clobbering: {
      ap: 2,
      desc: `This ability also causes the target to lose ${lvlStr(
        cog.level
      )} Vim on a direct hit, or ${lvlStr(cog.level, "L/2", (lvl) =>
        Math.round(lvl / 2)
      )} Vim on a glancing blow.`,
      type: "effect",
    },
    "Defense Breaker": {
      ap: 2,
      desc: "This ability also causes the target to lose 1 Alert after the attack resolves.",
      type: "effect",
    },
    Disorienter: {
      ap: 2,
      desc: "This ability also reduces the target's Accuracy by 5 until the end of the Encounter.",
      type: "effect",
    },
    Empower: {
      ap: specialEffectsAPMap["Empower"],
      desc: `This ability grants the Cog +${specialEffectsAPMap["Empower"]} damage for the rest of the Encounter when used.`,
      type: "effect",
      optionDetails:
        "This effect can only be taken if this ability costs Vim and/or MP. If this effect is taken, the amount of AP that can be spent on this effect is at most the amount of AP gained from spending Vim and/or MP.",
    },
    Homing: {
      ap: lvlInt(cog.level, (lvl) => lvl + 5),
      desc: "This ability cannot be Evaded.",
      type: "effect",
    },
    Knockdown: {
      ap: 1,
      desc: "On a direct hit or a failed resistance check, this ability causes the target to be knocked prone.",
      type: "effect",
    },
    "Knockback, Weak": {
      ap: 1,
      desc: `This ability also knocks the target back ${lvlStr(
        cog.level
      )} squares, or none on a glancing blow.`,
      type: "effect",
    },
    "Knockback, Strong": {
      ap: 2,
      desc: `This ability also knocks the target back ${lvlStr(
        cog.level,
        "2L",
        (lvl) => lvl * 2
      )} squares, or half on a glancing blow.`,
      type: "effect",
    },
    Intangible: {
      ap: lvlInt(cog.level, (lvl) => Math.floor(lvl / 2) + 3),
      desc: "This ability cannot be Blocked (Beginner)",
      type: "effect",
    },
    Protecting: {
      ap: specialEffectsAPMap["Protecting"],
      desc: `This ability grants the Cog +${specialEffectsAPMap["Protecting"]} Armor until the start of their next turn.`,
      type: "effect",
    },
    Piercing: {
      ap: specialEffectsAPMap["Piercing"],
      desc: `This ability ignores ${piercingEffectX} Armor.`,
      type: "effect",
    },
    Sharpen: {
      ap: specialEffectsAPMap["Sharpen"],
      desc: `This ability grants the Cog +${sharpenEffectX} Accuracy for the rest of the Encounter when used.`,
      type: "effect",
      optionDetails:
        "This effect can only be taken if this ability costs Vim and/or MP. If this effect is taken, the amount of AP that can be spent on this effect is at most the amount of AP gained from spending Vim and/or MP.",
    },
    Sickening: {
      ap: specialEffectsAPMap["Sickening"],
      desc: `On a direct hit, this ability causes the target to be sick for ${specialEffectsAPMap["Sickening"]} Rounds.`,
      type: "effect",
    },
    Silencing: {
      ap: 4,
      desc: "On a direct hit or glancing blow, this ability causes the target to be unable to speak and take a -6 penalty to casting rolls. This effect lasts until the end of the target's next turn.",
      type: "effect",
    },
    Stiffening: {
      ap: specialEffectsAPMap["Stiffening"],
      desc: `On a direct hit, this ability causes the target to be stiff for ${specialEffectsAPMap["Stiffening"]} Rounds.`,
      type: "effect",
    },
    Threatening: { ap: 1, desc: "This ability threatens the target." },
    "Mana Drain": {
      ap: 2,
      desc: `This ability also causes the target to lose ${lvlStr(
        cog.level,
        "L/2",
        (lvl) => Math.floor(lvl / 2)
      )} MP on a direct hit, or none on a glancing blow.`,
      type: "effect",
    },
    // Area of Effect
    area0: {
      ap: 2,
      desc: "This ability cannot target an empty hex. After resolving the ability, the ability also affects valid targets who are adjacent to the original target. This chain reaction repeats until there are no valid targets remaining. The ability cannot affect the same target twice.",
      type: "area",
      title: "Chain, Adjacent",
    },
    area1: {
      ap: 3,
      desc: "This ability cannot target an empty hex. After resolving the ability, the ability also affects valid targets who are within 3 meters of the original target. This chain reaction repeats until there are no valid targets remaining. The ability cannot affect the same target twice.",
      type: "area",
      title: "Chain, Long",
    },
    area2: {
      ap: 2,
      desc: "This ability targets 3 hexes in a line.",
      type: "area",
      title: "Line, Short",
    },
    area3: {
      ap: 3,
      desc: "This ability targets 6-12 hexes in a line, chosen by the Cog during creation.",
      type: "area",
      title: "Line, Medium",
    },
    area4: {
      ap: 4,
      desc: "This ability targets 30-60 hexes in a line, chosen by the Cog during creation.",
      type: "area",
      title: "Line, Long",
    },
    area5: {
      ap: 3,
      desc: "This ability also targets all adjacent hexes.",
      type: "area",
      title: "Radius, Small",
    },
    area6: {
      ap: 4,
      desc: "This ability also targets all hexes within a 2-4 meter radius, chosen by the Cog during creation.",
      type: "area",
      title: "Radius, Medium",
    },
    area7: {
      ap: 6,
      desc: "This ability also targets all hexes within a 5-12 meter radius, chosen by the Cog during creation.",
      type: "area",
      title: "Radius, Large",
    },
    area8: {
      ap: 8,
      desc: "This ability also targets all hexes within a 30 meter radius",
      type: "area",
      title: "Radius, Huge",
    },
  };
}

export function cogTypeOptionsMap(ability, optionsMap) {
  const resistanceCheck = optionsMap[ability.resistanceCheck].desc;
  return {
    normal: {
      title: "Attack, Normal",
      desc: "Acc vs Vim, can be a direct hit or glancing blow. Can be Evaded.",
      outputStr: `Acc vs Vim, can be a direct hit or glancing blow. Can be Evaded.`,
    },
    quick: {
      title: "Attack, Quick",
      desc: "AGI check, fully negated on success; a direct hit on failure. Can NOT be Evaded.",
      outputStr: `${resistanceCheck} AGI check, fully negated on success; a direct hit on failure. Can NOT be Evaded.`,
    },
    sneak: {
      title: "Attack, Sneak",
      desc: "PER check, fully negated on success; a direct hit on failure. Can NOT be Evaded.",
      outputStr: `${resistanceCheck} PER check, fully negated on success; a direct hit on failure. Can NOT be Evaded.`,
    },
    magical: {
      title: "Attack, Magical",
      desc: "SPI check, fully negated on success; a direct hit on failure. Can be Evaded.",
      outputStr: `${resistanceCheck} SPI check, fully negated on success; a direct hit on failure. Can be Evaded.`,
    },
    attribute: {
      title: "Attribute Damage",
      desc: "STR check, fully negated on success; on failure: glancing blow and the target takes 1 damage to an Attribute specified during this ability's creation. The damage may be increased to 2 for 3 AP, or 3 for 8 AP. Can be Evaded.",
      outputStr: `${resistanceCheck} STR check, fully negated on success; on failure: glancing blow and the target takes ${
        optionsMap[ability.attribute].num
      } damage to an Attribute specified during this ability's creation. Can be Evaded.`,
    },
    charm: {
      title: "Charm",
      desc: "CHA check, fully negated on success; on failure: glancing blow and the target is charmed. Can NOT be Evaded.",
      outputStr: `${resistanceCheck} CHA check, fully negated on success; on failure: glancing blow and the target is charmed. Can NOT be Evaded.`,
    },
    confusion: {
      title: "Confusion",
      desc: "INT check, fully negated on success; on failure: glancing blow and the target is confused. Can NOT be Evaded.",
      outputStr: `${resistanceCheck} INT check, fully negated on success; on failure: glancing blow and the target is confused. Can NOT be Evaded.`,
    },
    disarm: {
      title: "Disarm",
      desc: "DEX check, fully negated on success; on failure: glancing blow and target's weapon is disarmed. Can be Evaded.",
      outputStr: `${resistanceCheck} DEX check, fully negated on success; on failure: glancing blow and target's weapon is disarmed. Can be Evaded.`,
    },
    fear: {
      title: "Fear",
      desc: "WIS check, fully negated on success; on failure: glancing blow and the target takes 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn (target's choice). The damage may be increased to 2 and 5 respectively (or flee on their next turn) for 3 AP. CanNOT be Evaded. This effect cannot stack with Cogs of the same type.",
      outputStr: `${resistanceCheck} WIS check, fully negated on success; on failure: glancing blow and the target takes ${
        optionsMap[ability.fear].paralysis
      } paralysis damage and ${
        optionsMap[ability.fear].stun
      } stun damage or must flee the Cog on their next turn (target's choice). Can NOT be Evaded. This effect cannot stack with Cogs of the same type.`,
    },
  };
}

export function cogCalculateVimCost(ability) {
  const vim = parseInt(ability.vimCost);
  if (isNaN(vim) || vim < 0) {
    return 0;
  }
  return vim * 5;
}

export function cogCalculateMPCost(ability) {
  const mp = parseInt(ability.mpCost);
  if (isNaN(mp) || mp < 0) {
    return 0;
  }
  return mp;
}

export function cogResistantCheckRequired(ability) {
  return [
    "quick",
    "sneak",
    "magical",
    "attribute",
    "charm",
    "confusion",
    "disarm",
    "fear",
  ].includes(ability.type);
}

export function cogOption2AP(optionsMap, option) {
  if (optionsMap[option] !== undefined && optionsMap[option].ap !== undefined) {
    return optionsMap[option].ap;
  }
  return 0;
}

function cogOption2APNumber(optionsMap, option) {
  // ensures the response is a number and never a string
  const ap = cogOption2AP(optionsMap, option);
  return isNaN(ap) ? 0 : ap;
}

export function cogAbilityCostAP(ability, optionsMap) {
  let ap = 0;

  ap = ap + cogOption2APNumber(optionsMap, ability.range);
  ap = ap + cogOption2APNumber(optionsMap, ability.speed);

  // Resource Cost
  ap = ap - cogCalculateVimCost(ability) / 5;
  ap = ap - cogCalculateMPCost(ability);

  // Ability Type
  if (cogResistantCheckRequired(ability)) {
    ap = ap + cogOption2APNumber(optionsMap, ability.resistanceCheck);
  }
  if (ability.type === "attribute") {
    ap = ap + cogOption2APNumber(optionsMap, ability.attribute);
  }
  if (ability.type === "fear") {
    ap = ap + cogOption2APNumber(optionsMap, ability.fear);
  }

  // Damage Types
  if (!ability.zeroDamage) {
    ap = ap + cogOption2APNumber(optionsMap, ability.normalDamage);
    ap = ap + cogOption2APNumber(optionsMap, ability.burningDamage);
    ap = ap + cogOption2APNumber(optionsMap, ability.bleedingDamage);
    ap = ap + cogOption2APNumber(optionsMap, ability.armorDamage);
    ap = ap + cogOption2APNumber(optionsMap, ability.stunDamage);
    ap = ap + cogOption2APNumber(optionsMap, ability.paralysisDamage);
  }

  // Special Effects
  ap =
    ap +
    ability.effects.reduce(
      (sum, effect) => sum + cogOption2APNumber(optionsMap, effect),
      0
    );

  // Area Effects
  ap = ap + cogOption2APNumber(optionsMap, ability.areaEffect);

  // Special Cases
  if (cogOption2AP(optionsMap, ability.speed) === "x2") {
    ap = ap * 2;
  }
  return ap;
}

export function cogFormattedAbility(cog, ability, optionsMap) {
  if (!optionsMap) {
    // if optionsMap is not precalculated, we will calculate it here
    optionsMap = cogAbilitiesOptionsMap(cog, ability);
  }
  // calculate activation costs
  const activationList = [optionsMap[ability.speed].desc];
  const costMap = { A: parseInt(optionsMap[ability.speed].desc) };
  const vimCost = cogCalculateVimCost(ability);
  if (vimCost > 0) {
    activationList.push(vimCost + " Vim");
    costMap.V = vimCost;
  }
  const mpCost = cogCalculateMPCost(ability);
  if (mpCost > 0) {
    activationList.push(mpCost + " MP");
    costMap.M = mpCost;
  }
  const activation = activationList.join(", ");
  // calculate effect
  const typeOptionsMap = cogTypeOptionsMap(ability, optionsMap);
  const type = `${typeOptionsMap[ability.type].title}: ${
    typeOptionsMap[ability.type].outputStr
  }`;
  const abilityEffects = [type];
  // - damage effects
  const damageCount = cogDamageTypes
    .map((damage) => ability[damage])
    .filter((choice) => choice !== "").length;
  if (!ability.zeroDamage && damageCount > 0) {
    const preStr = damageCount === 1 ? "" : "- "; // if there is more than 1 damage type, make it a list
    cogDamageTypes.forEach((damage) => {
      if (ability[damage] !== "") {
        abilityEffects.push(preStr + optionsMap[ability[damage]].desc);
      }
    });
  }
  // - special effects
  if (ability.effects.length > 0) {
    abilityEffects.push("Special Effects:");
    ability.effects.forEach((effect) =>
      abilityEffects.push(`- ${effect}: ${optionsMap[effect].desc}`)
    );
  }
  // - area effects
  if (optionsMap[ability.areaEffect] !== undefined) {
    abilityEffects.push(`Area Effect: ${optionsMap[ability.areaEffect].desc}`);
  }
  const effect = abilityEffects.join("\n"); // split by newline to match backend webscraper
  // AP cost
  const ap = cogAbilityCostAP(ability, optionsMap);
  return {
    name: ability.name,
    purchase: `${ap} AP`,
    range: optionsMap[ability.range].desc,
    activation,
    cost: costMap,
    effect,
    // special cogAbility fields
    specialAbilityType: COG_ABILITY_TYPE,
    ap,
  };
}
