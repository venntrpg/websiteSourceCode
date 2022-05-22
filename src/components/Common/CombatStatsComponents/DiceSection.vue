<template>
  <div>
    <div class="alignRow split">
      <div class="labelText stronger">
        <a
          v-if="isAttribute"
          v-bind:href="getAttrLink"
          target="_blank"
          class="link stealth"
          >{{ attrFullName }}</a
        >
        <span v-else>{{ attrFullName }}</span>
        (
        <span class="number">{{ character[attr] }}</span>
        )
      </div>
      <button
        v-if="!useCopyableDice"
        v-on:click="rollButton"
        class="btn basicBtn noSelect"
      >
        <div class="basicBtnContents">
          <span class="material-icons selected space">casino</span>
          Roll {{ attr.toUpperCase() }}
        </div>
      </button>
    </div>
    <div v-if="!useCopyableDice" class="diceSection mt-8">
      <div v-if="showDice">
        <dice-render :roll="dice" />
        <div>
          Dice Rolled:
          <span class="number">{{ diceNotation }}</span>
        </div>
        <div>
          Average Roll:
          <span class="number">{{ diceAverage }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <dice-copy
        :attr="attr"
        :character="character"
        :settings="defaultDiceSettings"
        class="mt-8 mb-8"
      />
      <button
        v-if="!diceDropDown"
        v-on:click="toggleDiceDropDown"
        class="btn basicBtn wide"
      >
        <div class="basicBtnContents">
          <span class="material-icons">keyboard_arrow_down</span>
          Show Other Dice Options
        </div>
      </button>
      <div v-else class="card column">
        <button v-on:click="toggleDiceDropDown" class="btn basicBtn wide">
          <div class="basicBtnContents">
            <span class="material-icons">keyboard_arrow_up</span>
            Hide Other Dice Options
          </div>
        </button>
        <div class="seperator thin"></div>
        <div class="labelText mt-8 ml-8">Hero Point boost:</div>
        <dice-copy
          :attr="attr"
          :character="character"
          :settings="heroPointDiceSettings"
          class="mt-8"
        />
        <div class="labelText mt-8 ml-8">Other common settings:</div>
        <check-box
          :checked="defaultDiceSettings.flow"
          :highlight="true"
          text="Flow"
          @toggled="toggleDiceSetting('flow')"
          class="mt-8"
        />
        <check-box
          :checked="defaultDiceSettings.ebb"
          :highlight="true"
          text="Ebb"
          @toggled="toggleDiceSetting('ebb')"
          class="mt-8"
        />
        <check-box
          :checked="defaultDiceSettings.rr1s"
          :highlight="true"
          text="Re-roll All 1s"
          @toggled="toggleDiceSetting('rr1s')"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DiceRoll } from "rpg-dice-roller";
import DiceRender from "./DiceRender.vue";
import DiceCopy from "./DiceCopy.vue";
import CheckBox from "../CheckBox.vue";
import { ATTRIBUTES } from "../../../utils/constants";
import { getAttrFullName } from "../../../utils/attributeUtils";
import { defaultDice } from "../../../utils/diceUtils";

export default {
  components: { DiceRender, DiceCopy, CheckBox },
  name: "DiceSection",
  props: {
    character: Object,
    attr: String,
    useCopyableDice: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState("dice", ["latestRoll", "defaultDiceSettings", "diceDropDown"]),
    attrFullName() {
      return getAttrFullName(this.attr);
    },
    isAttribute() {
      return ATTRIBUTES.includes(this.attr);
    },
    getAttrLink() {
      return `https://vennt.fandom.com/wiki/${
        this.attrFullName
      }_(${this.attr.toUpperCase()})`;
    },
    dice() {
      return this.latestRoll[this.attr];
    },
    showDice() {
      return this.dice !== null && this.dice !== undefined;
    },
    diceNotation() {
      return this.dice.notation;
    },
    diceAverage() {
      return this.dice.averageTotal;
    },
    heroPointDiceSettings() {
      return {
        ...this.defaultDiceSettings,
        drop: 1,
        end: "+9",
      };
    },
  },
  methods: {
    rollButton() {
      const rollStr = defaultDice(
        this.character,
        this.attr,
        this.defaultDiceSettings
      ).web;
      this.$store.commit("dice/updateLatestRoll", {
        attr: this.attr,
        roll: new DiceRoll(rollStr),
      });
    },
    toggleDiceDropDown() {
      this.$store.commit("dice/toggleDiceDropDown");
    },
    toggleDiceSetting(setting) {
      this.$store.commit("dice/toggleDiceSetting", setting);
    },
  },
};
</script>

<style scoped>
.diceSection {
  min-height: 90px;
}
</style>
