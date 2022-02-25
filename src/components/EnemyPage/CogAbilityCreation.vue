<template>
  <div>
    <h3>Ability Creation</h3>
    <div class="alignRow gap labelText">
      Remaining AP (Action Points):
      <fraction :top="remainingAP" :bottom="totalAP" />
    </div>
    <!-- TODO: List active abilities -->
    <button v-on:click="addAbilityButton" class="btn roundedButton">
      Add another ability
    </button>
    <div v-if="showNewAbilityPanel" class="card border padded column mt-8">
      <h2>New Ability</h2>
      <div class="alignRow gap">
        <label for="abilityName" class="nowrap">Ability Name:</label>
        <input
          type="text"
          v-model="ability.name"
          placeholder="Big Kick"
          id="abilityName"
          class="input shortenned"
        />
      </div>
      <p>
        AP Cost: <span class="number">{{ costAP }}</span>
      </p>
      <h3>Range</h3>
      <p>Select one</p>
      <radio-button-selection
        :options="rangeOptions"
        :selected="ability.range"
        @selectedUpdated="rangeUpdated"
      />
      <h3>Action Speed</h3>
      <p>Select one</p>
      <radio-button-selection
        :options="speedOptions"
        :selected="ability.speed"
        @selectedUpdated="speedUpdated"
      />
      <h3>Resource Cost</h3>
      <p>
        Enter a value for X, where X represents 5X the amount of vim to activate
        the ability. The ability will cost X AP less.
      </p>
      <div class="alignRow gap">
        <label for="vimCost">5X Vim cost:</label>
        <input
          type="number"
          min="0"
          v-model="ability.vimCost"
          id="vimCost"
          class="input tiny mt-2"
        />
      </div>
      <p>Resulting vim cost: {{ calculateVimCost }} vim.</p>
      <p>
        Enter a value for X, where X represents the amount of MP to activate the
        ability. The ability will cost X AP less.
      </p>
      <div class="alignRow gap">
        <label for="mpCost">MP cost:</label>
        <input
          type="number"
          min="0"
          v-model="ability.mpCost"
          id="mpCost"
          class="input tiny mt-2"
        />
      </div>
      <p>Resulting MP cost: {{ calculateMPCost }} MP.</p>
      <h3>Ability Type</h3>
      <radio-button-selection
        :options="typeOptions"
        :selected="ability.type"
        @selectedUpdated="typeUpdated"
      />
      <div v-if="resistantCheckRequired">
        <h4>DL for Resistance Checks</h4>
        <radio-button-selection
          :options="resistanceCheckOptions"
          :selected="ability.resistanceCheck"
          @selectedUpdated="resistanceCheckUpdated"
        />
      </div>
      <div v-if="attributeAPOption">
        <h4>Attribute Damage Type Option</h4>
        <radio-button-selection
          :options="attributeOptions"
          :selected="ability.attribute"
          @selectedUpdated="attributeUpdated"
        />
      </div>
      <div v-if="fearAPOption">
        <h4>Fear Type Option</h4>
        <radio-button-selection
          :options="fearOptions"
          :selected="ability.fear"
          @selectedUpdated="fearUpdated"
        />
      </div>
      <h3>Damages</h3>
      <check-box
        :checked="hideDamages"
        :text="'No Damage (0 AP)'"
        @toggled="hideDamagesToggled"
      />
      <div v-if="!hideDamages">
        <p>Normal Damage. (Can be unselected)</p>
        <radio-button-selection
          :options="normalDamageOptions"
          :selected="ability.normalDamage"
          :unselectable="true"
          @selectedUpdated="normalDamageUpdated"
        />
        <p>Burning Damage (Can be unselected)</p>
        <radio-button-selection
          :options="burningDamageOptions"
          :selected="ability.burningDamage"
          :unselectable="true"
          @selectedUpdated="burningDamageUpdated"
        />
        <p>Bleeding Damage (Can be unselected)</p>
        <radio-button-selection
          :options="bleedingDamageOptions"
          :selected="ability.bleedingDamage"
          :unselectable="true"
          @selectedUpdated="bleedingDamageUpdated"
        />
        <p>Armor Damage (Can be unselected)</p>
        <radio-button-selection
          :options="armorDamageOptions"
          :selected="ability.armorDamage"
          :unselectable="true"
          @selectedUpdated="armorDamageUpdated"
        />
        <p>Stun Damage (Can be unselected)</p>
        <radio-button-selection
          :options="stunDamageOptions"
          :selected="ability.stunDamage"
          :unselectable="true"
          @selectedUpdated="stunDamageUpdated"
        />
        <p>Paralysis Damage (Can be unselected)</p>
        <radio-button-selection
          :options="paralysisDamageOptions"
          :selected="ability.paralysisDamage"
          :unselectable="true"
          @selectedUpdated="paralysisDamageUpdated"
        />
      </div>
      <h3>Effects</h3>
      <h3>Area of Effect</h3>
    </div>
  </div>
</template>

<script>
import CheckBox from "../Common/CheckBox.vue";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
export default {
  components: { Fraction, RadioButtonSelection, CheckBox },
  name: "CogAbilityCreation",
  props: {
    cog: Object,
    totalAP: Number,
  },
  data() {
    return {
      showNewAbilityPanel: true,
      hideDamages: true,
      ability: {
        name: "",
        range: "melee",
        speed: "regular",
        vimCost: "",
        mpCost: "",
        type: "normal",
        resistanceCheck: "res1",
        attribute: "attr0",
        fear: "fear0",
        normalDamage: "",
        burningDamage: "",
        bleedingDamage: "",
        armorDamage: "",
        stunDamage: "",
        paralysisDamage: "",
      },
    };
  },
  computed: {
    remainingAP() {
      // TODO: Subtract AP as they are used
      return this.totalAP;
    },
    costAP() {
      let ap = 0;

      ap = ap + this.option2AP(this.ability.range);
      ap = ap + this.option2AP(this.ability.speed);

      // Resource Cost
      ap = ap - this.calculateVimCost / 5;
      ap = ap - this.calculateMPCost;

      // Ability Type
      if (this.resistantCheckRequired) {
        ap = ap + this.option2AP(this.ability.resistanceCheck);
      }
      if (this.attributeAPOption) {
        ap = ap + this.option2AP(this.ability.attribute);
      }
      if (this.fearAPOption) {
        ap = ap + this.option2AP(this.ability.fear);
      }

      // Damage Types
      if (!this.hideDamages) {
        ap = ap + this.option2AP(this.ability.normalDamage);
        ap = ap + this.option2AP(this.ability.burningDamage);
        ap = ap + this.option2AP(this.ability.bleedingDamage);
        ap = ap + this.option2AP(this.ability.armorDamage);
        ap = ap + this.option2AP(this.ability.stunDamage);
        ap = ap + this.option2AP(this.ability.paralysisDamage);
      }
      return ap;
    },
    calculateVimCost() {
      const vim = parseInt(this.ability.vimCost);
      if (isNaN(vim) || vim < 0) {
        return 0;
      }
      return vim * 5;
    },
    calculateMPCost() {
      const mp = parseInt(this.ability.mpCost);
      if (isNaN(mp) || mp < 0) {
        return 0;
      }
      return mp;
    },
    resistantCheckRequired() {
      return [
        "quick",
        "sneak",
        "magical",
        "attribute",
        "charm",
        "confusion",
        "disarm",
        "fear",
      ].includes(this.ability.type);
    },
    attributeAPOption() {
      return this.ability.type === "attribute";
    },
    fearAPOption() {
      return this.ability.type === "fear";
    },
    specialDamageLevel() {
      if (!this.cog.level) {
        return this.cog.level;
      }
      const lvl = parseInt(this.cog.level);
      if (this.ability.speed === "fast") {
        // Handle special case where damage is calculated as 3 levels lower
        return lvl - 3;
      }
      return this.cog.level;
    },
    rangeOptions() {
      return {
        melee: `<b>Range: Melee.</b> ${this.costStr("melee")}`,
        ranged: `<b>Range: 12m.</b> ${this.costStr("ranged")}`,
        long: `<b>Range: 60m.</b> ${this.costStr("long")}`,
      };
    },
    speedOptions() {
      return {
        fast: `<b>Actions: 1.</b> ${this.costStr(
          "fast"
        )}. Added Effects: The Cog's Level is treated as 3 lower for the purpose of all damage.`,
        regular: `<b>Actions: 2.</b> ${this.costStr("regular")}.`,
        slow: `<b>Actions: 3.</b> ${this.costStr(
          "slow"
        )}. The Cog's Level is treated as 1 higher for the purpose of normal damage.`,
      };
    },
    typeOptions() {
      return {
        normal:
          "<b>Attack, Normal:</b> Acc vs Vim, can be a direct hit or glancing blow. Can be Evaded.",
        quick:
          "<b>Attack, Quick:</b> AGI check, fully negated on success; a direct hit on failure. Can NOT be Evaded.",
        sneak:
          "<b>Attack, Sneak:</b> PER check, fully negated on success; a direct hit on failure. CanNOT be Evaded.",
        magical:
          "<b>Attack, Magical:</b> SPI check, fully negated on success; a direct hit on failure. Can be Evaded.",
        attribute:
          "<b>Attribute Damage:</b> STR check, fully negated on success; on failure: glancing blow and the target takes 1 damage to an Attribute specified during this ability's creation. The damage may be increased to 2 for 3 AP, or 3 for 8 AP. Can be Evaded.",
        charm:
          "<b>Charm:</b> CHA check, fully negated on success; on failure: glancing blow and the target is charmed. Can NOT be Evaded.",
        confusion:
          "<b>Confusion:</b> INT check, fully negated on success; on failure: glancing blow and the target is confused. Can NOT be Evaded.",
        disarm:
          "<b>Disarm:</b> DEX check, fully negated on success; on failure: glancing blow and target's weapon is disarmed. Can be Evaded.",
        fear: "<b>Fear:</b> WIS check, fully negated on success; on failure: glancing blow and the target takes 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn (target's choice). The damage may be increased to 2 and 5 respectively (or flee on their next turn) for 3 AP. CanNOT be Evaded. This effect cannot stack with Cogs of the same type.",
      };
    },
    resistanceCheckOptions() {
      return {
        res0: `DL:  ${this.lvlStr("6 + L", (lvl) => lvl + 6)}. ${this.costStr(
          "res0"
        )}`,
        res1: `DL:  ${this.lvlStr("7 + L", (lvl) => lvl + 7)}. ${this.costStr(
          "res1"
        )}`,
        res2: `DL:  ${this.lvlStr("8 + L", (lvl) => lvl + 8)}. ${this.costStr(
          "res2"
        )}`,
        res3: `DL:  ${this.lvlStr("9 + L", (lvl) => lvl + 9)}. ${this.costStr(
          "res3"
        )}`,
        res4: `DL:  ${this.lvlStr("10 + L", (lvl) => lvl + 10)}. ${this.costStr(
          "res4"
        )}`,
        res5: `DL:  ${this.lvlStr("11 + L", (lvl) => lvl + 11)}. ${this.costStr(
          "res5"
        )}`,
      };
    },
    attributeOptions() {
      return {
        attr0: `Deal 1 attribute damage. ${this.costStr("attr0")}`,
        attr1: `Deal 2 attribute damage. ${this.costStr("attr1")}`,
        att2: `Deal 3 attribute damage. ${this.costStr("att2")}`,
      };
    },
    fearOptions() {
      return {
        fear0: `Deal 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn. ${this.costStr(
          "fear0"
        )}`,
        fear1: `Deal 2 paralysis damage and 5 stun damage or must flee the Cog on their next turn. ${this.costStr(
          "fear1"
        )}`,
      };
    },
    normalDamageOptions() {
      return {
        norm0: `Deal ${this.normalDamageStr(-2)} damage. ${this.costStr(
          "norm0"
        )}`,
        norm1: `Deal ${this.normalDamageStr(-1)} damage. ${this.costStr(
          "norm1"
        )}`,
        norm2: `Deal ${this.normalDamageStr(0)} damage. ${this.costStr(
          "norm2"
        )}`,
        norm3: `Deal ${this.normalDamageStr(1)} damage. ${this.costStr(
          "norm3"
        )}`,
        norm4: `Deal ${this.normalDamageStr(2)} damage. ${this.costStr(
          "norm4"
        )}`,
      };
    },
    specialDmgHalfL() {
      return this.lvlStr(
        "L/2",
        (lvl) => Math.max(Math.round(lvl / 2), 0),
        true
      );
    },
    specialDmgL() {
      return this.lvlStr("L", (lvl) => Math.max(lvl, 0), true);
    },
    specialDmgDoubleL() {
      return this.lvlStr("2L", (lvl) => Math.max(lvl * 2, 0), true);
    },
    burningDamageOptions() {
      return {
        burn0: `Deal ${this.specialDmgHalfL} burning damage. ${this.costStr(
          "burn0"
        )}`,
        burn1: `Deal ${this.specialDmgL} burning damage. ${this.costStr(
          "burn1"
        )}`,
        burn2: `Deal ${this.specialDmgDoubleL} burning damage. ${this.costStr(
          "burn2"
        )}`,
      };
    },
    bleedingDamageOptions() {
      return {
        bleed0: `Deal ${this.specialDmgHalfL} bleeding damage. ${this.costStr(
          "bleed0"
        )}`,
        bleed1: `Deal ${this.specialDmgL} bleeding damage. ${this.costStr(
          "bleed1"
        )}`,
        bleed2: `Deal ${this.specialDmgDoubleL} bleeding damage. ${this.costStr(
          "bleed2"
        )}`,
      };
    },
    armorDamageOptions() {
      return {
        armor0: `Deal ${this.specialDmgHalfL} armor damage. ${this.costStr(
          "armor0"
        )}`,
      };
    },
    stunDamageOptions() {
      return {
        stun0: `Deal 1 stun damage on direct hits. ${this.costStr("stun0")}`,
      };
    },
    paralysisDamageOptions() {
      return {
        paralysis0: `Deal 1 paralysis damage on direct hits. ${this.costStr(
          "paralysis0"
        )}`,
      };
    },
    normalDamageLevel() {
      if (!this.cog.level) {
        return 0;
      }
      let level = parseInt(this.cog.level);
      if (this.ability.speed === "fast") {
        level = level - 3;
      }
      if (this.ability.speed === "slow") {
        level = level + 1;
      }
      return level;
    },
    normalDamageDiceCount() {
      const level = this.normalDamageLevel;
      if (level < 0) {
        return 0;
      }
      if (level <= 2) {
        return 1;
      }
      if (level <= 4) {
        return 2;
      }
      if (level <= 6) {
        return 3;
      }
      if (level <= 8) {
        return 4;
      }
      if (level <= 12) {
        return 6;
      }
      if (level <= 12) {
        return 9;
      }
      return level;
    },
  },
  methods: {
    addAbilityButton() {
      this.showNewAbilityPanel = !this.showNewAbilityPanel;
    },
    rangeUpdated(newRange) {
      this.ability.range = newRange;
    },
    speedUpdated(newSpeed) {
      this.ability.speed = newSpeed;
    },
    typeUpdated(newType) {
      this.ability.type = newType;
    },
    resistanceCheckUpdated(newResistanceCheck) {
      this.ability.resistanceCheck = newResistanceCheck;
    },
    attributeUpdated(newAttribute) {
      this.ability.attribute = newAttribute;
    },
    fearUpdated(newFear) {
      this.ability.fear = newFear;
    },
    hideDamagesToggled() {
      this.hideDamages = !this.hideDamages;
    },
    normalDamageUpdated(newDamage) {
      this.ability.normalDamage = newDamage;
    },
    burningDamageUpdated(newDamage) {
      this.ability.burningDamage = newDamage;
    },
    bleedingDamageUpdated(newDamage) {
      this.ability.bleedingDamage = newDamage;
    },
    armorDamageUpdated(newDamage) {
      this.ability.armorDamage = newDamage;
    },
    stunDamageUpdated(newDamage) {
      this.ability.stunDamage = newDamage;
    },
    paralysisDamageUpdated(newDamage) {
      this.ability.paralysisDamage = newDamage;
    },
    option2AP(option) {
      const map = {
        melee: 0,
        ranged: 1,
        long: 2,
        fast: 4,
        regular: 0,
        slow: -2,
        res0: -1,
        res1: 0,
        res2: 1,
        res3: 2,
        res4: 3,
        res5: 4,
        attr0: 0,
        attr1: 3,
        attr2: 8,
        fear0: 0,
        fear1: 4,
        norm0: 1,
        norm1: 2,
        norm2: 3,
        norm3: 4,
        norm4: 5,
        burn0: 2,
        burn1: 4,
        burn2: 6,
        bleed0: 2,
        bleed1: 4,
        bleed2: 6,
        armor0: 4,
        stun0: 3,
        paralysis0: 3,
      };
      if (map[option] !== undefined) {
        return map[option];
      }
      return 0;
    },
    costStr(option) {
      return `Cost: ${this.option2AP(option)} AP`;
    },
    lvlStr(def, fun, specialDamage) {
      let lvl = this.cog.level;
      if (specialDamage === true) {
        lvl = this.specialDamageLevel;
      }
      if (!lvl) {
        if (!def) {
          return "L";
        }
        return def;
      }
      if (!fun) {
        return "L (" + lvl + ")";
      }
      return def + " (" + fun(parseInt(lvl)) + ")";
    },
    normalDamageStr(modifier) {
      const level = this.normalDamageLevel;
      let diceCount = this.normalDamageDiceCount + modifier;
      if (diceCount < 0) {
        diceCount = 0;
      }
      let rollAdjustment = "";
      if (level === 0) {
        rollAdjustment = "/2";
      }
      if ([2, 3, 5, 7, 10].includes(level)) {
        rollAdjustment = "+3";
      }
      if ([4, 6, 8, 11, 13].includes(level)) {
        rollAdjustment = "+6";
      }
      if ([12, 14].includes(level)) {
        rollAdjustment = "+12";
      }
      return diceCount + "d6" + rollAdjustment;
    },
  },
};
</script>

<style>
.labelText {
  font-size: 16pt;
}
.mt-2 {
  margin-top: 2px;
}
.mt-8 {
  margin-top: 8px;
}
</style>
