import indefinite from "indefinite";
import pluralize from "pluralize";
import items from "./data/items.json";
import weaponTypes from "./data/weaponTypes.json";
import { localItem2Server } from "../api/apiUtil";
import { improveTextForDisplay } from "./characterStringFormatting";

export const itemList = items;
export const weaponTypesList = weaponTypes;

export function keys2Items(keys) {
  return keys
    .map((key) => items.find((item) => key === item.name))
    .filter((item) => item !== undefined)
    .map((item) => localItem2Server(item));
}

export function consolidateItemList(givenItems) {
  if (givenItems === undefined) {
    return [];
  }
  const items = [];
  givenItems.forEach((item) => {
    const foundItem = items.find(
      (search) =>
        search.name === item.name &&
        search.bulk === item.bulk &&
        search.desc === item.desc
    );
    if (foundItem === undefined) {
      items.push({ ...item, ids: [item.id] });
    } else {
      foundItem.ids.push(item.id);
    }
  });
  return items;
}

export function prefixName(item, action = "", cleanup = false) {
  let name = item.name;
  if (action !== "") {
    const commaPos = name.search(/,|\*| \(/gm);
    let word = item.name;
    let rest = "";
    if (commaPos >= 0) {
      word = item.name.substring(0, commaPos);
      rest = item.name.substring(commaPos);
    }
    if (pluralize.isPlural(word) || isSpecialPlural(word)) {
      name = `${action} ${item.name}`;
    } else {
      name = `${action} ${indefinite(word)}${rest}`;
    }
  }
  if (cleanup) {
    name = improveTextForDisplay(name);
  }
  return name;
}

function isSpecialPlural(name) {
  const plurals = ["Ammunition", "Ammo", "Armor", "Alcohol", "Rust"];
  return plurals.some((word) => name.includes(word));
}

export function pluralizeName(item, cleanup = false) {
  let name = item.name;
  const commaPos = name.search(/,|\*| \(/gm);
  let word = item.name;
  let rest = "";
  if (commaPos >= 0) {
    word = item.name.substring(0, commaPos);
    rest = item.name.substring(commaPos);
  }
  if (!(pluralize.isPlural(word) || isSpecialPlural(word))) {
    name = `${pluralize(word)}${rest}`;
  }
  if (cleanup) {
    name = improveTextForDisplay(name);
  }
  return name;
}
