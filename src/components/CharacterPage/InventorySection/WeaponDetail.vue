<template>
  <div>
    <p v-if="weapon.weaponType" class="mb-0">
      <b>Type:</b> {{ weapon.weaponType }}
    </p>
    <p v-if="weapon.range" class="mb-0"><b>Range:</b> {{ weapon.range }}</p>
    <p v-if="weapon.attr" class="mb-0"><b>Attribute:</b> {{ weapon.attr }}</p>
    <p v-if="usable && weapon.type === 'weapon'" class="mb-0">
      <b>Accuracy:</b> {{ acc }}
      <span v-if="hasProficiency" class="mutedText">
        ({{ weapon.attr }} + proficiency)
      </span>
    </p>
    <p v-if="dmg" class="mb-0"><b>Damage:</b> {{ dmg }}</p>
    <div v-if="usable && dice" class="card mt-8 padded thin">
      <toggleable-dice-section-copyable :dice="newDiceParsed" class="wide" />
    </div>
    <p v-if="weapon.special" class="mb-0">
      <b>Special:</b> {{ weapon.special }}
    </p>
    <p v-if="weapon.bulk" class="mb-0">
      <b>Bulk:</b> {{ weapon.bulk }}
      <span v-if="usable" class="mutedText">{{
        weapon.equipped ? "(Equipped)" : "(Unequipped)"
      }}</span>
    </p>
    <div v-if="usable && !isDefaultWeapon && weapon.category !== 'Grenade'">
      <button
        v-if="weapon.equipped"
        v-on:click="toggleEquipped"
        type="button"
        class="btn basicBtn wide"
      >
        <div class="basicBtnContents">
          <img src="/images/drop-weapon.svg" class="svg-button" />
          Unequip
        </div>
      </button>
      <button
        v-else
        type="button"
        v-on:click="toggleEquipped"
        class="btn basicBtn wide"
      >
        <div class="basicBtnContents">
          <img src="/images/sword-brandish.svg" class="svg-button" />
          Equip
        </div>
      </button>
    </div>
    <p v-if="weapon.examples" class="mb-0">
      <b>Common Examples:</b> {{ weapon.examples }}
    </p>
    <p v-if="weapon.cost && !isDefaultWeapon" class="mb-0">
      <b>Cost:</b> {{ weapon.cost }}
    </p>
    <p class="mb-0">{{ weapon.desc }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleableDiceSectionCopyable from "../../Common/Dice/ToggleableDiceSectionCopyable.vue";
import { defaultWeaponCategories } from "../../../utils/itemUtils";
import { diceParseFromString } from "../../../utils/diceUtils";
import { ATTRIBUTES } from "../../../utils/constants";

export default {
  components: { ToggleableDiceSectionCopyable },
  name: "WeaponDetail",
  props: {
    weapon: { type: Object, required: true },
  },
  computed: {
    ...mapState("character", ["character"]),
    ...mapState("dice", ["defaultDiceSettings"]),
    usable() {
      return this.weapon.id !== undefined;
    },
    isDefaultWeapon() {
      return defaultWeaponCategories.includes(this.weapon.category);
    },
    hasProficiency() {
      if (!this.weapon.category) {
        return false;
      }
      const possibleNames = [
        `${this.weapon.category} Specialist`,
        `${this.weapon.category} Weapon Proficiency`,
      ];
      return this.character.abilities.some((ability) =>
        possibleNames.includes(ability.name)
      );
    },
    attrBonus() {
      if (this.weapon.attr) {
        let attrStr = this.weapon.attr;
        ATTRIBUTES.forEach((attr) => {
          attrStr = attrStr.replaceAll(attr, this.character[attr]);
        });
        const numbers = [...attrStr.matchAll(/[+-]*\d+/gm)];
        return numbers.reduce((sum, val) => sum + parseInt(val), 0);
      }
      return 0;
    },
    acc() {
      return Math.max(this.attrBonus * 10 + (this.hasProficiency ? 10 : 0), 0);
    },
    dice() {
      if (!this.weapon.dmg) {
        return undefined;
      }
      const matched = this.weapon.dmg.match(/\d*d\d+([+-]\d+)*/gm) || [];
      if (matched.length === 0) {
        return false;
      }
      return matched[0];
    },
    newDice() {
      return (
        this.dice +
        (this.attrBonus
          ? (this.attrBonus > 0 ? "+" : "") + this.attrBonus
          : "") +
        (this.hasProficiency ? "+1" : "")
      );
    },
    newDiceParsed() {
      return diceParseFromString(this.newDice, this.defaultDiceSettings);
    },
    dmg() {
      if (!this.usable || !this.dice) {
        return this.weapon.dmg;
      }
      return this.weapon.dmg.replace(this.dice, this.newDice);
    },
  },
  methods: {
    toggleEquipped() {
      const updatedItem = {
        id: this.weapon.id,
        equipped: !this.weapon.equipped,
      };
      this.$store.dispatch("character/updateItem", {
        id: this.character.id,
        item: updatedItem,
      });
    },
  },
};
</script>

<style scoped>
.svg-button {
  height: 40px;
  width: 40px;
  margin-right: 8px;
}
</style>
