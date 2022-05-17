<template>
  <div class="panel mb-64">
    <div class="centeredText">
      <h2>{{ character.name }}</h2>
    </div>
    <div class="seperator"></div>
    <!-- COMBAT STATS -->
    <div class="alignRow">
      <bullet :character="character" />
      <h2>Combat Stats</h2>
    </div>
    <div>
      <div v-for="(attrRow, index) in combatStatsRows" v-bind:key="index">
        <div class="alignRow split gap">
          <button
            v-for="attr in attrRow"
            v-bind:key="attr"
            v-on:click="attrButton(attr)"
            class="btn basicBtn attrButton noSelect"
            v-bind:class="attrButtonClass(attr)"
          >
            <div class="basicBtnContents attrButtonContents">
              <span class="fractionLabel">{{ attrDisplayName(attr) }}:</span>
              <fraction
                :top="character[attr]"
                :bottom="getAttrMaxValue(attr)"
              />
            </div>
          </button>
        </div>
        <div v-for="(attr, j) in attrRow" v-bind:key="j">
          <div
            v-if="showDropDown(attr)"
            class="card diceDropDown"
            v-bind:class="getDropDownClass(j, attrRow.length)"
          >
            <div class="margin">
              <div v-if="showUpdateDropdown">
                <adjust-attr
                  :attr="attr"
                  :character="character"
                  loc="combat-stats"
                />
                <div class="seperator mt-8 mb-8"></div>
                <adjust-attr-link :attr="attr" />
              </div>
              <attr-help v-else :attr="attr" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ATTRIBUTES -->
    <div class="alignRow">
      <bullet :character="character" />
      <h2>Attributes</h2>
    </div>
    <div v-for="(attrRow, index) in attributeRows" v-bind:key="index">
      <div class="alignRow split gap">
        <button
          v-for="attr in attrRow"
          v-bind:key="attr"
          v-on:click="attrButton(attr)"
          class="btn basicBtn attrButton noSelect"
          v-bind:class="attrButtonClass(attr)"
        >
          <div class="basicBtnContents attrButtonContents">
            <span class="attrLabel">{{ attr.toUpperCase() }}:</span>
            <div class="number">{{ character[attr] }}</div>
          </div>
        </button>
      </div>
      <div v-for="(attr, j) in attrRow" v-bind:key="j">
        <div
          v-if="showDropDown(attr)"
          class="card diceDropDown"
          v-bind:class="getDropDownClass(j, attrRow.length)"
        >
          <div class="margin">
            <div class="alignRow split">
              <div class="attrHeader">
                <a
                  v-bind:href="getAttrLink(attr)"
                  target="_blank"
                  class="link stealth"
                >
                  {{ attrFullName(attr) }}
                </a>
                (
                <span class="number">{{ character[attr] }}</span>
                )
              </div>
              <button
                v-on:click="attrRollButton(attr)"
                class="btn basicBtn noSelect"
              >
                <div class="basicBtnContents">
                  <span class="material-icons selected space">casino</span>
                  Roll {{ attr.toUpperCase() }}
                </div>
              </button>
            </div>
            <div class="diceSection">
              <div v-if="showDice(attr)">
                <DiceRender :roll="getDice(attr)" />
                <div>
                  Dice Rolled:
                  <span class="number">{{ getDiceNotation(attr) }}</span>
                </div>
                <div>
                  Average Roll:
                  <span class="number">{{ getDiceAverage(attr) }}</span>
                </div>
              </div>
            </div>
            <div v-if="showUpdateDropdown">
              <div class="seperator mt-16 mb-16"></div>
              <div class="attrHeaderMargin">Special Conditions:</div>
              <button
                v-on:click="attrRollButtonHeroPoint(attr)"
                :disabled="character.hero <= 0"
                class="btn basicBtn wide noSelect"
              >
                <div class="basicBtnContents">
                  <span class="material-icons selected space">casino</span>
                  Roll Dice using Hero Point
                </div>
              </button>
              <!-- TODO: It would be neat if we could add abilities here too -->
              <div class="seperator mt-16 mb-16"></div>
              <adjust-attr-link :attr="attr" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tall"></div>
    <!-- CUSTOM SINGLE LINE STATS -->
    <button
      v-if="!isEnemy && character.gift"
      v-on:click="attrButton('gift')"
      class="btn basicBtn attrButton noSelect"
      v-bind:class="attrButtonClass('gift')"
    >
      <div class="basicBtnContents attrButtonContents">
        Gift: {{ character.gift }}
      </div>
    </button>
    <div v-if="showDropDown('gift')" class="card diceDropDown left right">
      <gift-description :gift="character.gift" :showTitle="false" />
    </div>
    <div v-if="isEnemy && character.template" class="card stat mb-8">
      Template: {{ character.template }}
    </div>
    <button
      v-if="isEnemy && character.cogType"
      v-on:click="attrButton('cogType')"
      class="btn basicBtn attrButton noSelect"
      v-bind:class="attrButtonClass('cogType')"
    >
      <div class="basicBtnContents attrButtonContents">
        Type: {{ cogTypeTitle }}
      </div>
    </button>
    <div v-if="showDropDown('cogType')" class="card diceDropDown left right">
      <cog-type-description :cogType="character.cogType" :showTitle="false" />
    </div>
    <!-- SINGLE LINE STATS -->
    <div v-for="attr in singleRowAttributes" v-bind:key="attr">
      <button
        v-on:click="attrButton(attr)"
        class="btn basicBtn attrButton noSelect"
        v-bind:class="attrButtonClass(attr)"
      >
        <div class="basicBtnContents attrButtonContents">
          <span class="attrLabelWide">{{ attrDisplayName(attr) }}:</span>
          <div class="number">{{ character[attr] }}</div>
        </div>
      </button>
      <div v-if="showDropDown(attr)" class="card diceDropDown left right">
        <div class="margin">
          <div v-if="showUpdateDropdown">
            <adjust-attr
              v-if="singleRowShowAdjust(attr)"
              :attr="attr"
              :character="character"
              loc="combat-stats"
            />
            <attr-help v-else :attr="attr" />
            <div class="seperator mt-8 mb-8"></div>
            <adjust-attr-link :attr="attr" />
          </div>
          <attr-help v-else :attr="attr" />
        </div>
      </div>
    </div>
    <!-- ABILITIES -->
    <div
      v-if="
        showAbilities && character.abilities && character.abilities.length > 0
      "
    >
      <abilities-section :character="character" />
    </div>
    <!-- ITEMS -->
    <div v-if="showItems && character.items && character.items.length > 0">
      <items-section :character="character" />
    </div>
  </div>
</template>

<script>
/*
TODO:

- SPLIT THIS UP INTO SMALLER COMPONENTS
- Add animation (maybe) to opening and closing dice roll panels

*/

import { DiceRoll } from "rpg-dice-roller";
import Bullet from "./Bullet.vue";
import DiceRender from "./CombatStatsComponents/DiceRender.vue";
import Fraction from "./CombatStatsComponents/Fraction.vue";
import GiftDescription from "./CombatStatsComponents/GiftDescription.vue";
import CogTypeDescription from "../EnemyPage/CogTypeDescription.vue";
import { cogTypeTitle } from "../EnemyPage/CogFlowUtils/CogTypeDescriptionUtils";
import AbilitiesSection from "./CombatStatsComponents/AbilitiesSection.vue";
import ItemsSection from "./CombatStatsComponents/ItemsSection.vue";
import AttrHelp from "./CombatStatsComponents/AttrHelp.vue";
import AdjustAttr from "./CombatStatsComponents/AdjustAttr.vue";
import AdjustAttrLink from "./CombatStatsComponents/AdjustAttrLink.vue";
import {
  getAttrFullName,
  getAttrDisplayName,
  getAttrMaxName,
  adjustAttrsAPI,
} from "../../utils/attributeUtils";

export default {
  name: "combatStats",
  props: {
    character: {
      type: Object,
      required: true,
    },
    isCog: {
      type: Boolean,
      default: false,
    },
    showAbilities: {
      type: Boolean,
      default: false,
    },
    showItems: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Bullet,
    DiceRender,
    Fraction,
    GiftDescription,
    CogTypeDescription,
    AbilitiesSection,
    ItemsSection,
    AttrHelp,
    AdjustAttr,
    AdjustAttrLink,
  },
  data() {
    return {
      selectedAttr: "",
      // These need to get moved into seperate components instead of being up here
      latestRoll: {
        per: null,
        tek: null,
        agi: null,
        dex: null,
        int: null,
        spi: null,
        str: null,
        wis: null,
        cha: null,
      },
    };
  },
  computed: {
    isEnemy() {
      return (
        this.isCog || (this.character.id && this.character.id.startsWith("E"))
      );
    },
    combatStatsRows() {
      if (this.isEnemy) {
        return [["hp"], ["vim", "mp"]];
      }
      return [
        ["hp", "vim"],
        ["mp", "hero"],
      ];
    },
    attributeRows() {
      return [
        ["per", "tek", "agi"],
        ["dex", "int", "spi"],
        ["str", "wis", "cha"],
      ];
    },
    singleRowAttributes() {
      let attrs = ["init", "speed", "armor", "xp", "sp"];
      if (this.isEnemy) {
        attrs = ["acc", "init", "speed", "armor", "level"];
      }
      // Add fields that may only exist on some characters
      const optionalAttrs = ["radius", "reach"];
      optionalAttrs
        .filter((attr) => this.character[attr] !== undefined)
        .forEach((attr) => attrs.push(attr));
      return attrs;
    },
    showUpdateDropdown() {
      // We are only able to update elements when the character's id is present
      return this.character.id !== undefined;
    },
    cogTypeTitle() {
      if (this.isEnemy) {
        return cogTypeTitle(this.character.cogType);
      }
      return "";
    },
  },
  methods: {
    showDropDown(attr) {
      return this.selectedAttr === attr;
    },
    getDropDownClass(index, length) {
      if (index === 0) {
        return "left";
      }
      if (index === length - 1) {
        return "right";
      }
      return "";
    },
    attrButton(attr) {
      if (this.selectedAttr === attr) {
        this.selectedAttr = "";
      } else {
        this.selectedAttr = attr;
      }
    },
    attrButtonClass(attr) {
      if (this.selectedAttr === attr) {
        return "selected";
      }
      return "";
    },
    attrDisplayName(attr) {
      return getAttrDisplayName(attr);
    },
    getAttrMaxValue(attr) {
      return this.character[getAttrMaxName(attr)];
    },
    attrFullName(attr) {
      return getAttrFullName(attr);
    },
    getAttrLink(attr) {
      return `https://vennt.fandom.com/wiki/${this.attrFullName(
        attr
      )}_(${attr.toUpperCase()})`;
    },
    attrRollButton(attr) {
      const rollStr =
        "3d6" + (this.character[attr] >= 0 ? "+" : "") + this.character[attr];
      this.latestRoll[attr] = new DiceRoll(rollStr);
    },
    showDice(attr) {
      return this.latestRoll[attr] !== null;
    },
    getDice(attr) {
      return this.latestRoll[attr];
    },
    getDiceNotation(attr) {
      return this.latestRoll[attr].notation;
    },
    getDiceAverage(attr) {
      return this.latestRoll[attr].averageTotal;
    },
    // TODO: REMOVE THIS and just replace with a button to copy the dice roll
    attrRollButtonHeroPoint(attr) {
      if (this.character.hero <= 0) {
        return;
      }
      // we drop the lowest roll with dl1 and then add 9
      const rollStr =
        "3d6dl1" +
        (this.character[attr] >= 0 ? "+" : "") +
        this.character[attr] +
        "+9";
      this.latestRoll[attr] = new DiceRoll(rollStr);
      adjustAttrsAPI(
        this.character,
        { hero: -1 },
        true,
        "Rolled using hero point"
      );
    },
    singleRowShowAdjust(attr) {
      return ["xp", "sp"].includes(attr);
    },
  },
};
</script>

<style scoped>
.panel {
  margin-left: 16px;
  margin-right: 16px;
}

/* used for non-opennable stats */
.stat {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 8px;
}

.attrButton {
  width: 100%;
  background-color: var(--background-highlight);
  border-radius: var(--border-radius);
  margin-bottom: 8px;
}
.attrButton.selected {
  margin-bottom: 0px;
  border-radius: var(--border-radius) var(--border-radius) 0px 0px;
  padding-bottom: 7px;
  border-bottom: 1px var(--border) solid;
}
.attrButtonContents {
  font-size: 16pt;
  text-align: left;
}

.margin {
  margin: 8px;
  width: 100%;
}

.attrHeader {
  font-size: 16pt;
  font-weight: 500;
}
.attrHeaderMargin {
  font-size: 16pt;
  font-weight: 500;
  margin-bottom: 8px;
}

.diceDropDown {
  margin-bottom: 8px;
}
.diceDropDown.left {
  border-top-left-radius: 0px;
}
.diceDropDown.right {
  border-top-right-radius: 0px;
}

.diceSection {
  margin-top: 8px;
  min-height: 90px;
}

.fractionLabel {
  min-width: 64px;
}
.attrLabel {
  min-width: 56px;
}
.attrLabelWide {
  min-width: 88px;
  margin-right: 8px;
}

.incrementLabel {
  font-size: 14pt;
  min-width: 180px;
}

/* Mobile Styles */
@media screen and (max-width: 396px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
