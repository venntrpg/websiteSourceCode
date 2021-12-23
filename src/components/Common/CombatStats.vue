<template>
  <div class="panel">
    <div class="displayName">
      <h2>{{ character.name }}</h2>
    </div>
    <div class="seperator"></div>
    <!-- COMBAT STATS -->
    <div class="flex">
      <Bullet :character="character" />
      <h2>Combat Stats</h2>
    </div>
    <div>
      <div v-for="(attrRow, index) in combatStatsRows" v-bind:key="index">
        <div class="attrsRow">
          <button
            v-for="attr in attrRow"
            v-bind:key="attr"
            v-on:click="attrButton(attr)"
            class="btn basicBtn attrButton noSelect"
            v-bind:class="attrButtonClass(attr)"
          >
            <div class="basicBtnContents attrButtonContents">
              {{ getAttrDisplayName(attr) }}:
              <Fraction
                :top="character[attr]"
                :bottom="getAttrMaxValue(attr)"
                class="statNumbers"
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
                <div v-if="adjustFields[attr] !== undefined" class="alignRow">
                  <div class="incrementLabel">
                    Adjust (+/-) {{ getAttrDisplayName(attr) }}:
                  </div>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromAdjustField(attr)"
                    v-model="adjustFields[attr]"
                    placeholder="0"
                    v-bind:class="inputAdjustFieldClass(attr)"
                    class="input"
                  />
                </div>
                <button
                  v-if="
                    getAttrMaxValue(attr) &&
                    character[attr] < getAttrMaxValue(attr)
                  "
                  v-on:click="adjustAttrToFullButton(attr)"
                  class="btn roundedButton wide noSelect topMargin"
                >
                  Reset {{ getAttrDisplayName(attr) }} to Full
                </button>
                <div class="alignRow">
                  <div class="incrementLabel">
                    Current {{ getAttrDisplayName(attr) }}:
                  </div>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromField(attr)"
                    v-model="attrFields[attr]"
                    :placeholder="character[attr]"
                    v-bind:class="inputFieldClass(attr)"
                    class="input"
                  />
                </div>
                <div v-if="getAttrMaxValue(attr)" class="alignRow">
                  <div class="incrementLabel">
                    Maximum {{ getAttrDisplayName(attr) }}:
                  </div>
                  <input
                    type="number"
                    v-on:keyup.enter="adjustAttrFromField(getAttrMaxName(attr))"
                    v-model="attrFields[getAttrMaxName(attr)]"
                    :placeholder="getAttrMaxValue(attr)"
                    v-bind:class="inputFieldClass(getAttrMaxName(attr))"
                    class="input"
                  />
                </div>
              </div>
              <div v-else v-html="getAttrHelpHTML(attr)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ATTRIBUTES -->
    <div class="flex">
      <Bullet :character="character" />
      <h2>Attributes</h2>
    </div>
    <div v-for="(attrRow, index) in attributeRows" v-bind:key="index">
      <div class="attrsRow">
        <button
          v-for="attr in attrRow"
          v-bind:key="attr"
          v-on:click="attrButton(attr)"
          class="btn basicBtn attrButton noSelect"
          v-bind:class="attrButtonClass(attr)"
        >
          <div class="basicBtnContents attrButtonContents">
            {{ attr.toUpperCase() }}:
            <div class="number leftMargin">{{ character[attr] }}</div>
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
            <div class="alignRow">
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
                  <DiceSVG class="basicBtnSVG selected space" />
                  Roll Dice
                </div>
              </button>
            </div>
            <div class="diceSection">
              <div v-if="showDice(attr)">
                <DiceRender :roll="getDice(attr)" />
                <div>Dice Rolled: {{ getDiceNotation(attr) }}</div>
                <div>Average Roll: {{ getDiceAverage(attr) }}</div>
              </div>
            </div>
            <div v-if="showUpdateDropdown">
              <div class="seperator topBottomMargin"></div>
              <div class="attrHeaderMargin">Special Conditions:</div>
              <button
                v-on:click="attrRollButtonHeroPoint(attr)"
                :disabled="character.hero <= 0"
                class="btn basicBtn wide noSelect"
              >
                <div class="basicBtnContents">
                  <DiceSVG class="basicBtnSVG selected space" />
                  Roll Dice using Hero Point
                </div>
              </button>
              <!-- TODO: It would be neat if we could add abilities here too -->
              <div class="seperator topBottomMargin"></div>
              <div class="attrHeaderMargin">Update Attribute Value:</div>
              <button
                v-on:click="propegateChangesButton()"
                class="btn basicBtn wide noSelect"
              >
                <div class="basicBtnContents">
                  <CheckedCheckBoxSVG
                    v-if="propegateChanges"
                    class="basicBtnSVG space selected"
                  />
                  <UncheckedCheckBoxSVG v-else class="basicBtnSVG space" />
                  Propegate Changes
                </div>
              </button>
              <div class="alignRow">
                <div class="incrementLabel">
                  Update {{ attr.toUpperCase() }} value:
                </div>
                <button
                  v-on:click="adjustAttrButton(attr, true)"
                  class="btn roundedButton wide noSelect"
                >
                  +1
                </button>
                <button
                  v-on:click="adjustAttrButton(attr, false)"
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
    <div class="tall"></div>
    <!-- SINGLE LINE STATS -->
    <button
      v-if="character.gift"
      v-on:click="attrButton('gift')"
      class="btn basicBtn attrButton noSelect singleStat"
      v-bind:class="attrButtonClass('gift')"
    >
      <div class="basicBtnContents attrButtonContents">
        Gift: {{ character.gift }}
      </div>
    </button>
    <div v-if="showDropDown('gift')" class="card diceDropDown left right">
      <div class="margin">
        <div class="seperator bottomMargin"></div>
        <gift-description :gift="character.gift" :showTitle="false" />
      </div>
    </div>
    <div v-for="attr in singleRowAttributes" v-bind:key="attr">
      <button
        v-on:click="attrButton(attr)"
        class="btn basicBtn attrButton noSelect singleStat"
        v-bind:class="attrButtonClass(attr)"
      >
        <div class="basicBtnContents attrButtonContents">
          {{ getAttrDisplayName(attr) }}:
          <div class="number leftMarginWide">{{ character[attr] }}</div>
        </div>
      </button>
      <div v-if="showDropDown(attr)" class="card diceDropDown left right">
        <div class="margin">
          <div class="seperator bottomMargin"></div>
          <div v-if="showUpdateDropdown">
            <div class="attrHeaderMargin">Update Stat Value:</div>
            <div v-if="adjustFields[attr] !== undefined" class="alignRow">
              <div class="incrementLabel">
                Adjust (+/-) {{ getAttrDisplayName(attr) }}:
              </div>
              <input
                type="number"
                v-on:keyup.enter="adjustAttrFromAdjustField(attr)"
                v-model="adjustFields[attr]"
                placeholder="0"
                v-bind:class="inputAdjustFieldClass(attr)"
                class="input"
              />
            </div>
            <div class="alignRow">
              <div class="incrementLabel">
                Current {{ getAttrDisplayName(attr) }}:
              </div>
              <input
                type="number"
                v-on:keyup.enter="adjustAttrFromField(attr)"
                v-model="attrFields[attr]"
                :placeholder="character[attr]"
                v-bind:class="inputFieldClass(attr)"
                class="input"
              />
            </div>
          </div>
          <div v-else v-html="getAttrHelpHTML(attr)"></div>
        </div>
      </div>
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
import DiceSVG from "./SVGs/DiceSVG.vue";
import CheckedCheckBoxSVG from "./SVGs/CheckedCheckBoxSVG.vue";
import UncheckedCheckBoxSVG from "./SVGs/UncheckedCheckBoxSVG.vue";
import Bullet from "./Bullet.vue";
import DiceRender from "./CombatStatsComponents/DiceRender.vue";
import Fraction from "./CombatStatsComponents/Fraction.vue";
import GiftDescription from "./CombatStatsComponents/GiftDescription.vue";

export default {
  name: "combatStats",
  props: {
    character: {
      type: Object,
      required: true,
    },
  },
  components: {
    DiceSVG,
    CheckedCheckBoxSVG,
    UncheckedCheckBoxSVG,
    Bullet,
    DiceRender,
    Fraction,
    GiftDescription,
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
    combatStatsRows() {
      return [
        ["hp", "mp"],
        ["vim", "hero"],
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
      return ["init", "speed", "armor", "xp", "sp"];
    },
    showUpdateDropdown() {
      return this.character.id !== undefined;
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
    getAttrHelpHTML(attr) {
      const helpMap = {
        hp: 'Your maximum Health (HP) is 20 + Level + 3 times Strength. <a href="https://vennt.fandom.com/wiki/Health" target="_blank" class="link">Wiki entry</a>',
        mp: 'Your maximum Mana (MP) is 6 + 3 times Wisdom. <a href="https://vennt.fandom.com/wiki/Mana" target="_blank" class="link">Wiki entry</a>',
        vim: 'Your maximum Vim is equal to your maximum HP. <a href="https://vennt.fandom.com/wiki/Vim" target="_blank" class="link">Wiki entry</a>',
        hero: `Hero Points are reserves of luck that can be spent to create moments of shining excellence.
        <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="link">Wiki entry</a>`,
        init: 'Your Initiative is your Agility + Dexterity. <a href="https://vennt.fandom.com/wiki/Initiative" target="_blank" class="link">Wiki entry</a>',
        speed:
          'Your Speed is 3 + Agility minus any Burden from your Armor. <a href="https://vennt.fandom.com/wiki/Movement" target="_blank" class="link">Wiki entry</a>',
        armor:
          'Your Armor serves as damage reduction from blows dealt to you. <a href="https://vennt.fandom.com/wiki/Armor" target="_blank" class="link">Wiki entry</a>',
        xp: `Experience Points, the resource gained by player characters during play and spent on Abilities. Your character's level is your xp / 1000.
        <a href="https://vennt.fandom.com/wiki/XP" target="_blank" class="link">Wiki entry</a>`,
        sp: 'Silver Pieces are Amnis\'s main currency. <a href="https://vennt.fandom.com/wiki/Money" target="_blank" class="link">Wiki entry</a>',
      };
      return helpMap[attr];
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
      this.$store.dispatch("setAttribute", {
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
        this.$store.dispatch("setAttribute", {
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
        this.$store.dispatch("setAttribute", {
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
    adjustAttrButton(attr, increment) {
      const adjustment = increment ? 1 : -1;
      const newVal = this.character[attr] + adjustment;
      this.$store.dispatch("setAttribute", {
        id: this.character.id,
        attr: attr,
        val: newVal,
      });
      if (this.propegateChanges) {
        // HP & VIM
        if (attr === "str") {
          const newHp = Math.max(this.character.maxHp + adjustment * 3, 0);
          const newVim = Math.max(this.character.maxVim + adjustment * 3, 0);
          this.$store.dispatch("setAttribute", {
            id: this.character.id,
            attr: "maxHp",
            val: newHp,
          });
          this.$store.dispatch("setAttribute", {
            id: this.character.id,
            attr: "maxVim",
            val: newVim,
          });
          if (this.character.hp > newHp) {
            this.$store.dispatch("setAttribute", {
              id: this.character.id,
              attr: "hp",
              val: newHp,
            });
          }
          if (this.character.vim > newVim) {
            this.$store.dispatch("setAttribute", {
              id: this.character.id,
              attr: "vim",
              val: newVim,
            });
          }
        }
        // MP
        if (attr === "wis") {
          const newMp = Math.max(this.character.maxMp + adjustment * 3, 0);
          this.$store.dispatch("setAttribute", {
            id: this.character.id,
            attr: "maxMp",
            val: newMp,
          });
          if (this.character.mp > newMp) {
            this.$store.dispatch("setAttribute", {
              id: this.character.id,
              attr: "mp",
              val: newMp,
            });
          }
        }
        // SPEED
        if (attr === "agi") {
          const newSpeed = Math.max(this.character.speed + adjustment, 0);
          this.$store.dispatch("setAttribute", {
            id: this.character.id,
            attr: "speed",
            val: newSpeed,
          });
        }
        // INIT
        if (attr === "agi" || attr === "dex") {
          const newInit = Math.max(this.character.init + adjustment, 0);
          this.$store.dispatch("setAttribute", {
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

.displayName {
  text-align: center;
}

.stat {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 8px;
}
.statNumbers {
  display: flex;
  align-items: center;
  /* Absolute so numbers are in space place for every combat stat */
  position: absolute;
  margin-left: 55px;
}

.flex {
  display: flex;
  align-items: center;
}

.help {
  fill: var(--gray-700);
}

.toolTip {
  display: none;
  position: absolute;
  margin-top: 100px;
  margin-left: -8px;
  max-width: 220px;
  background-color: var(--gray-900);
  color: white;
  font-size: 13pt;
  border-radius: 5px;
  padding: 8px;
  z-index: 2;
}

.toolTip.wide {
  max-width: 360px;
}

/* Tool tip functionality */
.toolTip:hover,
.help:hover + .toolTip {
  display: block;
}

.toolTipLink {
  color: white;
}
.toolTipLink:hover {
  color: var(--red-300);
}
.toolTipLink:active {
  color: var(--red-500);
}

.attrsRow {
  display: flex;
  justify-content: space-between;
  margin-left: -4px;
  margin-right: -4px;
}
.attrButton {
  width: 100%;
  background-color: white;
  margin: 4px;
  border-radius: 5px;
}
.attrButton.selected {
  margin-bottom: -4px;
  border-radius: 5px 5px 0px 0px;
}
.attrButtonContents {
  font-size: 16pt;
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
  margin-top: 4px;
  margin-bottom: 4px;
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

.leftMargin {
  position: absolute;
  margin-left: 56px;
}
.leftMarginWide {
  position: absolute;
  margin-left: 90px;
}

.singleStat {
  margin: 0px 0px 8px 0px;
}

.seperator.topBottomMargin {
  margin-top: 16px;
  margin-bottom: 16px;
}
.seperator.bottomMargin {
  margin-bottom: 16px;
}

.alignRow {
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.topMargin {
  margin-top: 5px;
}

.incrementLabel {
  font-size: 14pt;
  min-width: 180px;
}

/* Mobile Styles */
@media screen and (max-width: 376px) {
  .hpHelp,
  .mpHelp,
  .vimHelp,
  .heroHelp {
    display: none;
  }

  .hp:hover .hpToolTip,
  .mp:hover .mpToolTip,
  .vim:hover .vimToolTip,
  .hero:hover .heroToolTip {
    display: block;
  }
}
@media screen and (max-width: 366px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
