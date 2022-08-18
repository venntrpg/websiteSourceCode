import items from "./data/items.json";
import weaponTypes from "./data/weaponTypes.json";

export const itemList = items;
export const weaponTypesList = weaponTypes;

export function convertToValidItem(item) {
  const cleaned = {};
  const basicFields = [
    "name",
    "bulk",
    "desc",
    "type",
    "courses",
    "comment",
    "category",
    "range",
    "attr",
    "dmg",
    "special",
    "equipped",
  ];
  basicFields.forEach((field) => {
    if (item[field]) {
      cleaned[field] = item[field];
    }
  });
  if (item.weaponType) {
    cleaned.weapon_type = item.weaponType;
  }
  return cleaned;
}

export function keys2Items(keys) {
  return keys
    .map((key) => items.find((item) => key === item.name))
    .filter((item) => item !== undefined)
    .map((item) => convertToValidItem(item));
}

export function consolidateItemList(givenItems) {
  if (givenItems === undefined) {
    return [];
  }
  const items = [];
  givenItems.forEach((item) => {
    const foundItem = items.find(
      (i) =>
        i.name === item.name && i.bulk === item.bulk && i.desc === item.desc
    );
    if (foundItem === undefined) {
      items.push({ ...item, ids: [item.id] });
    } else {
      foundItem.ids.push(item.id);
    }
  });
  return items;
}
