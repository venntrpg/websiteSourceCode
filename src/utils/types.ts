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

type ServerItem = {
  id: string;
  id2?: string; // used when updating an item
  name?: string;
  bulk?: number;
  desc?: string;
  type?: string;
  courses?: string;
  comment?: string;
  category?: string;
  weapon_type?: string;
  range?: string;
  attr?: string;
  dmg?: string;
  special?: string;
  equipped?: boolean;
};

type Ability = {
  name: string;
  effect: string;
  cost: object;
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
