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
