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
      <h3>Effects</h3>
      <h3>Area of Effect</h3>
    </div>
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
export default {
  components: { Fraction, RadioButtonSelection },
  name: "CogAbilityCreation",
  props: {
    cog: Object,
    totalAP: Number,
  },
  data() {
    return {
      showNewAbilityPanel: true,
      ability: {
        range: "melee",
        speed: "regular",
        vimCost: "",
        mpCost: "",
        type: "normal",
        resistanceCheck: "0",
        attribute: "0",
        fear: "0",
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

      // Ranges
      if (this.ability.range === "ranged") {
        ap = ap + 1;
      } else if (this.ability.range === "long") {
        ap = ap + 2;
      }

      // Ability Speed
      if (this.ability.speed === "fast") {
        ap = ap + 4;
      } else if (this.ability.speed === "slow") {
        ap = ap - 2;
      }

      // Resource Cost
      ap = ap - this.calculateVimCost / 5;
      ap = ap - this.calculateMPCost;

      // Ability Type
      if (this.resistantCheckRequired && this.ability.resistanceCheck !== "0") {
        ap = ap + parseInt(this.ability.resistanceCheck);
      }
      if (this.attributeAPOption && this.ability.attribute !== "0") {
        ap = ap + parseInt(this.ability.attribute);
      }
      if (this.fearAPOption && this.ability.fear !== "0") {
        ap = ap + parseInt(this.ability.fear);
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
    rangeOptions() {
      return {
        melee: "<b>Range: Melee.</b> Cost: 0 AP.",
        ranged: "<b>Range: 12m.</b> Cost: 1 AP.",
        long: "<b>Range: 60m.</b> Cost: 2 AP.",
      };
    },
    speedOptions() {
      return {
        fast: "<b>Actions: 1.</b> Cost: 4 AP. Added Effects: The Cog's Level is treated as 3 lower for the purpose of all damage.",
        regular: "<b>Actions: 2.</b> Cost: 0 AP.",
        slow: "<b>Actions: 3.</b> Cost: -2 AP. The Cog's Level is treated as 1 higher for the purpose of normal damage.",
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
        "-1": `DL:  ${this.lvlStr("6 + L", (lvl) => lvl + 6)}. Cost: -1 AP.`,
        0: `DL:  ${this.lvlStr("7 + L", (lvl) => lvl + 7)}. Cost: 0 AP.`,
        1: `DL:  ${this.lvlStr("8 + L", (lvl) => lvl + 8)}. Cost: 1 AP.`,
        2: `DL:  ${this.lvlStr("9 + L", (lvl) => lvl + 9)}. Cost: 2 AP.`,
        3: `DL:  ${this.lvlStr("10 + L", (lvl) => lvl + 10)}. Cost: 3 AP.`,
        4: `DL:  ${this.lvlStr("11 + L", (lvl) => lvl + 11)}. Cost: 4 AP.`,
      };
    },
    attributeOptions() {
      return {
        0: "Deal 1 attribute damage - costs 0 AP",
        3: "Deal 2 attribute damage - costs 3 AP",
        8: "Deal 3 attribute damage - costs 8 AP",
      };
    },
    fearOptions() {
      return {
        0: "Deal 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn - costs 0 AP",
        3: "Deal 2 paralysis damage and 5 stun damage or must flee the Cog on their next turn - costs 3 AP",
      };
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
    lvlStr(def, fun) {
      if (!this.cog.level) {
        if (!def) {
          return "L";
        }
        return def;
      }
      if (!fun) {
        return "L (" + this.cog.level + ")";
      }
      return def + " (" + fun(parseInt(this.cog.level)) + ")";
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
