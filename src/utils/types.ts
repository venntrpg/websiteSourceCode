type ServerResponse = {
  success: boolean;
  value?: any;
  info?: string;
  matches?: string[];
};

type Item = {
  id: string;
  name: string;
  bulk: number;
  desc: string;
  type?: string;
  courses?: string;
  comment?: string;
  category?: string;
  weaponType?: string;
  range?: string;
  attr?: string;
  dmg?: string;
  special?: string;
  equipped?: boolean;
};

type ConsolidatedItem = Item & {
  ids: string[];
};

type ServerItem = Item & {
  weapon_type?: string;
  id?: string;
  id2?: string; // sometimes used for updating item details
};

type Uses = {
  roll?: {
    dice: string;
    attr: string;
  };
  heal?: {
    attr: { [attr: string]: number };
  };
  adjust?: {
    time: "turn" | "encounter" | "rest" | "permanent";
    attr: { [attr: string]: number | string };
  };
  check?: {
    bonus: string;
    attr: string;
  };
};

type ShopItem = {
  name?: string;
  bulk: number;
  desc: string;
  type: string;
  section?: string;
  courses?: string;
  category?: string;
  weaponType?: string;
  range?: string;
  attr?: string;
  dmg?: string;
  special?: string;
  cost: string;
  sp?: number;
  examples?: string;
  uses?: Uses;
};

type AbilityCost = {
  A: number;
  R: number;
  M: number;
  V: number;
  P: number;
  Attack: boolean;
  Passive: boolean;
  Special: string;
};

type Ability = {
  name: string;
  effect: string;
  cost: AbilityCost;
  purchase?: string;
  expedited?: string;
  unlocks?: string;
  partial_unlocks?: string;
  prereq?: string;
  mp_cost?: string[] | number[];
  cast_dl?: string[] | number[];
  build_dc?: string;
  build_time?: string;
  activation?: string;
  range?: string;
  not_required?: boolean;
  flavor?: string;
  path?: string;
  special_ability_type?: string;
  ap?: number;
};

type ChangelogRow = {
  attr: string;
  msg: string;
  time: number;
  prev?: number | string;
};

// Might not be useful idk
type CharacterReqStrAttrs = "id" | "name" | "gift";
type CharacterOptStrAttrs = "template" | "cogType" | "notes";
type CharacterReqNumAttrs =
  | "per"
  | "tek"
  | "agi"
  | "dex"
  | "int"
  | "spi"
  | "str"
  | "wis"
  | "cha"
  | "hp"
  | "maxHp"
  | "mp"
  | "maxMp"
  | "vim"
  | "maxVim"
  | "hero"
  | "maxHero"
  | "init"
  | "speed"
  | "xp"
  | "sp"
  | "armor";
type CharacterOptNumAttrs = "level" | "acc" | "radius" | "reach";

type CharacterStrAttrs = CharacterReqStrAttrs | CharacterOptStrAttrs;
type CharacterNumAttrs = CharacterReqNumAttrs | CharacterOptNumAttrs;
type CharacterBoolAttrs = "isEnemy";
type CharacterAttrs = CharacterStrAttrs | CharacterNumAttrs;

type Character = {
  id: string;
  name: string;
  agi: number;
  cha: number;
  dex: number;
  int: number;
  per: number;
  spi: number;
  str: number;
  tek: number;
  wis: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  vim: number;
  maxVim: number;
  hero: number;
  maxHero: number;
  template?: string;
  cogType?: string;
  level?: number;
  acc?: number;
  radius?: number;
  reach?: number;
  init: number;
  speed: number;
  xp: number;
  sp: number;
  armor: number;
  notes?: string;
  gift: string;
  isEnemy: boolean;
  items: Item[];
  abilities: Ability[];
  changelog: ChangelogRow[];
};

type AttributeAdjustments = {
  [attr in keyof Character]?: number;
};

type CharacterAttributes = {
  [attr: string]: {
    val: number | string;
    original?: number | string;
    items: Item[];
    abilities: Ability[];
  };
};

type ServerCharacter = {
  id: string;
  name: string;
  AGI: number | string;
  CHA: number | string;
  DEX: number | string;
  INT: number | string;
  PER: number | string;
  SPI: number | string;
  STR: number | string;
  TEK: number | string;
  WIS: number | string;
  HP: number | string;
  MAX_HP: number | string;
  MP: number | string;
  MAX_MP: number | string;
  VIM: number | string;
  MAX_VIM: number | string;
  HERO: number | string;
  MAX_HERO: number | string;
  TEMPLATE?: string;
  COG_TYPE?: string;
  LEVEL?: number | string;
  ACC?: number | string;
  RADIUS?: number | string;
  REACH?: number | string;
  INIT: number | string;
  SPEED: number | string;
  XP: number | string;
  SP: number | string;
  ARMOR: number | string;
  NOTES?: string;
  gift: string;
  is_enemy: boolean;
  items: ServerItem[];
  abilities: Ability[];
  changelog: ChangelogRow[];
};

type PartialServerCharacter = {
  [attr in keyof ServerCharacter]?:
    | string
    | number
    | boolean
    | ServerItem[]
    | Ability[]
    | ChangelogRow[];
};

type DiceToggle = {
  attr?: string;
  end?: string;
  diceNumberAdjust?: number;
  default?: boolean; // currently not really supported
};
type DiceToggles = {
  [key: string]: DiceToggle;
};

type DiceSettings = {
  explodes?: boolean;
  rr1s?: boolean;
  drop?: number;
  fatigued?: boolean;
  end?: string;
  flow?: boolean;
  ebb?: boolean;
  otherToggles?: {
    [key: string]: {
      toggled: boolean;
    };
  };
};

// temporary definition until I improve the way temporary attr adjustments are calculated:
type ItemArmorAdjustment = {
  armor: number;
  burden: number;
  shield: number;
  items: Item[];
};

// ------------------------- VUEX ------------------------- //

type RootState = {
  isLoggedIn: boolean;
  username: string;
  signupErrorMsg: string;
  loginErrorMsg: string;
  pendingApis: { [api: string]: boolean | number };
};

type CharacterState = {
  characters: { [id: string]: Character };
  character: Character;
  searchAbility: string;
  searchAbilitySuggestions: string[];
  searchAbilityError: string;
  levelsToProcess: number;
};

type DiceState = {
  latestRoll: {
    [key: string]: null | any; // TODO: Replace with the dice roller type
  };
  defaultDiceSettings: DiceSettings;
  diceDropDown: boolean;
  useBuiltinDice: boolean;
};

type OtherState = {
  randomNames: string[];
  randomNamesDisabled: boolean;
};
