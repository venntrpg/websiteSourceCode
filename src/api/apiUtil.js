/**
 * Gets the user's current authentication which is used for most API calls
 * @returns auth string
 */
export function getAuth() {
  const auth = localStorage.getItem("auth");
  if (auth === null) {
    throw new Error("Not logged in");
  }
  return auth;
}

// type: n means the field is a number and should be converted if it is not passed in as a number
// edit: true means the attribute can be edited using an edit modal
const attrsToServerNames = {
  name: { server: "name", edit: true },
  id: { server: "id" },
  agi: { server: "AGI", type: "n", edit: true },
  cha: { server: "CHA", type: "n", edit: true },
  dex: { server: "DEX", type: "n", edit: true },
  int: { server: "INT", type: "n", edit: true },
  per: { server: "PER", type: "n", edit: true },
  spi: { server: "SPI", type: "n", edit: true },
  str: { server: "STR", type: "n", edit: true },
  tek: { server: "TEK", type: "n", edit: true },
  wis: { server: "WIS", type: "n", edit: true },
  hp: { server: "HP", type: "n", edit: true },
  maxHp: { server: "MAX_HP", type: "n", edit: true },
  mp: { server: "MP", type: "n", edit: true },
  maxMp: { server: "MAX_MP", type: "n", edit: true },
  vim: { server: "VIM", type: "n", edit: true },
  maxVim: { server: "MAX_VIM", type: "n", edit: true },
  hero: { server: "HERO", type: "n", edit: true },
  maxHero: { server: "MAX_HERO", type: "n", edit: true },
  template: { server: "TEMPLATE" },
  cogType: { server: "COG_TYPE" },
  level: { server: "LEVEL", type: "n", edit: true },
  acc: { server: "ACC", type: "n", edit: true },
  radius: { server: "RADIUS", type: "n", edit: true },
  reach: { server: "REACH", type: "n", edit: true },
  init: { server: "INIT", type: "n", edit: true },
  speed: { server: "SPEED", type: "n", edit: true },
  xp: { server: "XP", type: "n", edit: true },
  sp: { server: "SP", type: "n", edit: true },
  armor: { server: "ARMOR", type: "n", edit: true },
  notes: { server: "NOTES" },
  gift: { server: "gift", edit: true },
  isEnemy: { server: "is_enemy" },
  items: { server: "items" },
  abilities: { server: "abilities" },
  changelog: { server: "changelog" },
};

// inverse of attrsToServerNames
const attrsFromServerNames = {};
Object.entries(attrsToServerNames).forEach((pair) => {
  const localAttr = pair[0];
  const serverAttr = pair[1].server;
  const type = pair[1].type;
  const map = { local: localAttr };
  if (type !== undefined) {
    map.type = type;
  }
  attrsFromServerNames[serverAttr] = map;
});

export function attrIsEditable(attr) {
  return attrsToServerNames[attr] && attrsToServerNames[attr].edit === true;
}

export function attrIsNumber(attr) {
  return attrsToServerNames[attr] && attrsToServerNames[attr].type === "n";
}

export function localAttr2Server(attr) {
  const foundAttr = attrsToServerNames[attr];
  if (foundAttr) {
    return foundAttr.server;
  }
  return attr.toUpperCase();
}

export function serverItem2Local(item) {
  if (item.weapon_type) {
    item.weaponType = item.weapon_type;
    delete item.weapon_type;
  }
  return item;
}

export function localItem2Server(item) {
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
    if (field in item) {
      cleaned[field] = item[field];
    }
  });
  if (item.weaponType) {
    cleaned.weapon_type = item.weaponType;
  }
  if (item.id) {
    cleaned.id2 = item.id;
  }
  return cleaned;
}

export function serverCharacter2Local(character) {
  const result = {};
  Object.entries(character).forEach((pair) => {
    const serverAttr = pair[0];
    const val = pair[1];
    const map = attrsFromServerNames[serverAttr];
    if (map !== undefined) {
      if (map.type === "n") {
        const converted = parseInt(val);
        if (isNaN(converted)) {
          result[map.local] = 0;
        } else {
          result[map.local] = converted;
        }
      } else {
        result[map.local] = val;
      }
    }
  });
  if (!("changelog" in character)) {
    character.changelog = [];
  }
  result.changelog = character.changelog.map((log) => {
    const serverAttr = log.attr;
    const map = attrsFromServerNames[serverAttr];
    if (map !== undefined) {
      log.attr = map.local;
      if ("prev" in log && map.type === "n") {
        log.prev = parseInt(log.prev);
      }
    }
    return log;
  });
  result.items = character.items.map((item) => serverItem2Local(item));
  return result;
}

export function localCharacter2Server(character, convertItems = false) {
  const result = {};
  Object.entries(character).forEach((pair) => {
    result[localAttr2Server(pair[0])] = pair[1];
  });
  if (convertItems && character.items) {
    result.items = character.items.map((item) => localItem2Server(item));
  }
  return result;
}
