/*
// how to test actual vue components / which feels pretty useless
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
*/

import {
  adjustAttrsObject,
  characterAttributesMap,
} from "@/utils/attributeUtils";
import { keys2Items } from "@/utils/itemUtils";

function getDefaultCharacter(): Character {
  return {
    id: "example id",
    name: "example name",
    agi: 1,
    cha: 1,
    dex: 1,
    int: 1,
    per: 1,
    spi: 1,
    str: 1,
    tek: 1,
    wis: 1,
    hp: 10,
    maxHp: 10,
    mp: 10,
    maxMp: 10,
    vim: 10,
    maxVim: 20,
    hero: 10,
    maxHero: 10,
    init: 0,
    speed: 0,
    xp: 0,
    sp: 0,
    armor: 0,
    gift: "None",
    isEnemy: false,
    items: [],
    abilities: [],
    changelog: [],
  };
}

function getDefaultItem(): Item {
  return {
    id: "",
    name: "",
    bulk: 0,
    desc: "",
  };
}

function getTestItems(keys: string[]): Item[] {
  return keys2Items(keys).map((item, idx) => {
    if (item === undefined) {
      return getDefaultItem();
    }
    return {
      ...item,
      id: `test${idx}`,
      name: item.name ? item.name : `test${idx}`,
    };
  });
}

function equipItems(character: Character) {
  character.items.forEach((item) => {
    item.equipped = true;
  });
}

describe("attributeUtils.ts", () => {
  describe("adjustAttrsObject", () => {
    it("adjustAttrsObject works properly", () => {
      const attrs = adjustAttrsObject(
        getDefaultCharacter(),
        { sp: 150, vim: -4, str: 1, mp: 5 },
        false,
        false
      );
      const expected: AttributeAdjustments = {
        sp: 150,
        vim: 6,
        str: 2,
        mp: 15,
      };
      expect(attrs).toStrictEqual(expected);
    });
    it("adjustAttrsObject propegates changes", () => {
      const attrs = adjustAttrsObject(
        getDefaultCharacter(),
        { str: 2, xp: 1500, agi: 1 },
        true,
        false
      );
      const expected: AttributeAdjustments = {
        str: 3,
        xp: 1500,
        agi: 2,
        maxHp: 17, // 10 + 6 (str) + 1 (xp)
        maxVim: 27, // 20 + 6 (str) + 1 (xp)
        speed: 1, // 0 + 1 (agi)
        init: 1, // 0 + 1 (agi)
      };
      expect(attrs).toStrictEqual(expected);
    });
    it("adjustAttrsObject does clamp logic", () => {
      const char = getDefaultCharacter();
      char.vim = char.maxVim + 10;
      const attrs = adjustAttrsObject(char, { str: -2 }, true, false);
      const expected: AttributeAdjustments = {
        str: -1,
        maxHp: 4, // 10 - 6 (str)
        maxVim: 14, // 10 - 6 (str)
        // hp is clamped because it starts <= maxHp,
        // mp is not clamped because it starts larger
        hp: 4,
      };
      expect(attrs).toStrictEqual(expected);
    });
    it("adjustAttrsObject enforces minimums", () => {
      const char = getDefaultCharacter();
      const attrs = adjustAttrsObject(char, { hp: -100 }, true, true);
      const expected: AttributeAdjustments = { hp: 0 };
      expect(attrs).toStrictEqual(expected);
    });
    it("adjustAttrsObject enforces maximums", () => {
      const char = getDefaultCharacter();
      const attrs = adjustAttrsObject(char, { hp: 100 }, true, true);
      const expected: AttributeAdjustments = { hp: char.maxHp };
      expect(attrs).toStrictEqual(expected);
    });
  });
  describe("characterAttributesMap", () => {
    it("characterAttributesMap works properly", () => {
      const char = getDefaultCharacter();
      const armorItems = getTestItems(["Backpack, Armored", "Heavy Shield"]);
      char.items = armorItems;
      equipItems(char);
      const attrs = characterAttributesMap(char);
      expect(attrs.armor.val).toBeGreaterThan(char.armor);
      expect(attrs.armor.original).toBe(char.armor);
      expect(attrs.armor.items).toStrictEqual([armorItems[0]]);
      expect(attrs.burden.val).toBeGreaterThan(0);
      expect(attrs.shield.val).toBeGreaterThan(0);
      expect(attrs.shield.items).toStrictEqual([armorItems[1]]);
      expect(attrs.speed.val).toBe(0); // minimum val is 0
      expect(attrs.hero.val).toBe(char.hero);
      expect(attrs.hero.original).toBe(char.hero);
    });
    it("characterAttributesMap executes equations", () => {
      const char = getDefaultCharacter();
      char.speed = 11;
      const armorItems = getTestItems(["Rockskin Potion"]);
      char.items = armorItems;
      equipItems(char);
      const attrs = characterAttributesMap(char);
      expect(attrs.speed.val).toBe(Math.floor(char.speed / 2));
    });
  });
});
