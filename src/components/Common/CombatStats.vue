<template>
  <div class="panel">
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
              <span class="fractionLabel">{{ getAttrDisplayName(attr) }}:</span>
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
            v-bind:class="getDropDownClass(j, 2)"
          >
            <div class="margin">
              <div v-if="showUpdateDropdown">
                <div class="attrHeaderMargin">Update Stat Values:</div>
                <div
                  v-if="adjustFields[attr] !== undefined"
                  class="alignRow mt-4"
                >
                  <label v-bind:for="attr + '-adjust'" class="incrementLabel">
                    Adjust (+/-) {{ getAttrDisplayName(attr) }}:
                  </label>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromAdjustField(attr)"
                    v-model="adjustFields[attr]"
                    placeholder="0"
                    title="Press Enter to Submit"
                    v-bind:id="attr + '-adjust'"
                    v-bind:class="inputAdjustFieldClass(attr)"
                    class="input"
                  />
                </div>
                <button
                  v-if="showResetToFullButton(attr)"
                  v-on:click="adjustAttrToFullButton(attr)"
                  class="btn roundedButton clear wide noSelect mt-4"
                >
                  Reset {{ getAttrDisplayName(attr) }} to Full
                </button>
                <div class="alignRow mt-4">
                  <label v-bind:for="attr + '-current'" class="incrementLabel">
                    Current {{ getAttrDisplayName(attr) }}:
                  </label>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromField(attr)"
                    v-model="attrFields[attr]"
                    v-bind:placeholder="character[attr]"
                    title="Press Enter to Submit"
                    v-bind:id="attr + '-current'"
                    v-bind:class="inputFieldClass(attr)"
                    class="input"
                  />
                </div>
                <div
                  v-if="getAttrMaxValue(attr) !== undefined"
                  class="alignRow mt-4"
                >
                  <label v-bind:for="attr + '-max'" class="incrementLabel">
                    Maximum {{ getAttrDisplayName(attr) }}:
                  </label>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromField(getAttrMaxName(attr))"
                    v-model="attrFields[getAttrMaxName(attr)]"
                    v-bind:placeholder="getAttrMaxValue(attr)"
                    title="Press Enter to Submit"
                    v-bind:id="attr + '-max'"
                    v-bind:class="inputFieldClass(getAttrMaxName(attr))"
                    class="input"
                  />
                </div>
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
          v-bind:class="getDropDownClass(j, 3)"
        >
          <div class="margin">
            <div class="alignRow split">
              <div class="attrHeader">
                <a
                  v-bind:href="getAttrLink(attr)"
                  target="_blank"
                  class="link stealth"
                >
                  {{ getAttrFullName(attr) }}
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
              <div class="attrHeaderMargin">Update Attribute Value:</div>
              <check-box
                :checked="propegateChanges"
                :text="'Propegate Changes'"
                :highlight="true"
                @toggled="propegateChangesButton()"
              />
              <div class="alignRow split mt-4">
                <div class="incrementLabel">
                  Update {{ attr.toUpperCase() }} value:
                </div>
                <div class="alignRow gap wide">
                  <button
                    v-on:click="adjustAttrButton(attr, true)"
                    v-bind:disabled="attrIncrementButtonDisabled(attr)"
                    class="btn roundedButton wide noSelect"
                  >
                    +1
                  </button>
                  <button
                    v-on:click="adjustAttrButton(attr, false)"
                    v-bind:disabled="attrDecrementButtonDisabled(attr)"
                    class="btn roundedButton wide noSelect"
                  >
                    -1
                  </button>
                </div>
              </div>
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
      <div class="margin">
        <div class="seperator mb-16"></div>
        <gift-description :gift="character.gift" :showTitle="false" />
      </div>
    </div>
    <div v-if="isEnemy && character.template" class="card stat">
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
      <div class="margin">
        <div class="seperator mb-16"></div>
        <cog-type-description :cogType="character.cogType" :showTitle="false" />
      </div>
    </div>
    <!-- SINGLE LINE STATS -->
    <div v-for="attr in singleRowAttributes" v-bind:key="attr">
      <button
        v-on:click="attrButton(attr)"
        class="btn basicBtn attrButton noSelect"
        v-bind:class="attrButtonClass(attr)"
      >
        <div class="basicBtnContents attrButtonContents">
          <span class="attrLabelWide">{{ getAttrDisplayName(attr) }}:</span>
          <div class="number">{{ character[attr] }}</div>
        </div>
      </button>
      <div v-if="showDropDown(attr)" class="card diceDropDown left right">
        <div class="margin">
          <div class="seperator mb-16"></div>
          <div v-if="showUpdateDropdown">
            <div class="attrHeaderMargin">Update Stat Value:</div>
            <div v-if="adjustFields[attr] !== undefined" class="alignRow mt-4">
              <label v-bind:for="attr + '-adjust'" class="incrementLabel">
                Adjust (+/-) {{ getAttrDisplayName(attr) }}:
              </label>
              <input
                type="number"
                v-on:keyup.enter="adjustAttrFromAdjustField(attr)"
                v-model="adjustFields[attr]"
                placeholder="0"
                title="Press Enter to Submit"
                v-bind:id="attr + '-adjust'"
                v-bind:class="inputAdjustFieldClass(attr)"
                class="input"
              />
            </div>
            <div class="alignRow mt-4">
              <label v-bind:for="attr + '-current'" class="incrementLabel">
                Current {{ getAttrDisplayName(attr) }}:
              </label>
              <input
                type="number"
                v-on:keyup.enter="adjustAttrFromField(attr)"
                v-model="attrFields[attr]"
                v-bind:placeholder="character[attr]"
                title="Press Enter to Submit"
                v-bind:id="attr + '-current'"
                v-bind:class="inputFieldClass(attr)"
                class="input"
              />
            </div>
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
    <div class="tall"></div>
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
import CheckBox from "./CheckBox.vue";
import CogTypeDescription from "../EnemyPage/CogTypeDescription.vue";
import { cogTypeTitle } from "../EnemyPage/CogFlowUtils/CogTypeDescriptionUtils";
import AbilitiesSection from "./CombatStatsComponents/AbilitiesSection.vue";
import ItemsSection from "./CombatStatsComponents/ItemsSection.vue";
import AttrHelp from "./CombatStatsComponents/AttrHelp.vue";

// The maximum value an attribute can be
const ATTRIBUTE_CAP = 9;

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
    CheckBox,
    CogTypeDescription,
    AbilitiesSection,
    ItemsSection,
    AttrHelp,
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
      propegateChanges: true,
      attrFields: {
        hp: this.character.hp,
        maxHp: this.character.maxHp,
        mp: this.character.mp,
        maxMp: this.character.maxMp,
        vim: this.character.vim,
        maxVim: this.character.maxVim,
        hero: this.character.hero,
        maxHero: this.character.maxHero,
        init: this.character.init,
        speed: this.character.speed,
        armor: this.character.armor,
        xp: this.character.xp,
        sp: this.character.sp,
        maxBulk: this.character.maxBulk,
      },
      adjustFields: {
        hp: "",
        mp: "",
        vim: "",
        xp: "",
        sp: "",
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
    getAttrDisplayName(attr) {
      if (attr === "init") {
        return "Initiative";
      }
      if (attr === "maxBulk") {
        return "Carrying Capacity";
      }
      if (attr.length <= 2) {
        return attr.toUpperCase();
      }
      return attr.charAt(0).toUpperCase() + attr.slice(1);
    },
    getAttrMaxName(attr) {
      return "max" + attr.charAt(0).toUpperCase() + attr.slice(1);
    },
    getAttrMaxValue(attr) {
      return this.character[this.getAttrMaxName(attr)];
    },
    showResetToFullButton(attr) {
      return (
        attr !== "hero" &&
        this.getAttrMaxValue(attr) &&
        this.character[attr] < this.getAttrMaxValue(attr)
      );
    },
    getAttrFullName(attr) {
      const nameMap = {
        per: "Perception",
        tek: "Technology",
        agi: "Agility",
        dex: "Dexterity",
        int: "Intelligence",
        spi: "Spirit",
        str: "Strength",
        wis: "Wisdom",
        cha: "Charisma",
      };
      const name = nameMap[attr];
      if (name) {
        return name;
      }
      return "";
    },
    getAttrLink(attr) {
      return `https://vennt.fandom.com/wiki/${this.getAttrFullName(
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
    propegateChangesButton() {
      this.propegateChanges = !this.propegateChanges;
    },
    adjustAttrToFullButton(attr) {
      const maxVal = this.getAttrMaxValue(attr);
      if (!maxVal || this.character[attr] >= maxVal) {
        return;
      }
      this.$store.dispatch("character/setAttribute", {
        id: this.character.id,
        attr: attr,
        val: maxVal,
      });
    },
    validateField(attr) {
      const val =
        this.attrFields[attr] !== undefined
          ? parseInt(this.attrFields[attr])
          : 0;
      if (isNaN(val)) {
        return false;
      }
      if (attr !== "init" && val < 0) {
        return false;
      }
      if (["hp", "mp", "vim", "hero"].includes(attr)) {
        if (this.getAttrMaxValue(attr) && val > this.getAttrMaxValue(attr)) {
          return false;
        }
      }
      return val;
    },
    inputFieldClass(attr) {
      return this.validateField(attr) === false ? "invalid" : "";
    },
    adjustAttrFromField(attr) {
      const val = this.validateField(attr);
      if (val !== false) {
        this.$store.dispatch("character/setAttribute", {
          id: this.character.id,
          attr: attr,
          val: val,
        });
      }
    },
    validateAdjustField(attr) {
      const adjust =
        this.adjustFields[attr] !== undefined
          ? parseInt(this.adjustFields[attr])
          : 0;
      if (isNaN(adjust)) {
        return false;
      }
      if (adjust === 0) {
        return false;
      }
      const val = this.character[attr] + adjust;
      if (attr !== "init" && val < 0) {
        return false;
      }
      if (["hp", "mp", "vim", "hero"].includes(attr)) {
        if (this.getAttrMaxValue(attr) && val > this.getAttrMaxValue(attr)) {
          return false;
        }
      }
      return val;
    },
    inputAdjustFieldClass(attr) {
      return this.validateAdjustField(attr) === false ? "invalid" : "";
    },
    adjustAttrFromAdjustField(attr) {
      const val = this.validateAdjustField(attr);
      if (val !== false) {
        this.$store.dispatch("character/setAttribute", {
          id: this.character.id,
          attr: attr,
          val: val,
        });
      }
    },
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
      this.adjustAttrButton("hero", false);
    },
    attrIncrementButtonDisabled(attr) {
      return this.character[attr] >= ATTRIBUTE_CAP;
    },
    attrDecrementButtonDisabled(attr) {
      return this.character[attr] <= -1 * ATTRIBUTE_CAP;
    },
    adjustAttrButton(attr, increment) {
      const adjustment = increment ? 1 : -1;
      const newVal = this.character[attr] + adjustment;
      this.$store.dispatch("character/setAttribute", {
        id: this.character.id,
        attr: attr,
        val: newVal,
      });
      if (this.propegateChanges) {
        // HP & VIM
        if (attr === "str") {
          const newHp = Math.max(this.character.maxHp + adjustment * 3, 0);
          const newVim = Math.max(this.character.maxVim + adjustment * 3, 0);
          this.$store.dispatch("character/setAttribute", {
            id: this.character.id,
            attr: "maxHp",
            val: newHp,
          });
          this.$store.dispatch("character/setAttribute", {
            id: this.character.id,
            attr: "maxVim",
            val: newVim,
          });
          if (this.character.hp > newHp) {
            this.$store.dispatch("character/setAttribute", {
              id: this.character.id,
              attr: "hp",
              val: newHp,
            });
          }
          if (this.character.vim > newVim) {
            this.$store.dispatch("character/setAttribute", {
              id: this.character.id,
              attr: "vim",
              val: newVim,
            });
          }
        }
        // MP
        if (attr === "wis") {
          const newMp = Math.max(this.character.maxMp + adjustment * 3, 0);
          this.$store.dispatch("character/setAttribute", {
            id: this.character.id,
            attr: "maxMp",
            val: newMp,
          });
          if (this.character.mp > newMp) {
            this.$store.dispatch("character/setAttribute", {
              id: this.character.id,
              attr: "mp",
              val: newMp,
            });
          }
        }
        // SPEED
        if (attr === "agi") {
          const newSpeed = Math.max(this.character.speed + adjustment, 0);
          this.$store.dispatch("character/setAttribute", {
            id: this.character.id,
            attr: "speed",
            val: newSpeed,
          });
        }
        // INIT
        if (attr === "agi" || attr === "dex") {
          const newInit = Math.max(this.character.init + adjustment, 0);
          this.$store.dispatch("character/setAttribute", {
            id: this.character.id,
            attr: "init",
            val: newInit,
          });
        }
      }
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
  border-radius: 5px;
  margin-bottom: 8px;
}
.attrButton.selected {
  margin-bottom: 0px;
  border-radius: 5px 5px 0px 0px;
  padding-bottom: 8px;
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
@media screen and (max-width: 366px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
