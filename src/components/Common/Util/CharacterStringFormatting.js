import { cogTypeTitle } from "../../EnemyPage/CogFlowUtils/CogTypeDescriptionUtils";
import {
  COG_ABILITY_TYPE,
  COG_TRAIT_TYPE,
  COG_WEAKNESS_TYPE,
} from "../../EnemyPage/CogFlowUtils/CogConstants";
import { consolidateItemList } from "./ItemUtils";
import { attributes } from "../../../store/constants";

function formatBasicAttributes(character) {
  let characterText = "\n";
  attributes.forEach((attr) => {
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
  let characterText = `${character.name}\nLevel ${Math.floor(
    character.xp / 1000
  )}\nInit: ${character.init}\nHP: ${character.maxHp}\nVim: ${
    character.maxVim
  }\nMP: ${character.maxMp}\nSpeed: ${character.speed}`;
  if (character.armor > 0) {
    characterText += `\nArmor: ${character.armor}`;
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
