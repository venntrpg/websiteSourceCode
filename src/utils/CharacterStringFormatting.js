import { cogTypeTitle } from "../components/EnemyPage/CogFlowUtils/CogTypeDescriptionUtils";
import {
  COG_ABILITY_TYPE,
  COG_TRAIT_TYPE,
  COG_WEAKNESS_TYPE,
} from "../components/EnemyPage/CogFlowUtils/CogConstants";
import { consolidateItemList } from "./itemUtils";
import { ATTRIBUTES } from "./constants";

function formatBasicAttributes(character) {
  let characterText = "\n";
  ATTRIBUTES.forEach((attr) => {
    characterText += `${attr.toUpperCase()}: ${character[attr]}  `;
  });
  characterText += "\n\n";
  return characterText;
}

function formatItem(item) {
  let itemStr = item.name;
  if (item.type) {
    itemStr += ` (${item.type})`;
  }
  itemStr += `\nBulk: ${item.bulk}\nCount: ${item.ids.length}\n${item.desc}\n\n`;
  return itemStr;
}

function formatAbility(ability) {
  let abilityStr = `${ability.name}\nActivation: ${ability.activation}\n`;
  if (ability.range !== undefined) {
    abilityStr += `Range: ${ability.range}\n`;
  }
  abilityStr += ability.effect;
  if (ability.effect.endsWith("\n")) {
    abilityStr += "\n";
  } else {
    abilityStr += "\n\n";
  }
  return abilityStr;
}

export function convertCharacter(character) {
  if (Object.keys(character).length === 0) {
    return "";
  }
  let characterText = `${character.name}\nLevel ${Math.floor(
    character.xp / 1000
  )} (${character.xp} XP)`;
  if (character.gift) {
    characterText += `\nGift: ${character.gift}`;
  }
  characterText +=
    `\nInit: ${character.init}\nHP: ${character.maxHp}\n` +
    `Vim: ${character.maxVim}\nMP: ${character.maxMp}\nSpeed: ${character.speed}`;
  if (character.armor > 0) {
    characterText += `\nArmor: ${character.armor}`;
  }
  if (character.sp > 0) {
    characterText += `\nSP: ${character.sp}`;
  }

  characterText += formatBasicAttributes(character);

  const items = consolidateItemList(character.items);
  if (items.length > 0) {
    characterText += "\n\nInventory:\n";
    characterText += items.map((item) => formatItem(item)).join("");
  }

  if (character.abilities.length > 0) {
    characterText += "\n\nAbilities:\n";
    characterText += character.abilities
      .map((ability) => formatAbility(ability))
      .join("");
  }

  return characterText;
}

export function convertCombatCogFoe(character) {
  if (Object.keys(character).length === 0) {
    return "";
  }
  const template =
    character.template.length > 0
      ? character.template.charAt(0).toUpperCase() + character.template.slice(1)
      : "";
  let characterText = `${character.name}\nLevel ${
    character.level
  } ${template} ${cogTypeTitle(character.cogType)}\nInit: ${
    character.init
  }\nHP: ${character.maxHp}\nVim: ${character.maxVim}\nMP: ${
    character.maxMp
  }\nSpeed: ${character.speed}`;
  if (character.armor > 0) {
    characterText += `\nArmor: ${character.armor}`;
  }

  characterText += formatBasicAttributes(character);

  const abilities = character.abilities.filter(
    (ability) => ability.special_ability_type === COG_ABILITY_TYPE
  );
  if (abilities.length > 0) {
    characterText += "\n\nAbilites:\n";
    abilities.forEach((ability) => {
      characterText += formatAbility(ability);
    });
  }

  const traits = character.abilities.filter(
    (ability) => ability.special_ability_type === COG_TRAIT_TYPE
  );
  if (traits.length > 0) {
    characterText += "\n\nTraits:\n";
    traits.forEach((ability) => {
      characterText += formatAbility(ability);
    });
  }

  const weaknesses = character.abilities.filter(
    (ability) => ability.special_ability_type === COG_WEAKNESS_TYPE
  );
  if (weaknesses.length > 0) {
    characterText += "\n\nWeaknesses:\n";
    weaknesses.forEach((ability) => {
      characterText += formatAbility(ability);
    });
  }

  return characterText;
}

export function improveTextForDisplay(text) {
  // regex from https://leancrew.com/all-this/2010/11/smart-quotes-in-javascript/
  text = text.replace(/(^|[-\u2014\s(["])'/g, "$1\u2018"); // opening singles
  text = text.replace(/'/g, "\u2019"); // closing singles & apostrophes
  text = text.replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  text = text.replace(/"/g, "\u201d"); // closing doubles
  text = text.replace(/--/g, "\u2014"); // em-dashes
  return text;
}

export function stringToLinkID(str) {
  str = str.replace(/[ (),'":*]/gm, "-");
  str = str.replace(/\./gm, "_");
  str = str.replace(/[^a-zA-Z0-9-_:.]/gm, ""); // remove any invalid characters
  return "link-" + str;
}
