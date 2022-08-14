import items from "./data/items.json";

export const itemList = items;

export function convertToValidItem(item) {
  return {
    name: item.name,
    type: item.type,
    bulk: item.bulk,
    desc: item.desc,
    courses: item.courses,
  };
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
