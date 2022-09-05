import indefinite from "indefinite";
import pluralize from "pluralize";
import items from "./data/items.json";
import weaponTypes from "./data/weaponTypes.json";
import { localItem2Server } from "../api/apiUtil";
import { improveTextForDisplay } from "./characterStringFormatting";

export const itemList = items;
export const weaponTypesList = weaponTypes;

export const defaultWeaponCategories = ["Unarmed", "Improvised"];
export const defaultWeapons = defaultWeaponCategories.map((category) => {
  const found = weaponTypes.find((weapon) => weapon.category === category);
  if (!found) {
    return found;
  }
  const name = `${category} Attack`;
  return { ...found, name, id: name, ids: [name] };
});
export const defaultWeaponNames = defaultWeapons.map((weapon) => weapon.name);

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

export function calculateItemArmor(items) {
  if (!items) {
    return undefined;
  }
  const res = { armor: 0, burden: 0, shield: 0, items: [] };
  const releventTypes = ["armor", "shield"];
  const key2Match = {
    armor: /Armor Value: (\d+)/,
    burden: /Burden: (\d+)/,
    shield: /Shield Bonus: ([+-]*\d+)/,
  };
  const specialItems = { "Backpack, Armored": { armor: 2 } };
  items.forEach((item) => {
    // only include equipped armor & shields
    if (item.type && releventTypes.includes(item.type) && item.equipped) {
      Object.entries(key2Match).forEach(([key, regex]) => {
        const found = item.desc.match(regex);
        if (found && found.length > 1) {
          const num = parseInt(found[1]); // use capture group
          if (!isNaN(num)) {
            res[key] += num;
          }
        }
      });
      res.items.push(item);
    } else if (specialItems[item.name]) {
      const map = specialItems[item.name];
      Object.entries(map).forEach(([key, val]) => {
        res[key] += val;
      });
      res.items.push(item);
    }
  });
  return res;
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
