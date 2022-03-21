<template>
  <div>
    <!--  --------------------- SUB NAV --------------------- -->
    <nav class="subNav">
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
    </nav>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar" v-bind:class="getMobileSidebarClass">
      <combat-stats :character="enemy" :isCog="true" :showAbilities="true" />
    </div>
    <!--  --------------------- START OF COG CREATION FLOW --------------------- -->
    <div class="page sideBarPage" v-bind:class="getMobileSidebarClass">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <h1 class="centeredText">CREATE COMBAT COG</h1>
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
          :cog="cog"
          :totalAP="totalAP"
          :usedAP="usedAP"
          :cogAbilities="cog.cogAbilities"
          @updateAbilities="updateCogAbilities"
        />
        <h2>Step 6: Choose Traits</h2>
        <p class="textBlock">A Cog gains 3 + L/2 Traits.</p>
        <p class="textBlock">
          To take a Trait labeled II or III, etc., the I Trait must be taken
          first, and the better version replaces the lesser one.
        </p>
        <cog-traits
          :cog="cog"
          :selected="cog.traits"
          :totalTraits="totalTraits"
          @newTraitsList="updateTraits"
        />
        <h2>Step 7: Choose Weaknesses</h2>
        <p class="textBlock">
          A Cog starts with 1 Weakness. For each additional Weakness taken, gain
          1 Trait. A Cog cannot have more than {{ lvlStr() }} Weaknesses.
        </p>
        <cog-weaknesses
          :cog="cog"
          :selected="cog.weaknesses"
          @newWeaknessesList="updateWeaknesses"
        />
        <h2>Step 8: Create Enemy</h2>
        <div class="alignRow split">
          <confirmation-modal
            :buttonText="'Create Enemy'"
            :confStr="'Create'"
            :details="'Are you sure you are done editing this enemy? Once the enemy is saved to the server, most fields will be editable.'"
            @mainButton="createEnemyButton"
          />
          <confirmation-modal
            :buttonText="'Delete Enemy'"
            :buttonClass="'clear'"
            :confStr="'Delete'"
            :details="'Are you sure you want to delete this enemy? It will not be saved!'"
            @mainButton="deleteEnemy"
          />
        </div>
        <div class="tall"></div>
        <div class="alignRow split">
          <h3>Enemy in basic string format</h3>
          <button
            v-on:click="copyEnemyButton()"
            class="btn basicBtn toolTipTrigger"
          >
            <div class="basicBtnContents">
              <span class="material-icons space">content_copy</span>
              Copy
            </div>
            <div class="toolTip">Copy text version of Cog</div>
          </button>
        </div>
        <div class="card border padded column">
          <code v-html="enemyText2HTML"></code>
        </div>
        <div class="tall"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ResponsiveDirective } from "vue-responsive-components";
import { mapState } from "vuex";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import CogTypeSelection from "./CogTypeSelection.vue";
import CogAbilityEditableList from "./CogAbilityEditableList.vue";
import CombatStats from "../Common/CombatStats.vue";
import CogTraits from "./CogTraits.vue";
import ConfirmationModal from "../Common/ConfirmationModal.vue";
import CogWeaknesses from "./CogWeaknesses.vue";
import { cogFormattedAbility } from "./CogFlowUtils/CogAbilityCreationUtils";
import {
  bestSelectedTraitsMap,
  attrLevelAdjustments,
  attrAdjustments,
  attrMultipliers,
  formatTraits,
} from "./CogFlowUtils/CogTraitsUtils";
import {
  cogTypeAttrVal,
  cogTypeTitle,
} from "./CogFlowUtils/CogTypeDescriptionUtils";
import {
  COG_ABILITY_TYPE,
  COG_TRAIT_TYPE,
  COG_WEAKNESS_TYPE,
} from "./CogFlowUtils/CogConstants";

const COG_LOCAL_STORAGE = "creation-cog-wip";

// TODO: Start storing temporary cog data in vue module??
// Should help with a lot of the info emits I am doing here

export default {
  name: "CogFlow",
  components: {
    RadioButtonSelection,
    CogTypeSelection,
    CogAbilityEditableList,
    CombatStats,
    CogTraits,
    ConfirmationModal,
    CogWeaknesses,
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
        template: "",
        type: "",
        cogAbilities: [],
        traits: [],
        weaknesses: [],
      },
    };
  },
  beforeMount() {
    const rawCog = localStorage.getItem(COG_LOCAL_STORAGE);
    if (rawCog) {
      try {
        const cog = JSON.parse(rawCog);
        // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
        if (
          cog.traits === undefined ||
          cog.cogAbilities === undefined ||
          (cog.cogAbilities.length > 0 &&
            cog.cogAbilities[0].formatted !== undefined)
        ) {
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
    formattedCogAbilities() {
      return this.cog.cogAbilities.map((ability) =>
        cogFormattedAbility(this.cog, ability)
      );
    },
    bestCogTraitsMap() {
      return bestSelectedTraitsMap(this.cog);
    },
    attrTypes() {
      return ["agi", "cha", "dex", "int", "per", "spi", "str", "tek", "wis"];
    },
    enemy() {
      const abilities = this.formattedCogAbilities.concat(
        formatTraits(this.cog, this.bestCogTraitsMap)
      );
      const enemy = {
        name: this.cog.name,
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
        abilities,
      };
      // add attributes
      this.attrTypes.forEach((attr) => {
        enemy[attr] = this.calculateAttribute(attr);
      });
      // add special fields if they need to be set
      const specialFields = ["radius", "reach"];
      specialFields
        .map((field) => {
          return { field, val: attrAdjustments(this.bestCogTraitsMap, field) };
        })
        .filter((pair) => pair.val !== 0)
        .forEach((pair) => {
          enemy[pair.field] = pair.val;
        });
      return enemy;
    },
    enemy2Text() {
      // works off only this.enemy fields - could be exported into util JS file
      const template =
        this.enemy.template.length > 0
          ? this.enemy.template.charAt(0).toUpperCase() +
            this.enemy.template.slice(1)
          : "";
      let enemyText = `${this.enemy.name}\nLevel ${
        this.enemy.level
      } ${template} ${cogTypeTitle(this.enemy.cogType)}\nInit: ${
        this.enemy.init
      }\nHP: ${this.enemy.hp}\nVim: ${this.enemy.vim}\nSpeed: ${
        this.enemy.speed
      }`;
      if (this.enemy.armor > 0) {
        enemyText += `\nArmor: ${this.enemy.armor}`;
      }

      enemyText += "\n";
      this.attrTypes.forEach((attr) => {
        enemyText += `${attr.toUpperCase()}: ${this.enemy[attr]}  `;
      });

      const formatAbility = (ability) => {
        let abilityStr = `${ability.name}\nActivation: ${ability.activation}\n`;
        if (ability.range !== undefined) {
          abilityStr += `Range: ${ability.range}\n`;
        }
        abilityStr += ability.effect + "\n\n";
        return abilityStr;
      };

      const abilities = this.enemy.abilities.filter(
        (ability) => ability.specialAbilityType === COG_ABILITY_TYPE
      );
      if (abilities.length > 0) {
        enemyText += "\n\n\nAbilites:\n";
        abilities.forEach((ability) => {
          enemyText += formatAbility(ability);
        });
      }

      const traits = this.enemy.abilities.filter(
        (ability) => ability.specialAbilityType === COG_TRAIT_TYPE
      );
      if (traits.length > 0) {
        enemyText += "\n\nTraits:\n";
        traits.forEach((ability) => {
          enemyText += formatAbility(ability);
        });
      }

      const weaknesses = this.enemy.abilities.filter(
        (ability) => ability.specialAbilityType === COG_WEAKNESS_TYPE
      );
      if (weaknesses.length > 0) {
        enemyText += "\n\nWeaknesses:\n";
        weaknesses.forEach((ability) => {
          enemyText += formatAbility(ability);
        });
      }

      return enemyText;
    },
    enemyText2HTML() {
      return this.enemy2Text.replaceAll("\n", "<br>");
    },
    calculateHP() {
      if (!this.cog.level) {
        return 1;
      }
      let level = parseInt(this.cog.level);
      level += attrLevelAdjustments(this.bestCogTraitsMap, "hp");
      let hp = Math.max(level * 5, 1);
      hp += attrAdjustments(this.bestCogTraitsMap, "hp");
      if (hp < 1) {
        // hp cannot be less than 1
        hp = 1;
      }
      return hp;
    },
    calculateMP() {
      if (!this.cog.level) {
        return 0;
      }
      const level = parseInt(this.cog.level);
      let mp = Math.max(level, 0);
      if (this.cog.template === "magician") {
        mp += level;
      }
      // no traits currently effect MP
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
      level += attrLevelAdjustments(this.bestCogTraitsMap, "vim");
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
      vim += attrAdjustments(this.bestCogTraitsMap, "vim");
      return vim;
    },
    calculateArmor() {
      let armor = 0;
      if (this.cog.template === "tank") {
        const level = !this.cog.level ? 0 : parseInt(this.cog.level);
        armor += level;
      }
      armor += attrAdjustments(this.bestCogTraitsMap, "armor");
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
      level += attrLevelAdjustments(this.bestCogTraitsMap, "speed");
      let speed = level + 3;
      if (level >= 2) {
        speed = Math.round((level + 7) / 2);
      }
      if (level > 14) {
        speed = level;
      }
      speed *= attrMultipliers(this.bestCogTraitsMap, "speed");
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
      if (this.cog.template === "fighter") {
        acc += 20;
      }
      acc += attrAdjustments(this.bestCogTraitsMap, "acc");
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
      ap += attrAdjustments(this.bestCogTraitsMap, "ap");
      return ap;
    },
    usedAP() {
      return this.formattedCogAbilities.reduce(
        (sum, ability) => sum + ability.ap,
        0
      );
    },
    totalTraits() {
      if (!this.cog.level) {
        return 0;
      }
      const halfLevel = Math.round(parseInt(this.cog.level) / 2);
      let traits = Math.max(3 + halfLevel, 0);
      if (this.cog.template === "specialist") {
        traits += halfLevel;
      }
      if (this.cog.weaknesses.length > 1) {
        traits += this.cog.weaknesses.length - 1;
      }
      return traits;
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
    updateCogAbilities(newCogAbilities) {
      this.cog.cogAbilities = newCogAbilities;
      this.backup();
    },
    updateTraits(newTraits) {
      this.cog.traits = newTraits;
      this.backup();
    },
    updateWeaknesses(newWeaknesses) {
      this.cog.weaknesses = newWeaknesses;
      this.backup();
    },
    calculateAttribute(attr) {
      if (!this.cog.level) {
        return 0;
      }
      let level = parseInt(this.cog.level);
      level += attrLevelAdjustments(this.bestCogTraitsMap, attr);
      const cogTypeVal = cogTypeAttrVal(level, this.cog.type, attr);
      if (cogTypeVal !== undefined) {
        return cogTypeVal;
      }
      return Math.round(level / 2);
    },
    createEnemyButton() {
      console.log(this.enemy);
    },
    deleteEnemy() {
      localStorage.removeItem(COG_LOCAL_STORAGE);
      this.cog = {
        name: "",
        level: "",
        template: "",
        type: "",
        cogAbilities: [],
        traits: [],
        weaknesses: [],
      };
    },
    copyEnemyButton() {
      navigator.clipboard.writeText(this.enemy2Text);
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
