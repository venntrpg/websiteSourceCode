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
const attrsToServerNames = {
  name: { server: "name" },
  id: { server: "id" },
  agi: { server: "AGI", type: "n" },
  cha: { server: "CHA", type: "n" },
  dex: { server: "DEX", type: "n" },
  int: { server: "INT", type: "n" },
  per: { server: "PER", type: "n" },
  spi: { server: "SPI", type: "n" },
  str: { server: "STR", type: "n" },
  tek: { server: "TEK", type: "n" },
  wis: { server: "WIS", type: "n" },
  hp: { server: "HP", type: "n" },
  maxHp: { server: "MAX_HP", type: "n" },
  mp: { server: "MP", type: "n" },
  maxMp: { server: "MAX_MP", type: "n" },
  vim: { server: "VIM", type: "n" },
  maxVim: { server: "MAX_VIM", type: "n" },
  hero: { server: "HERO", type: "n" },
  maxHero: { server: "MAX_HERO", type: "n" },
  maxBulk: { server: "MAX_BULK", type: "n" },
  template: { server: "TEMPLATE" },
  cogType: { server: "COG_TYPE" },
  level: { server: "LEVEL", type: "n" },
  acc: { server: "ACC", type: "n" },
  radius: { server: "RADIUS", type: "n" },
  reach: { server: "REACH", type: "n" },
  init: { server: "INIT", type: "n" },
  speed: { server: "SPEED", type: "n" },
  xp: { server: "XP", type: "n" },
  sp: { server: "SP", type: "n" },
  armor: { server: "ARMOR", type: "n" },
  notes: { server: "NOTES" },
  gift: { server: "gift" },
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

export function localAttr2Server(attr) {
  const foundAttr = attrsToServerNames[attr];
  if (foundAttr) {
    return foundAttr.server;
  }
  return attr.toUpperCase();
}

export function serverCharacter2Local(character) {
  const result = {};
  Object.entries(character).forEach((pair) => {
    const serverAttr = pair[0];
    const val = pair[1];
    const map = attrsFromServerNames[serverAttr];
    if (map !== undefined) {
      if (map.type === "n") {
        result[map.local] = parseInt(val);
      } else {
        result[map.local] = val;
      }
    }
  });
  // TODO: Convert changelog also
  return result;
}

export function localCharacter2Server(character) {
  const result = {};
  Object.entries(character).forEach((pair) => {
    result[localAttr2Server(pair[0])] = pair[1];
  });
  return result;
}
