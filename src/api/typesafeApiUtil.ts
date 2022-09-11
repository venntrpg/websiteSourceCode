/* 
NOTE ABOUT THIS FILE:
After converting this file to TS, I think it may actually be simpler to use
as a less type safe JS file but make it more flexible as a result.
If I end up changing my opinion there, I will use this one instead.
*/

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
const attrsToServerNames: {
  [local in keyof Character]: {
    server: keyof ServerCharacter;
    type?: "b" | "n" | "s";
    edit?: boolean;
  };
} = {
  id: { server: "id", type: "s" },
  name: { server: "name", type: "s", edit: true },
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
  template: { server: "TEMPLATE", type: "s" },
  cogType: { server: "COG_TYPE", type: "s" },
  level: { server: "LEVEL", type: "n", edit: true },
  acc: { server: "ACC", type: "n", edit: true },
  radius: { server: "RADIUS", type: "n", edit: true },
  reach: { server: "REACH", type: "n", edit: true },
  init: { server: "INIT", type: "n", edit: true },
  speed: { server: "SPEED", type: "n", edit: true },
  xp: { server: "XP", type: "n", edit: true },
  sp: { server: "SP", type: "n", edit: true },
  armor: { server: "ARMOR", type: "n", edit: true },
  notes: { server: "NOTES", type: "s" },
  gift: { server: "gift", type: "s", edit: true },
  isEnemy: { server: "is_enemy", type: "b" },
  items: { server: "items" },
  abilities: { server: "abilities" },
  changelog: { server: "changelog" },
};

// inverse of attrsToServerNames
type LocalAttrDetail = { local: keyof Character; type?: string };
const attrsFromServerNames: {
  [server in keyof ServerCharacter]?: LocalAttrDetail;
} = {};
Object.entries(attrsToServerNames).forEach((pair) => {
  if (pair[1] === undefined) {
    return;
  }
  const localAttr = pair[0];
  const serverAttr = pair[1].server;
  const type = pair[1].type;
  const map: LocalAttrDetail = { local: localAttr as keyof Character };
  if (type !== undefined) {
    map.type = type;
  }
  attrsFromServerNames[serverAttr] = map;
});

export function attrIsEditable(attr: keyof Character) {
  const serverDetails = attrsToServerNames[attr];
  return serverDetails && serverDetails.edit === true;
}

export function attrIsNumber(attr: keyof Character) {
  const serverDetails = attrsToServerNames[attr];
  return serverDetails && serverDetails.type === "n";
}

export function localAttr2Server(attr: keyof Character) {
  const foundAttr = attrsToServerNames[attr];
  if (foundAttr) {
    return foundAttr.server;
  }
  return attr.toUpperCase();
}

export function serverItem2Local(item: ServerItem) {
  const local: Item = item;
  if (item.weapon_type) {
    local.weaponType = item.weapon_type;
  }
  return local;
}

export function localItem2Server(item: Item) {
  const cleaned: ServerItem = item;
  if (item.weaponType) {
    cleaned.weapon_type = item.weaponType;
  }
  if (item.id) {
    cleaned.id2 = item.id;
  }
  return cleaned;
}

export function serverCharacter2Local(character: ServerCharacter) {
  const result: Character = {
    id: "",
    name: "",
    agi: 0,
    cha: 0,
    dex: 0,
    int: 0,
    per: 0,
    spi: 0,
    str: 0,
    tek: 0,
    wis: 0,
    hp: 0,
    maxHp: 0,
    mp: 0,
    maxMp: 0,
    vim: 0,
    maxVim: 0,
    hero: 0,
    maxHero: 0,
    init: 0,
    speed: 0,
    xp: 0,
    sp: 0,
    armor: 0,
    gift: "",
    isEnemy: false,
    items: [],
    abilities: [],
    changelog: [],
  };
  Object.entries(character).forEach((pair) => {
    const serverAttr = pair[0];
    const val = pair[1];
    const map = attrsFromServerNames[serverAttr as keyof ServerCharacter];
    if (map !== undefined) {
      if (
        map.type === "n" &&
        (typeof val === "string" || typeof val === "number")
      ) {
        let converted = typeof val === "number" ? val : parseInt(val);
        if (isNaN(converted)) {
          converted = 0;
        }
        result[map.local as CharacterNumAttrs] = converted;
      } else if (map.type === "s" && typeof val === "string") {
        result[map.local as CharacterStrAttrs] = val;
      } else if (map.type === "b" && typeof val === "boolean") {
        result[map.local as CharacterBoolAttrs] = val;
      }
    }
  });
  result.changelog = character.changelog.map((log) => {
    const serverAttr = log.attr;
    const map = attrsFromServerNames[serverAttr as keyof ServerCharacter];
    if (map !== undefined) {
      log.attr = map.local;
      if (map.type === "n" && typeof log.prev === "string") {
        log.prev = parseInt(log.prev);
      }
    }
    return log;
  });
  result.items = character.items.map((item) => serverItem2Local(item));
  result.abilities = character.abilities;
  return result;
}

export function localCharacter2Server(character: Character) {
  const result: PartialServerCharacter = {};
  Object.entries(character).forEach((pair) => {
    result[
      localAttr2Server(pair[0] as keyof Character) as keyof ServerCharacter
    ] = pair[1];
  });
  return result;
}
