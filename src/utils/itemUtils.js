import items from "./data/items.json";
import weaponTypes from "./data/weaponTypes.json";
import { localItem2Server } from "../api/apiUtil";

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
