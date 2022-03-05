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
        :checked="ability.zeroDamage"
        :text="'No Damage (0 AP)'"
        @toggled="zeroDamageToggled"
      />
      <div v-if="!ability.zeroDamage">
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
      <p class="textBlock">Each effect may be taken up to once.</p>
      <cog-toggleable-effects
        :options="effectsOptions"
        :selected="ability.effects"
        :mutuallyExclusive="effectsMutuallyExclusive"
        :disabled="disabledEffectsOptions"
        @newSelected="effectsUpdated"
      />
      <div v-for="effect in activeSpecialEffects" v-bind:key="effect + 'key'">
        <h4>{{ effect }}</h4>
        <div class="alignRow gap">
          <label v-bind:for="effect + 'input'">AP to spend:</label>
          <input
            type="number"
            min="1"
            v-model="ability.specialEffectsCosts[effect]"
            v-bind:id="effect + 'input'"
            class="input tiny mt-2"
          />
        </div>
      </div>
      <h3>Area of Effect</h3>
      <p class="textBlock">
        Up to one Area of Effect type may be taken. Whereas range indicates
        where the ability effect can start, Area of Effect indicates where it
        can go. For example, with a line effect, that line may begin and end
        anywhere within the ability's range so long as the line's length meets
        the description of the line effect and does not extend outside of the
        ability's range. If the ability has only Melee range, it must start
        within a hex that the Cog can reach.
      </p>
      <radio-button-selection
        :options="areaOfEffectOptions"
        :selected="ability.areaEffect"
        :unselectable="true"
        @selectedUpdated="areaEffectUpdated"
      />
      <h3>Add the Ability to your Cog</h3>
      <div class="alignRow split">
        <button class="btn roundedButton">Add Ability</button>
        <button class="btn roundedButton clear">Throw Away</button>
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from "../Common/CheckBox.vue";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import CogToggleableEffects from "./CogToggleableEffects.vue";
export default {
  components: {
    Fraction,
    RadioButtonSelection,
    CheckBox,
    CogToggleableEffects,
  },
  name: "CogAbilityCreation",
  props: {
    cog: Object,
    totalAP: Number,
  },
  data() {
    return {
      showNewAbilityPanel: true,
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
        zeroDamage: true,
        normalDamage: "",
        burningDamage: "",
        bleedingDamage: "",
        armorDamage: "",
        stunDamage: "",
        paralysisDamage: "",
        effects: [],
        specialEffectsCosts: {},
        areaEffect: "",
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
      if (!this.ability.zeroDamage) {
        ap = ap + this.option2AP(this.ability.normalDamage);
        ap = ap + this.option2AP(this.ability.burningDamage);
        ap = ap + this.option2AP(this.ability.bleedingDamage);
        ap = ap + this.option2AP(this.ability.armorDamage);
        ap = ap + this.option2AP(this.ability.stunDamage);
        ap = ap + this.option2AP(this.ability.paralysisDamage);
      }

      // Special Effects
      ap =
        ap +
        this.ability.effects.reduce((sum, effect) => {
          let val = 0;
          if (!isNaN(this.option2AP(effect))) {
            val = this.option2AP(effect);
          }
          return sum + val;
        }, 0);

      // Area Effects
      ap = ap + this.option2AP(this.ability.areaEffect);
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
    specialEffectsAPMap() {
      const map = {};
      this.specialEffects.forEach((effect) => {
        if (this.activeSpecialEffects.includes(effect)) {
          const cost = parseInt(this.ability.specialEffectsCosts[effect]);
          if (isNaN(cost)) {
            map[effect] = "X";
          } else {
            map[effect] = cost;
          }
        } else {
          map[effect] = "X";
        }
      });
      return map;
    },
    optionsMap() {
      // setup special strings for options
      const sharpenAP = this.specialEffectsAPMap["Sharpen"];
      let sharpenEffectX = "5X";
      if (!isNaN(sharpenAP)) {
        sharpenEffectX = sharpenAP * 5;
      }
      // other constants used in options
      const specialDmgHalfL = this.lvlStr(
        "L/2",
        (lvl) => Math.max(Math.round(lvl / 2), 0),
        true
      );
      const specialDmgL = this.lvlStr("L", (lvl) => Math.max(lvl, 0), true);
      const specialDmgDoubleL = this.lvlStr(
        "2L",
        (lvl) => Math.max(lvl * 2, 0),
        true
      );
      // actual map
      return {
        // range
        melee: { ap: 0, desc: "Melee", type: "range" },
        ranged: { ap: 1, desc: "12m", type: "range" },
        long: { ap: 2, desc: "60m", type: "range" },
        // speed
        fast: {
          ap: 4,
          desc: "1 Action",
          type: "speed",
          optionDetails:
            "Added Effects: The Cog's Level is treated as 3 lower for the purpose of all damage.",
        },
        regular: { ap: 0, desc: "2 Actions", type: "speed" },
        slow: {
          ap: -2,
          desc: "3 Actions",
          type: "speed",
          optionDetails:
            "The Cog's Level is treated as 1 higher for the purpose of normal damage.",
        },
        // resistance checks type attack
        res0: {
          ap: -1,
          desc: `DL:  ${this.lvlStr("6 + L", (lvl) => lvl + 6)}`,
          type: "res",
        },
        res1: {
          ap: 0,
          desc: `DL:  ${this.lvlStr("7 + L", (lvl) => lvl + 7)}`,
          type: "res",
        },
        res2: {
          ap: 1,
          desc: `DL:  ${this.lvlStr("8 + L", (lvl) => lvl + 8)}`,
          type: "res",
        },
        res3: {
          ap: 2,
          desc: `DL:  ${this.lvlStr("9 + L", (lvl) => lvl + 9)}`,
          type: "res",
        },
        res4: {
          ap: 3,
          desc: `DL:  ${this.lvlStr("10 + L", (lvl) => lvl + 10)}`,
          type: "res",
        },
        res5: {
          ap: 4,
          desc: `DL:  ${this.lvlStr("11 + L", (lvl) => lvl + 11)}`,
          type: "res",
        },
        // attribute damage type attack
        attr0: { ap: 0, desc: "Deal 1 attribute damage.", type: "attr" },
        attr1: { ap: 3, desc: "Deal 2 attribute damage.", type: "attr" },
        attr2: { ap: 8, desc: "Deal 3 attribute damage.", type: "attr" },
        // fear type attack
        fear0: {
          ap: 0,
          desc: "Deal 1 paralysis damage and 3 stun damage or must flee the Cog on their next turn (target's choice).",
          type: "fear",
        },
        fear1: {
          ap: 4,
          desc: "Deal 2 paralysis damage and 5 stun damage or must flee the Cog on their next turn (target's choice).",
          type: "fear",
        },
        // normal damage type
        norm0: {
          ap: 1,
          desc: `Deal ${this.normalDamageStr(-2)} damage`,
          type: "norm",
        },
        norm1: {
          ap: 2,
          desc: `Deal ${this.normalDamageStr(-1)} damage`,
          type: "norm",
        },
        norm2: {
          ap: 3,
          desc: `Deal ${this.normalDamageStr(0)} damage`,
          type: "norm",
        },
        norm3: {
          ap: 4,
          desc: `Deal ${this.normalDamageStr(1)} damage`,
          type: "norm",
        },
        norm4: {
          ap: 5,
          desc: `Deal ${this.normalDamageStr(2)} damage`,
          type: "norm",
        },
        // burn damage type
        burn0: {
          ap: 2,
          desc: `Deal ${specialDmgHalfL} burning damage.`,
          type: "burn",
        },
        burn1: {
          ap: 4,
          desc: `Deal ${specialDmgL} burning damage.`,
          type: "burn",
        },
        burn2: {
          ap: 6,
          desc: `Deal ${specialDmgDoubleL} burning damage.`,
          type: "burn",
        },
        // bleed damage type
        bleed0: {
          ap: 2,
          desc: `Deal ${specialDmgHalfL} bleeding damage.`,
          type: "bleed",
        },
        bleed1: {
          ap: 4,
          desc: `Deal ${specialDmgL} bleeding damage.`,
          type: "bleed",
        },
        bleed2: {
          ap: 6,
          desc: `Deal ${specialDmgDoubleL} bleeding damage.`,
          type: "bleed",
        },
        // armor damage
        armor0: {
          ap: 4,
          desc: `Deal ${specialDmgHalfL} armor damage.`,
          type: "armor",
        },
        // stun damage
        stun0: {
          ap: 3,
          desc: "Deal 1 stun damage on direct hits.",
          type: "stun",
        },
        // paralysis damage
        paralysis0: {
          ap: 3,
          desc: "Deal 1 paralysis damage on direct hits.",
          type: "paralysis",
        },
        // Effects
        Adapting: {
          ap: 5,
          desc: "When this ability is used, until the start of the Cog's next turn, after resolving an attack they gain resistance to that type of attack.",
          type: "effect",
        },
        Clobbering: {
          ap: 1,
          desc: `This ability also causes the target to lose ${this.lvlStr()} Vim on a direct hit, or ${this.lvlStr(
            "L/2",
            (lvl) => Math.round(lvl / 2)
          )} Vim on a glancing blow.`,
          type: "effect",
        },
        "Defense Breaker": {
          ap: 1,
          desc: "This ability also causes the target to lose 1 Alert after the attack resolves.",
          type: "effect",
        },
        Disorienter: {
          ap: 1,
          desc: "This ability also reduces the target's Accuracy by 5 until the end of the Encounter.",
          type: "effect",
        },
        Empower: {
          ap: this.specialEffectsAPMap["Empower"],
          desc: `This ability grants the Cog +${this.specialEffectsAPMap["Empower"]} damage for the rest of the Encounter when used.`,
          type: "effect",
          optionDetails:
            "This effect can only be taken if this ability costs Vim and/or MP. If this effect is taken, the amount of AP that can be spent on this effect is at most the amount of AP gained from spending Vim and/or MP.",
        },
        Homing: {
          ap: this.lvlInt(),
          desc: "This ability cannot be Evaded.",
          type: "effect",
        },
        Knockdown: {
          ap: 1,
          desc: "On a direct hit or a failed resistance check, this ability causes the target to be knocked prone.",
          type: "effect",
        },
        "Knockback, Weak": {
          ap: 1,
          desc: `This ability also knocks the target back ${this.lvlStr()} squares, or none on a glancing blow.`,
          type: "effect",
        },
        "Knockback, Strong": {
          ap: 2,
          desc: `This ability also knocks the target back ${this.lvlStr(
            "2L",
            (lvl) => lvl * 2
          )} squares, or half on a glancing blow.`,
          type: "effect",
        },
        Intangible: {
          ap: this.lvlInt((lvl) => Math.floor(lvl / 2)),
          desc: "This ability cannot be Blocked (Beginner)",
          type: "effect",
        },
        Protecting: {
          ap: this.specialEffectsAPMap["Protecting"],
          desc: `This ability grants the Cog +${this.specialEffectsAPMap["Protecting"]} Armor until the start of their next turn.`,
          type: "effect",
        },
        Sharpen: {
          ap: this.specialEffectsAPMap["Sharpen"],
          desc: `This ability grants the Cog +${sharpenEffectX} Accuracy for the rest of the Encounter when used.`,
          type: "effect",
          optionDetails:
            "This effect can only be taken if this ability costs Vim and/or MP. If this effect is taken, the amount of AP that can be spent on this effect is at most the amount of AP gained from spending Vim and/or MP.",
        },
        Sickening: {
          ap: this.specialEffectsAPMap["Sickening"],
          desc: `On a direct hit, this ability causes the target to be sick for ${this.specialEffectsAPMap["Sickening"]} Rounds.`,
          type: "effect",
        },
        Silencing: {
          ap: 4,
          desc: "On a direct hit or glancing blow, this ability causes the target to be unable to speak and take a -6 penalty to casting rolls. This effect lasts until the end of the target's next turn.",
          type: "effect",
        },
        Stiffening: {
          ap: this.specialEffectsAPMap["Stiffening"],
          desc: `On a direct hit, this ability causes the target to be stiff for ${this.specialEffectsAPMap["Stiffening"]} Rounds.`,
          type: "effect",
        },
        Threatening: { ap: 1, desc: "This ability threatens the target." },
        "Mana Drain": {
          ap: 1,
          desc: `This ability also causes the target to lose ${this.lvlStr(
            "L/2",
            (lvl) => Math.floor(lvl / 2)
          )} MP on a direct hit, or none on a glancing blow.`,
          type: "effect",
        },
        // Area of Effect
        area0: {
          ap: 1,
          desc: "This ability cannot target an empty hex. After resolving the ability, the ability also affects valid targets who are adjacent to the original target. This chain reaction repeats until there are no valid targets remaining. The ability cannot affect the same target twice.",
          type: "area",
          title: "Chain, Adjacent",
        },
        area1: {
          ap: 2,
          desc: "This ability cannot target an empty hex. After resolving the ability, the ability also affects valid targets who are within 3 meters of the original target. This chain reaction repeats until there are no valid targets remaining. The ability cannot affect the same target twice.",
          type: "area",
          title: "Chain, Long",
        },
        area2: {
          ap: 1,
          desc: "This ability targets 3 hexes in a line.",
          type: "area",
          title: "Line, Short",
        },
        area3: {
          ap: 2,
          desc: "This ability targets 6-12 hexes in a line, chosen by the Cog during creation.",
          type: "area",
          title: "Line, Medium",
        },
        area4: {
          ap: 3,
          desc: "This ability targets 30-60 hexes in a line, chosen by the Cog during creation.",
          type: "area",
          title: "Line, Long",
        },
        area5: {
          ap: 2,
          desc: "This ability also targets all adjacent hexes.",
          type: "area",
          title: "Radius, Small",
        },
        area6: {
          ap: 3,
          desc: "This ability also targets all hexes within a 2-4 meter radius, chosen by the Cog during creation.",
          type: "area",
          title: "Radius, Medium",
        },
        area7: {
          ap: 4,
          desc: "This ability also targets all hexes within a 5-12 meter radius, chosen by the Cog during creation.",
          type: "area",
          title: "Radius, Large",
        },
        area8: {
          ap: 5,
          desc: "This ability also targets all hexes within a 30 meter radius",
          type: "area",
          title: "Radius, Huge",
        },
      };
    },
    rangeOptions() {
      const map = {};
      Object.entries(this.optionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        if (details.type === "range") {
          map[name] = `<b>Range ${details.desc}.</b> ${this.costStr(name)}`;
        }
      });
      return map;
    },
    speedOptions() {
      const map = {};
      Object.entries(this.optionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        if (details.type === "speed") {
          const additionalDetailStr =
            details.optionDetails === undefined ? "" : details.optionDetails;
          map[name] = `<b>${details.desc}.</b> ${this.costStr(
            name
          )}. ${additionalDetailStr}`;
        }
      });
      return map;
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
      return this.basicOptionMap("res");
    },
    attributeOptions() {
      return this.basicOptionMap("attr");
    },
    fearOptions() {
      return this.basicOptionMap("fear");
    },
    normalDamageOptions() {
      return this.basicOptionMap("norm");
    },
    burningDamageOptions() {
      return this.basicOptionMap("burn");
    },
    bleedingDamageOptions() {
      return this.basicOptionMap("bleed");
    },
    armorDamageOptions() {
      return this.basicOptionMap("armor");
    },
    stunDamageOptions() {
      return this.basicOptionMap("stun");
    },
    paralysisDamageOptions() {
      return this.basicOptionMap("paralysis");
    },
    effectsOptions() {
      const map = {};
      Object.entries(this.optionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        if (details.type === "effect") {
          const additionalDetailStr =
            details.optionDetails === undefined ? "" : details.optionDetails;
          map[name] = `(${this.costStr(name)}) ${
            details.desc
          } ${additionalDetailStr}`;
        }
      });
      return map;
    },
    effectsMutuallyExclusive() {
      return [["Knockback, Weak", "Knockback, Strong"]];
    },
    disabledEffectsOptions() {
      const disabledList = [];
      if (this.calculateVimCost === 0 && this.calculateMPCost === 0) {
        disabledList.push("Empower", "Sharpen"); // need to have spent on vim or MP to be enabled
      }
      return disabledList;
    },
    specialEffects() {
      // effects that require the user to specify how much AP to spend
      return ["Empower", "Protecting", "Sharpen", "Sickening", "Stiffening"];
    },
    activeSpecialEffects() {
      return this.ability.effects.filter((effect) =>
        this.specialEffects.includes(effect)
      );
    },
    areaOfEffectOptions() {
      const map = {};
      Object.entries(this.optionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        if (details.type === "area") {
          map[name] = `<b>${details.title}</b> (${this.costStr(name)}) ${
            details.desc
          }`;
        }
      });
      return map;
    },
    formattedAbility() {
      // calculate activation costs
      const activationList = [this.optionsMap[this.ability.speed].desc];
      const costMap = { A: parseInt(this.optionsMap[this.ability.speed].desc) };
      if (this.calculateVimCost > 0) {
        activationList.push(this.calculateVimCost + " Vim");
        costMap.V = this.calculateVimCost;
      }
      if (this.calculateMPCost > 0) {
        activationList.push(this.calculateMPCost + " MP");
        costMap.M = this.calculateMPCost;
      }
      const activationStr = activationList.join(", ");
      // calculate range string
      const areaOfEffectStr =
        this.optionsMap[this.ability.areaEffect] === undefined
          ? ""
          : this.optionsMap[this.ability.areaEffect].desc;
      const rangeStr =
        this.optionsMap[this.ability.range].desc + areaOfEffectStr;
      return {
        name: this.ability.name,
        purchase: this.costAP + " AP",
        range: rangeStr,
        activation: activationStr,
        cost: costMap,
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
    zeroDamageToggled() {
      this.ability.zeroDamage = !this.ability.zeroDamage;
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
    effectsUpdated(newEffects) {
      this.ability.effects = newEffects;
    },
    areaEffectUpdated(newAreaEffect) {
      this.ability.areaEffect = newAreaEffect;
    },
    option2AP(option) {
      if (
        this.optionsMap[option] !== undefined &&
        this.optionsMap[option].ap !== undefined
      ) {
        return this.optionsMap[option].ap;
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
    lvlInt(fun) {
      const directLvl = parseInt(this.cog.level);
      const lvl = isNaN(directLvl) ? 0 : directLvl;
      if (!fun) {
        return lvl;
      }
      return fun(lvl);
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
    basicOptionMap(type) {
      const map = {};
      Object.entries(this.optionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        if (details.type === type) {
          map[name] = `${details.desc}. ${this.costStr(name)}`;
        }
      });
      return map;
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
