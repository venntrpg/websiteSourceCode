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
            <dice-section
              :attr="attr"
              :character="character"
              :useCopyableDice="useCopyableDice"
            />
            <div v-if="showUpdateDropdown">
              <div class="seperator mt-8 mb-8"></div>
              <adjust-attr-link :attr="attr" />
            </div>
            <div v-else>
              <div class="seperator mt-8 mb-8"></div>
              <attr-help :attr="attr" class="mutedText" />
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
              v-if="showAdjust(attr)"
              :attr="attr"
              :character="character"
              loc="combat-stats"
            />
            <dice-section
              v-else-if="showDice(attr)"
              :attr="attr"
              :character="character"
              :useCopyableDice="useCopyableDice"
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
import Bullet from "./Bullet.vue";
import Fraction from "./CombatStatsComponents/Fraction.vue";
import GiftDescription from "./CombatStatsComponents/GiftDescription.vue";
import CogTypeDescription from "../EnemyPage/CogTypeDescription.vue";
import AbilitiesSection from "./CombatStatsComponents/AbilitiesSection.vue";
import ItemsSection from "./CombatStatsComponents/ItemsSection.vue";
import AttrHelp from "./CombatStatsComponents/AttrHelp.vue";
import AdjustAttr from "./CombatStatsComponents/AdjustAttr.vue";
import AdjustAttrLink from "./CombatStatsComponents/AdjustAttrLink.vue";
import DiceSection from "./CombatStatsComponents/DiceSection.vue";
import { cogTypeTitle } from "../EnemyPage/CogFlowUtils/CogTypeDescriptionUtils";
import { getAttrDisplayName, getAttrMaxName } from "../../utils/attributeUtils";

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
    useCopyableDice: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Bullet,
    Fraction,
    GiftDescription,
    CogTypeDescription,
    AbilitiesSection,
    ItemsSection,
    AttrHelp,
    AdjustAttr,
    AdjustAttrLink,
    DiceSection,
  },
  data() {
    return {
      selectedAttr: "",
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
    showAdjust(attr) {
      return ["xp", "sp"].includes(attr);
    },
    showDice(attr) {
      return ["init"].includes(attr);
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

.diceDropDown {
  margin-bottom: 8px;
}
.diceDropDown.left {
  border-top-left-radius: 0px;
}
.diceDropDown.right {
  border-top-right-radius: 0px;
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

/* Mobile Styles */
@media screen and (max-width: 396px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
