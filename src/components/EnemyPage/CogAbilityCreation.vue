<template>
  <div class="card border padded column">
    <h2 v-if="isEdit">Edit {{ ability.name }}</h2>
    <h2 v-else>New Ability</h2>
    <div class="stickyHeader">
      <span>
        <b>{{ ability.name }}</b>
        / AP cost:
        <span class="number" v-bind:class="tooMuchAPWarningClass">{{
          costAP
        }}</span>
        / AP left to spend:
        <span class="number" v-bind:class="tooMuchAPWarningClass">{{
          remainingAP
        }}</span>
      </span>
    </div>
    <p>
      Current version:
      <a
        href="https://vennt.fandom.com/wiki/Foe_Ability?oldid=4250"
        target="_blank"
        class="link"
      >
        Revision as of 23:02, 7 March 2022
      </a>
    </p>
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
        class="input tiny"
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
        class="input tiny"
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
          class="input tiny"
        />
      </div>
    </div>
    <h3>Area of Effect</h3>
    <p class="textBlock">
      Up to one Area of Effect type may be taken. Whereas range indicates where
      the ability effect can start, Area of Effect indicates where it can go.
      For example, with a line effect, that line may begin and end anywhere
      within the ability's range so long as the line's length meets the
      description of the line effect and does not extend outside of the
      ability's range. If the ability has only Melee range, it must start within
      a hex that the Cog can reach.
    </p>
    <radio-button-selection
      :options="areaOfEffectOptions"
      :selected="ability.areaEffect"
      :unselectable="true"
      @selectedUpdated="areaEffectUpdated"
    />
    <h3>Add the Ability to your Cog</h3>
    <p>
      AP Cost: <span class="number">{{ costAP }}</span>
    </p>
    <p>Sample of what your ability will look like:</p>
    <display-basic-ability-details :ability="formattedAbility" />
    <div class="alignRow split">
      <button
        v-bind:disabled="createButtonDisabled"
        v-on:click="emitCreate()"
        class="btn roundedButton"
      >
        Save Ability
      </button>
      <confirmation-modal
        :buttonText="'Throw Away'"
        :buttonClass="'clear'"
        :confStr="'Delete'"
        :details="'Are you sure you want to delete this ability? It will not be saved.'"
        @mainButton="emitDelete"
      />
    </div>
  </div>
</template>

<script>
import DisplayBasicAbilityDetails from "../Common/Abilities/DisplayBasicAbilityDetails.vue";
import CheckBox from "../Common/CheckBox.vue";
import ConfirmationModal from "../Common/ConfirmationModal.vue";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import CogToggleableEffects from "./CogToggleableEffects.vue";
import {
  activeCogAbilitySpecialEffects,
  cogAbilityCostAP,
  cogAbilitiesOptionsMap,
  cogCalculateVimCost,
  cogCalculateMPCost,
  cogFormattedAbility,
  cogOption2AP,
  cogResistantCheckRequired,
  cogTypeOptionsMap,
} from "./CogFlowUtils/CogAbilityCreationUtils";
import { traitAndWeaknessNames } from "./CogFlowUtils/CogTraitsUtils";
export default {
  components: {
    RadioButtonSelection,
    CheckBox,
    CogToggleableEffects,
    DisplayBasicAbilityDetails,
    ConfirmationModal,
  },
  name: "CogAbilityCreation",
  props: {
    cog: Object,
    remainingAP: Number,
    givenAbility: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      ability: {
        name: "",
        range: "melee",
        speed: "slow",
        vimCost: "",
        mpCost: "",
        type: "normal",
        resistanceCheck: "res0",
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
  beforeMount() {
    // copy prop value if it was set
    if (this.isEdit) {
      this.ability = this.givenAbility;
    } else {
      this.ability.name = `Attack ${this.cog.cogAbilities.length}`;
    }
  },
  computed: {
    isEdit() {
      return this.givenAbility !== undefined && this.index !== -1;
    },
    costAP() {
      return cogAbilityCostAP(this.ability, this.optionsMap);
    },
    tooMuchAPWarningClass() {
      if (this.isEdit) {
        return this.remainingAP < 0 ? "errorText" : "";
      }
      return this.costAP > this.remainingAP ? "errorText" : "";
    },
    calculateVimCost() {
      return cogCalculateVimCost(this.ability);
    },
    calculateMPCost() {
      return cogCalculateMPCost(this.ability);
    },
    resistantCheckRequired() {
      return cogResistantCheckRequired(this.ability);
    },
    attributeAPOption() {
      return this.ability.type === "attribute";
    },
    fearAPOption() {
      return this.ability.type === "fear";
    },
    optionsMap() {
      return cogAbilitiesOptionsMap(this.cog, this.ability);
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
    typeOptionsMap() {
      // relies on output of optionMap.
      return cogTypeOptionsMap(this.ability, this.optionsMap);
    },
    typeOptions() {
      const map = {};
      Object.entries(this.typeOptionsMap).forEach((pair) => {
        const name = pair[0];
        const details = pair[1];
        map[name] = `<b>${details.title}:</b> ${details.desc}`;
      });
      return map;
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
          map[name] = {
            text: `(${this.costStr(name)}) ${
              details.desc
            } ${additionalDetailStr}`,
          };
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
    activeSpecialEffects() {
      return activeCogAbilitySpecialEffects(this.ability.effects);
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
      return cogFormattedAbility(this.cog, this.ability, this.optionsMap);
    },
    createButtonDisabled() {
      // cannot create ability if any effect costs haven't been entered
      if (
        this.activeSpecialEffects.some((effect) =>
          isNaN(this.ability.specialEffectsCosts[effect])
        )
      ) {
        return true;
      }
      if (this.ability.name === undefined || this.ability.name === "") {
        return true;
      }
      if (
        (!this.isEdit || this.givenAbility.name !== this.ability.name) &&
        this.cog.cogAbilities.some(
          (ability) => ability.name === this.ability.name
        )
      ) {
        // no duplicate names
        return true;
      }
      if (traitAndWeaknessNames(this.cog).includes(this.ability.name)) {
        // no duplicate names even with other traits and weaknesses
        return true;
      }
      return false;
    },
  },
  methods: {
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
    costStr(option) {
      return `Cost: ${cogOption2AP(this.optionsMap, option)} AP`;
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
    emitCreate() {
      this.$emit("createAbility", {
        data: this.ability,
        index: this.index,
      });
      this.resetData();
    },
    emitDelete() {
      this.$emit("deleteAbility", this.index);
      this.resetData();
    },
    resetData() {
      this.ability = {
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
      };
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 800px) {
  .stickyHeader {
    top: var(--total-nav-height);
  }
}
</style>
