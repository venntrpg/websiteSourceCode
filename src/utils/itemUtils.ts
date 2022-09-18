import indefinite from "indefinite";
import pluralize from "pluralize";
import items from "./data/items.json";
import weaponTypes from "./data/weaponTypes.json";
import { improveTextForDisplay } from "./characterStringFormatting";

export const itemList = items as ShopItem[];
export const weaponTypesList = weaponTypes as ShopItem[];

export const defaultWeaponCategories = ["Unarmed", "Improvised"];
export const defaultWeapons = defaultWeaponCategories.map((category) => {
  const found = weaponTypesList.find((weapon) => weapon.category === category);
  if (!found) {
    return found;
  }
  const name = `${category} Attack`;
  return { ...found, name, id: name, ids: [name] };
});
export const defaultWeaponNames = defaultWeapons.map(
  (weapon) => weapon && weapon.name
);

export function keys2Items(keys: string[]) {
  return keys
    .map((key) => itemList.find((item) => key === item.name))
    .filter((item) => item !== undefined);
}

export function getShopItem(item: Item) {
  const found = itemList.find(
    (it) =>
      it.name === item.name &&
      it.type === item.type &&
      it.bulk === item.bulk &&
      it.desc === item.desc
  );
  if (found) {
    return found;
  }
  return weaponTypesList.find((weapon) => weapon.category === item.category);
}

export function consolidateItemList(givenItems: Item[]) {
  if (givenItems === undefined) {
    return [];
  }
  const items: ConsolidatedItem[] = [];
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

export function prefixName(item: Item, action = "", cleanup = false) {
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

function isSpecialPlural(name: string) {
  const plurals = ["Ammunition", "Ammo", "Armor", "Alcohol", "Rust"];
  return plurals.some((word) => name.includes(word));
}

export function pluralizeName(item: Item, cleanup = false) {
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
