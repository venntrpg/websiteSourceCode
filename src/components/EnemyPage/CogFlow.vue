<template>
  <div class="page">
    <div class="largePageWidth main" v-responsive="breakpoints">
      <h1 class="centeredText">CREATE COG</h1>
      <h2>Step 1: Cog Name</h2>
      <div class="alignRow gap">
        <label for="enemyType" class="nowrap">Cog Name:</label>
        <input
          type="text"
          v-model="cogName"
          placeholder="Wind Elemental"
          id="enemyType"
          class="input shortenned"
        />
      </div>
      <h2>Step 2: Choose Level</h2>
      <p class="textBlock">
        A Cog’s stats revolve around their Level (L). Always round up when
        calculating L/2.
      </p>
      <p class="textBlock">
        Each Encounter can have a difficulty of Easy, Medium, or Hard. This
        difficulty sets what the sum of Cogs’ Levels should be in relation to
        the sum of the Players’ Levels.
      </p>
      <div class="alignRow gap">
        <label for="enemyLevel" class="nowrap">Cog Level:</label>
        <input
          type="number"
          v-model="cogLevel"
          placeholder="5"
          id="enemyLevel"
          class="input shortenned"
        />
      </div>
      <h2>Step 3: Choose Template</h2>
      <p>Each Cog gains 1 Template.</p>
      <radio-button-selection
        :options="templateOptions"
        :selected="template"
        @selectedUpdated="templateUpdated"
      />
      <h2>Step 4: Choose Type</h2>
      <p class="textBlock">
        Each Cog gains 1 Type. A Cog's Attributes are all equal to
        {{ lvlStr("L/2", (lvl) => Math.round(lvl / 2)) }} unless otherwise
        specified by their Type. These Attributes are used ONLY for Attribute
        checks, and do not affect secondary stats such as Accuracy or Speed. A
        Cog never uses its Attributes for the purpose of Accuracy or bonus
        damage.
      </p>
      <cog-type-selection
        :cogType="cogType"
        :lvl="cogLevel"
        @cogTypeUpdated="cogTypeUpdated"
      />
      <h2>Step 4: Create Abilities</h2>
      <p class="textBlock">
        Cogs have 2L AP to spend on
        <a
          href="https://vennt.fandom.com/wiki/Foe_Ability"
          target="_blank"
          class="link"
          >Foe Abilities</a
        >. For example, they can have one ability of 2L AP, or two abilities of
        L AP each, or one worth L AP and two worth L/2 AP each.
      </p>
      <cog-ability-creation :cog="enemy" />
      <h2>Step 5: Choose Traits</h2>
      <p class="textBlock">
        A Cog gains 3 + L/2 Traits, plus 1 for each player beyond 3.
      </p>
      <p class="textBlock">
        To take a Trait labeled II or III, etc., the I Trait must be taken
        first, and the better version replaces the lesser one.
      </p>
      <h2>Step 6: Choose Weaknesses</h2>
      <p class="textBlock">
        A Cog starts with 1 Weakness. For each additional Weakness taken, gain 1
        Trait. A Cog cannot have more than {{ lvlStr() }} Weaknesses.
      </p>
      <h2>Step 7: Create Enemy</h2>
      <button v-on:click="createEnemyButton" class="btn roundedButton">
        Create Enemy
      </button>
      <div class="tall"></div>
    </div>
  </div>
</template>

<script>
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import CogTypeSelection from "./CogTypeSelection.vue";
import { ResponsiveDirective } from "vue-responsive-components";
import CogAbilityCreation from "./CogAbilityCreation.vue";

export default {
  name: "CogFlow",
  components: {
    RadioButtonSelection,
    CogTypeSelection,
    CogAbilityCreation,
  },
  directives: {
    responsive: ResponsiveDirective,
  },
  data() {
    return {
      breakpoints: {
        bp900: (el) => el.width < 900,
        bp600: (el) => el.width < 600,
      },
      cogName: "",
      cogLevel: "",
      template: "",
      cogType: "",
    };
  },
  computed: {
    templateOptions() {
      return {
        mook: `<b>Mook:</b> This Cog loses -6 Initiative and has only ${this.lvlStr()} AP (instead of ${this.lvlStr(
          "2L",
          (lvl) => lvl * 2
        )} AP) to spend on Foe Abilities.`,
        tank: `<b>Tank:</b> This Cog gains ${this.lvlStr()} Armor and +10 Vim.`,
        fighter: "<b>Fighter:</b> This Cog gains +20 Accuracy and +5 Vim.",
        bruiser:
          "<b>Bruiser:</b> This Cog deals +6 damage on all attacks that deal damage.",
        agile:
          "<b>Agile:</b> This Cog’s Level is treated as 2 higher for the purpose of Vim, Speed, and Initiative.",
        magician: `<b>Magician:</b> This Cog gains ${this.lvlStr()} MP.`,
        specialist: `<b>Specialist:</b> This Cog gains an additional ${this.lvlStr(
          "L/2",
          (lvl) => Math.round(lvl / 2)
        )} Traits.`,
      };
    },
    enemy() {
      return {
        name: this.cogName,
        agi: this.calculateAttribute("agi"),
        cha: this.calculateAttribute("cha"),
        dex: this.calculateAttribute("dex"),
        int: this.calculateAttribute("int"),
        per: this.calculateAttribute("per"),
        spi: this.calculateAttribute("spi"),
        str: this.calculateAttribute("str"),
        tek: this.calculateAttribute("tek"),
        wis: this.calculateAttribute("wis"),
        hp: this.calculateHP,
        maxHp: this.calculateHP,
        mp: this.calculateMP,
        maxMp: this.calculateMP,
        vim: this.calculateVim,
        maxVim: this.calculateVim,
        armor: this.calculateArmor,
        init: this.calculateInit,
        speed: this.calculateSpeed,
        // non-standard character fields
        template: this.template,
        level: this.cogLevel,
      };
    },
    calculateHP() {
      if (!this.cogLevel) {
        return 1;
      }
      const level = parseInt(this.cogLevel);
      let hp = Math.max(level * 5, 1);
      // allow space for traits to effect things here
      return hp;
    },
    calculateMP() {
      if (!this.cogLevel) {
        return 0;
      }
      const level = parseInt(this.cogLevel);
      let mp = Math.max(level, 0);
      if (this.template === "tank") {
        mp += level;
      }
      // allow space for traits to effect things here
      return mp;
    },
    calculateVim() {
      if (!this.cogLevel) {
        return 0;
      }
      let level = parseInt(this.cogLevel);
      if (this.template === "agile") {
        level += 2;
      }
      let vim = Math.max(level * 5, 0);
      // see https://vennt.fandom.com/wiki/Course_of_Foes#Stats
      if (level >= 3) {
        vim += 10;
      }
      if (level >= 6) {
        vim += 5;
      }
      if (level >= 9) {
        vim += 5;
      }
      if (level >= 12) {
        vim += 5;
      }
      if (level > 14) {
        vim = level * 8;
      }
      if (this.template === "tank") {
        vim += 10;
      } else if (this.template === "fighter") {
        vim += 5;
      }
      // allow space for traits to effect things here
      return vim;
    },
    calculateArmor() {
      let armor = 0;
      if (this.template === "tank") {
        const level = !this.cogLevel ? 0 : parseInt(this.cogLevel);
        armor += level;
      }
      // allow space for traits to effect things here
      return armor;
    },
    calculateInit() {
      if (!this.cogLevel) {
        return 0;
      }
      let level = parseInt(this.cogLevel);
      if (this.template === "agile") {
        level += 2;
      }
      let init = level + 11;
      if (level > 14) {
        init = level * 2;
      }
      if (this.template === "mook") {
        init -= 6;
      }
      // allow space for traits to effect things here
      return init;
    },
    calculateSpeed() {
      if (!this.cogLevel) {
        return 0;
      }
      let level = parseInt(this.cogLevel);
      if (this.template === "agile") {
        level += 2;
      }
      let speed = level + 3;
      if (level >= 2) {
        speed = Math.round((level + 7) / 2);
      }
      if (level > 14) {
        speed = level;
      }
      // allow space for traits to effect things here
      return speed;
    },
  },
  methods: {
    templateUpdated(newTemplate) {
      this.template = newTemplate;
    },
    cogTypeUpdated(newCogType) {
      this.cogType = newCogType;
    },
    lvlStr(def, fun) {
      if (!this.cogLevel) {
        if (!def) {
          return "L";
        }
        return def;
      }
      if (!fun) {
        return this.cogLevel;
      }
      return fun(parseInt(this.cogLevel));
    },
    calculateAttribute(attr) {
      if (!this.cogLevel) {
        return 0;
      }
      const negativeMap = {
        automata: ["cha", "wis", "spi"],
        beastFlora: ["wis", "tek", "int"],
        undead: ["cha", "tek", "spi", "int"],
      };
      const useLMap = {
        automata: ["tek"],
        beastFlora: ["str", "dex", "per", "agi"],
        monster: ["str", "dex", "per", "agi"],
      };
      if (
        this.cogType &&
        negativeMap[this.cogType] &&
        negativeMap[this.cogType].includes(attr)
      ) {
        return -2;
      }
      if (
        this.cogType &&
        useLMap[this.cogType] &&
        useLMap[this.cogType].includes(attr)
      ) {
        return parseInt(this.cogLevel); // Equal to L
      }
      return Math.round(parseInt(this.cogLevel) / 2);
    },
    createEnemyButton() {
      console.log(this.enemy);
    },
  },
};
</script>

<style scoped>
.input.shortenned {
  max-width: 400px;
}
</style>
