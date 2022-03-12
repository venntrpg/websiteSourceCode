<template>
  <div>
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav">
      <button
        v-on:click="toggleNavButton()"
        v-bind:class="getMobileSidebarClass"
        class="btn navButton subNavButton noSelect createNavButton"
      >
        CREATE COG
      </button>
      <button
        v-on:click="toggleNavButton()"
        v-bind:class="getMobileSidebarClass"
        class="btn navButton subNavButton noSelect statsNavButton"
      >
        SHOW STATS
      </button>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar" v-bind:class="getMobileSidebarClass">
      <combat-stats :character="enemy" :isCog="true" :showAbilities="true" />
    </div>
    <!--  --------------------- START OF COG CREATION FLOW --------------------- -->
    <div class="page sideBarPage" v-bind:class="getMobileSidebarClass">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <h1 class="centeredText">CREATE BATTLE COG</h1>
        <h2>Step 1: Cog Name</h2>
        <div class="alignRow gap">
          <label for="enemyType" class="nowrap">Cog Name:</label>
          <input
            type="text"
            v-model="cog.name"
            placeholder="Wind Elemental"
            v-on:blur="backup"
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
            v-model="cog.level"
            placeholder="5"
            v-on:blur="backup"
            id="enemyLevel"
            class="input tiny"
          />
        </div>
        <!--
        <h2>Step 3: Choose Number of Copies</h2>
        <p class="textBlock">
          By default, Cogs have at least 3 copies or a number of copies equal to
          the number of players.
          <span v-if="defaultPCCount !== 0">
            It appears there are {{ defaultPCCount }} player characters
            registered to the campaign "{{ campaign.name }}"
          </span>
        </p>
        <div class="alignRow gap">
          <label for="numberPCs" class="nowrap">
            Number of player characters:
          </label>
          <input
            type="number"
            min="1"
            v-model="cog.numberPCs"
            :placeholder="defaultPCCount"
            v-on:blur="backup"
            id="numberPCs"
            class="input tiny"
          />
        </div>
        <p class="textBlock">
          By default, there are {{ defaultCopies }} copies of this enemy.
          However, you may reduce the copies by 1 to gain an extra 2AP to spend
          on abilities.
        </p>
        <div class="alignRow gap">
          <label for="numberCopies" class="nowrap">Number of cog copies:</label>
          <input
            type="number"
            min="1"
            :max="playerCount"
            v-model="cog.numberCopies"
            :placeholder="defaultCopies"
            v-on:blur="backup"
            id="NumberCopies"
            class="input tiny"
          />
        </div>
        -->
        <h2>Step 3: Choose Template</h2>
        <p>Each Cog gains 1 Template.</p>
        <radio-button-selection
          :options="templateOptions"
          :selected="cog.template"
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
          :cogType="cog.type"
          :lvl="cog.level"
          @cogTypeUpdated="cogTypeUpdated"
        />
        <h2>Step 5: Create Abilities</h2>
        <p class="textBlock">
          Cogs have 2L AP to spend on
          <a
            href="https://vennt.fandom.com/wiki/Foe_Ability"
            target="_blank"
            class="link"
            >Foe Abilities</a
          >. For example, they can have one ability of 2L AP, or two abilities
          of L AP each, or one worth L AP and two worth L/2 AP each.
        </p>
        <cog-ability-editable-list
          :cog="enemy"
          :totalAP="totalAP"
          :cogAbilities="cog.cogAbilities"
          @updateAbilities="updateCogAbilities"
        />
        <h2>Step 6: Choose Traits</h2>
        <p class="textBlock">A Cog gains 3 + L/2 Traits.</p>
        <p class="textBlock">
          To take a Trait labeled II or III, etc., the I Trait must be taken
          first, and the better version replaces the lesser one.
        </p>
        <h2>Step 7: Choose Weaknesses</h2>
        <p class="textBlock">
          A Cog starts with 1 Weakness. For each additional Weakness taken, gain
          1 Trait. A Cog cannot have more than {{ lvlStr() }} Weaknesses.
        </p>
        <h2>Step 8: Create Enemy</h2>
        <button v-on:click="createEnemyButton" class="btn roundedButton">
          Create Enemy
        </button>
        <button v-on:click="deleteEnemy" class="btn roundedButton clear">
          Delete Enemy
        </button>
        <div class="tall"></div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import CogTypeSelection from "./CogTypeSelection.vue";
import { ResponsiveDirective } from "vue-responsive-components";
import { mapState } from "vuex";
import CogAbilityEditableList from "./CogAbilityEditableList.vue";
import CombatStats from "../Common/CombatStats.vue";

const COG_LOCAL_STORAGE = "creation-cog-wip";

export default {
  name: "CogFlow",
  components: {
    RadioButtonSelection,
    CogTypeSelection,
    CogAbilityEditableList,
    CombatStats,
  },
  directives: {
    responsive: ResponsiveDirective,
  },
  data() {
    return {
      showingStats: false,
      breakpoints: {
        bp900: (el) => el.width < 900,
        bp600: (el) => el.width < 600,
      },
      cog: {
        name: "",
        level: "",
        numberPCs: "",
        numberCopies: "",
        template: "",
        type: "",
        cogAbilities: [],
      },
    };
  },
  beforeMount() {
    const rawCog = localStorage.getItem(COG_LOCAL_STORAGE);
    if (rawCog) {
      try {
        const cog = JSON.parse(rawCog);
        // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
        if (cog.cogAbilities === undefined) {
          // TODO: Remove this. This is a temporary solution to delete previous saved items which are no longer valid
          throw "invalid saved item";
        }
        this.cog = cog;
      } catch (e) {
        // stored json was malformed, so we delete it and restart fresh
        localStorage.removeItem(COG_LOCAL_STORAGE);
      }
    }
  },
  computed: {
    ...mapState(["campaign"]),
    getMobileSidebarClass() {
      return this.showingStats ? "showStats" : "";
    },
    /*
    defaultPCCount() {
      if (this.campaign && this.campaign.entities && this.campaign.members) {
        const entities = Object.keys(this.campaign.entities).filter((uuid) =>
          uuid.startsWith("C")
        ).length;
        const players = Object.entries(this.campaign.members).filter(
          (role) => role === "player"
        ).length;
        return Math.max(entities, players);
      }
      return 3; // 3 is default
    },
    playerCount() {
      return this.cog.numberPCs
        ? parseInt(this.cog.numberPCs)
        : this.defaultPCCount;
    },
    defaultCopies() {
      return Math.max(this.playerCount, 3);
    },
    copiesCount() {
      return Math.max(
        this.cog.numberCopies
          ? parseInt(this.cog.numberCopies)
          : this.defaultCopies,
        1
      );
    },
    */
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
      const abilities = [];
      this.cog.cogAbilities.forEach((ability) =>
        abilities.push(ability.formatted)
      );
      return {
        name: this.cog.name,
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
        template: this.cog.template,
        cogType: this.cog.type,
        level: this.cog.level,
        acc: this.calculateAcc,
        // copies: this.copiesCount,
        abilities,
      };
    },
    calculateHP() {
      if (!this.cog.level) {
        return 1;
      }
      const level = parseInt(this.cog.level);
      let hp = Math.max(level * 5, 1);
      // allow space for traits to effect things here
      return hp;
    },
    calculateMP() {
      if (!this.cog.level) {
        return 0;
      }
      const level = parseInt(this.cog.level);
      let mp = Math.max(level, 0);
      if (this.cog.template === "tank") {
        mp += level;
      }
      // allow space for traits to effect things here
      return mp;
    },
    calculateVim() {
      if (!this.cog.level) {
        return 0;
      }
      let level = parseInt(this.cog.level);
      if (this.cog.template === "agile") {
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
      if (this.cog.template === "tank") {
        vim += 10;
      } else if (this.cog.template === "fighter") {
        vim += 5;
      }
      // allow space for traits to effect things here
      return vim;
    },
    calculateArmor() {
      let armor = 0;
      if (this.cog.template === "tank") {
        const level = !this.cog.level ? 0 : parseInt(this.cog.level);
        armor += level;
      }
      // allow space for traits to effect things here
      return armor;
    },
    calculateInit() {
      if (!this.cog.level) {
        return 0;
      }
      let level = parseInt(this.cog.level);
      if (this.cog.template === "agile") {
        level += 2;
      }
      let init = level + 11;
      if (level > 14) {
        init = level * 2;
      }
      if (this.cog.template === "mook") {
        init -= 6;
      }
      // allow space for traits to effect things here
      return init;
    },
    calculateSpeed() {
      if (!this.cog.level) {
        return 0;
      }
      let level = parseInt(this.cog.level);
      if (this.cog.template === "agile") {
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
    calculateAcc() {
      if (!this.cog.level) {
        return 0;
      }
      const level = parseInt(this.cog.level);
      let acc = Math.max(level * 5, 0);
      if (level >= 6) {
        acc += 5;
      }
      if (level >= 9) {
        acc += 5;
      }
      if (level >= 12) {
        acc += 5;
      }
      if (level > 14) {
        acc = level * 6;
      }
      return acc;
    },
    totalAP() {
      if (!this.cog.level) {
        return 0;
      }
      const level = parseInt(this.cog.level);
      let ap = level * 2;
      if (this.cog.template === "mook") {
        ap = level;
      }
      //ap += Math.max(2 * (this.playerCount - this.copiesCount), 0);
      return ap;
    },
  },
  methods: {
    toggleNavButton() {
      this.showingStats = !this.showingStats;
    },
    backup() {
      localStorage.setItem(COG_LOCAL_STORAGE, JSON.stringify(this.cog));
    },
    templateUpdated(newTemplate) {
      this.cog.template = newTemplate;
      this.backup();
    },
    cogTypeUpdated(newCogType) {
      this.cog.type = newCogType;
      this.backup();
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
    calculateAttribute(attr) {
      if (!this.cog.level) {
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
        this.cog.type &&
        negativeMap[this.cog.type] &&
        negativeMap[this.cog.type].includes(attr)
      ) {
        return -2;
      }
      if (
        this.cog.type &&
        useLMap[this.cog.type] &&
        useLMap[this.cog.type].includes(attr)
      ) {
        return parseInt(this.cog.level); // Equal to L
      }
      return Math.round(parseInt(this.cog.level) / 2);
    },
    updateCogAbilities(newCogAbilities) {
      this.cog.cogAbilities = newCogAbilities;
      this.backup();
    },
    createEnemyButton() {
      console.log(this.enemy);
    },
    deleteEnemy() {
      localStorage.removeItem(COG_LOCAL_STORAGE);
      this.cog = {
        name: "",
        level: "",
        numberPCs: "",
        numberCopies: "",
        template: "",
        type: "",
        cogAbilities: [],
      };
    },
  },
};
</script>

<style scoped>
/* subNav and sideBar Styles */
.subNav {
  display: none;
  justify-content: center;
}
.createNavButton:not(.showStats) {
  display: none;
}
.statsNavButton.showStats {
  display: none;
}

@media screen and (max-width: 800px) {
  .subNav {
    display: flex;
  }
  .page {
    margin-top: var(--total-nav-height);
  }
  .sideBar {
    top: var(--total-nav-height);
    height: var(--sub-nav-page-height);
    width: 100%;
  }
  .sideBar:not(.showStats) {
    display: none;
  }
  .sideBar.showStats {
    display: block;
  }
  .sideBarPage:not(.showStats) {
    display: flex;
    margin-left: 0px;
  }
  .sideBarPage.showStats {
    display: none;
  }
}
</style>
