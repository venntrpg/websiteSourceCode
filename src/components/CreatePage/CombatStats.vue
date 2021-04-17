<template>
  <div class="panel">
    <div class="displayName">
      <h2>{{ character.name }}</h2>
    </div>
    <div class="flex">
      <div v-bind:style="{ 'background-color': charColor }" class="bullet"></div>
      <h2>Combat Stats</h2>
    </div>
    <div class="combatStats">
      <div class="card stat hp">
        HP:
        <div class="statNumbers">
          <div class="number">{{ character.hp }}</div>
          <div class="slash">/</div>
          <div class="number">{{ character.maxHp }}</div>
        </div>
        <HelpSVG class="help hpHelp" />
        <div class="toolTip hpToolTip">
          Your maximum Health (HP) is 20 + Level + 3 times Strength.
          <a href="https://vennt.fandom.com/wiki/Health" target="_blank" class="toolTipLink">Wiki entry</a>
        </div>
      </div>
      <div class="card stat mp">
        MP:
        <div class="statNumbers">
          <div class="number">{{ character.mp }}</div>
          <div class="slash">/</div>
          <div class="number">{{ character.maxMp }}</div>
        </div>
        <HelpSVG class="help mpHelp" />
        <div class="toolTip mpToolTip">
          Your maximum Mana (MP) is 6 + 3 times Wisdom.
          <a href="https://vennt.fandom.com/wiki/Mana" target="_blank" class="toolTipLink">Wiki entry</a>
        </div>
      </div>
      <div class="card stat vim">
        Vim:
        <div class="statNumbers">
          <div class="number">{{ character.vim }}</div>
          <div class="slash">/</div>
          <div class="number">{{ character.maxVim }}</div>
        </div>
        <HelpSVG class="help vimHelp" />
        <div class="toolTip vimToolTip">
          Your maximum Vim is equal to your maximum HP.
          <a href="https://vennt.fandom.com/wiki/Vim" target="_blank" class="toolTipLink">Wiki entry</a>
        </div>
      </div>
      <div class="card stat hero">
        Hero:
        <div class="statNumbers">
          <div class="number">{{ character.hero }}</div>
          <div v-if="character.maxHero" class="flex">
            <div class="slash">/</div>
            <div class="number">{{ character.maxHero }}</div>
          </div>
        </div>
        <HelpSVG class="help heroHelp" />
        <div class="toolTip heroToolTip">
          Hero Points are reserves of luck that can be spent to create moments of shining excellence.
          <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="toolTipLink">Wiki entry</a>
        </div>
      </div>
    </div>
    <div class="flex">
      <div v-bind:style="{ 'background-color': charColor }" class="bullet"></div>
      <h2>Attributes</h2>
    </div>
    <div
    v-for="(attrRow, index) in attributeRows"
    v-bind:key="index">
      <div class="attrsRow">
        <button
        v-for="attr in attrRow"
        v-bind:key="attr"
        v-on:click="attrButton(attr)"
        class="btn noSelect basicBtn attrButton"
        v-bind:class="attrButtonClass(attr)">
          <div class="basicBtnContents attrButtonContents">
            {{ attr.toUpperCase() }}:
            <div class="number leftMargin">{{ character[attr] }}</div>
          </div>
        </button>
      </div>
      <div
      v-for="attr in attrRow"
      v-bind:key="attr">
        <div v-if="showDiceForAttr(attr)" class="card diceDropDown">
          <div class="margin">
            <div class="alignRow">
              <div class="attrFullName">
                <a v-bind:href="getAttrLink(attr)" target="_blank" class="link stealth">{{ getAttrFullName(attr) }}</a>
                (<span class="number">{{ character[attr] }}</span>)
              </div>
              <button v-on:click="attrRollButton(attr)" class="btn noSelect basicBtn">
                <div class="basicBtnContents"><DiceSVG class="basicBtnSVG diceSVG" /> Roll Dice</div>
              </button>
            </div>
            <!-- Procedurally render dice rolls so if they are in a more complicated format than 3d6 + constant we can handle it -->
            <div v-if="showDice(attr)" class="diceSection">
              <div class="diceRow diceSum">
                <div
                v-for="(diceElement, i) in getDiceRolls(attr)"
                v-bind:key="i"
                class="diceRow">
                  <div v-if="renderDie(diceElement)" class="diceRow">
                    <div
                    v-for="(die, j) in diceElement.rolls"
                    v-bind:key="j"
                    class="diceRow">
                      <div v-if="j !== 0" class="diceElement math">
                        <div class="shiftDown">+</div>
                      </div>
                      <div class="diceElement dice">
                        <div class="shiftDown">{{ die.value }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="renderMath(diceElement)" class="diceElement math">
                    <div class="shiftDown">{{ diceElement }}</div>
                  </div>
                  <div v-else-if="renderConstant(diceElement)" class="diceElement constantContainer">
                    <div class="diceElement constant">{{ diceElement }}</div>
                  </div>
                </div>
                <div class="diceRow">
                  <div class="diceElement math shiftDown">=</div>
                  <div class="total shiftDown">{{ getDiceTotal(attr) }}</div>
                </div>
              </div>
              <div>Dice Rolled: {{ getDiceNotation(attr) }}</div>
              <div>Average Roll: {{ getDiceAverage(attr) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tall"></div>
    <div v-if="character.gift" class="card stat singleStat">
      Gift: {{ getGiftName }}
    </div>
    <div class="card stat singleStat">Initiative:
      <div class="number leftMarginWide">{{ character.init }}</div>
      <HelpSVG class="help" />
      <div class="toolTip wide">
        Your Initiative is your Agility + Dexterity.
        <a href="https://vennt.fandom.com/wiki/Initiative" target="_blank" class="toolTipLink">Wiki entry</a>
      </div>
    </div>
    <div class="card stat singleStat">Speed:
      <div class="number leftMarginWide">{{ character.speed }}</div>
      <HelpSVG class="help" />
      <div class="toolTip wide">
        Your Speed is 3 + Agility minus any Burden from your Armor.
        <a href="https://vennt.fandom.com/wiki/Movement" target="_blank" class="toolTipLink">Wiki entry</a>
      </div>
    </div>
    <div class="card stat singleStat">Armor:
      <div class="number leftMarginWide">{{ character.armor }}</div>
      <HelpSVG class="help" />
      <div class="toolTip wide">
        Your Armor serves as damage reduction from blows dealt to you.
        <a href="https://vennt.fandom.com/wiki/Armor" target="_blank" class="toolTipLink">Wiki entry</a>
      </div>
    </div>
    <div class="card stat singleStat">XP:
      <div class="number leftMarginWide">{{ character.xp }}</div>
      <HelpSVG class="help" />
      <div class="toolTip wide">
        Experience Points, the resource gained by player characters during play and spent on Abilities.
        Your character's level is your xp / 1000.
        <a href="https://vennt.fandom.com/wiki/XP" target="_blank" class="toolTipLink">Wiki entry</a>
      </div>
    </div>
    <div class="tall"></div>
  </div>
</template>

<script>

/*
TODO:

- SPLIT THIS UP INTO SMALLER COMPONENTS

- Make sidepanel background slightly darker so white buttons are more visible
- Add animation (maybe) to opening and closing dice roll panels
- Add more dice rolling options in drop down or something - should be able to try rolling with hero point etc.
*/

import { DiceRoll } from 'rpg-dice-roller'
import DiceSVG from '../Common/DiceSVG.vue'
import HelpSVG from '../Common/HelpSVG.vue'

export default {
  name: 'combatStats',
  props: {
    character: Object
  },
  components: {
    DiceSVG,
    HelpSVG
  },
  data () {
    return {
      selectedAttr: '',
      latestRoll: {
        per: null,
        tek: null,
        agi: null,
        dex: null,
        int: null,
        spi: null,
        str: null,
        wis: null,
        cha: null
      }
    }
  },
  computed: {
    getGiftName () {
      const nameMap = {
        per: 'Alertness',
        tek: 'Craft',
        agi: 'Alacrity',
        dex: 'Finesse',
        int: 'Mind',
        spi: 'Magic',
        str: 'Rage',
        wis: 'Science',
        cha: 'Charm',
        none: 'None'
      }
      const name = nameMap[this.character.gift]
      if (name) {
        return name
      }
      return ''
    },
    attributeRows () {
      return [['per', 'tek', 'agi'], ['dex', 'int', 'spi'], ['str', 'wis', 'cha']]
    },
    charColor () {
      const red = this.character.str + this.character.agi + this.character.cha
      const green = this.character.tek + this.character.int + this.character.dex
      const blue = this.character.wis + this.character.spi + this.character.per
      const sum = red + green + blue
      return '#' + this.hexColorComponent(red, sum) + this.hexColorComponent(green, sum) + this.hexColorComponent(blue, sum)
    }
  },
  methods: {
    hexColorComponent (component, sum) {
      if (sum <= 0) {
        sum = 1
      }
      if (component < 0) {
        component = 0
      }
      const numStr = Math.floor((component / sum) * 256).toString(16)
      if (numStr.length === 1) {
        return '0' + numStr
      } else if (numStr.length > 2) {
        return 'ff'
      }
      return numStr
    },
    getAttrFullName (attr) {
      const nameMap = {
        per: 'Perception',
        tek: 'Technology',
        agi: 'Agility',
        dex: 'Dexterity',
        int: 'Intelligence',
        spi: 'Spirit',
        str: 'Strength',
        wis: 'Wisdom',
        cha: 'Charisma'
      }
      const name = nameMap[attr]
      if (name) {
        return name
      }
      return ''
    },
    getAttrLink (attr) {
      return `https://vennt.fandom.com/wiki/${this.getAttrFullName(attr)}_(${attr.toUpperCase()})`
    },
    showDiceForAttr (attr) {
      return this.selectedAttr === attr
    },
    attrButton (attr) {
      if (this.selectedAttr === attr) {
        this.selectedAttr = ''
      } else {
        this.selectedAttr = attr
      }
      // TODO: Might want to just roll evertime this is openned to remove confusion
      if (this.latestRoll[attr] === null) {
        // this.attrRollButton(attr)
      }
    },
    attrButtonClass (attr) {
      if (this.selectedAttr === attr) {
        return 'selected'
      }
      return ''
    },
    attrRollButton (attr) {
      const rollStr = '3d6' + (this.character[attr] >= 0 ? '+' : '') + this.character[attr]
      this.latestRoll[attr] = new DiceRoll(rollStr)
    },
    showDice (attr) {
      return this.latestRoll[attr] !== null
    },
    getDiceRolls (attr) {
      return this.latestRoll[attr].rolls
    },
    renderDie (diceElement) {
      return typeof diceElement === 'object' && diceElement.length > 0 && typeof diceElement.value === 'number'
    },
    renderMath (diceElement) {
      return typeof diceElement === 'string'
    },
    renderConstant (diceElement) {
      return typeof diceElement === 'number'
    },
    getDiceTotal (attr) {
      return this.latestRoll[attr].total
    },
    getDiceNotation (attr) {
      return this.latestRoll[attr].notation
    },
    getDiceAverage (attr) {
      return this.latestRoll[attr].averageTotal
    }
  }
}
</script>

<style scoped>

.panel {
  margin-left: 16px;
  margin-right: 16px;
}

.displayName {
  text-align: center;
  border-bottom: 2px solid var(--gray-400);
}

.combatStats {
  display: grid;
  grid-template-columns: repeat(2, 50% [col-start]);
  margin-right: -4px;
  margin-left: -4px;
}
.stat {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px;
  padding: 10px 8px 10px 8px;
}
.statNumbers {
  display: flex;
  align-items: center;
  /* Absolute so numbers are in space place for every combat stat */
  position: absolute;
  margin-left: 55px;
}
.slash {
  font-size: 25pt;
  font-weight: 300;
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

.alignRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.attrFullName {
  font-size: 16pt;
  font-weight: 500;
}

.basicBtnSVG {
  margin-right: 8px;
}

.diceSVG {
  fill: var(--red-600)
}

.diceDropDown {
  margin-top: 4px;
  margin-bottom: 4px;
  min-height: 160px;
}

.diceSection {
  margin-top: 8px;
}

.diceSum {
  margin-bottom: 8px;
}

.diceRow {
  display: flex;
  flex-wrap: wrap;
}

.leftMargin {
  position: absolute;
  margin-left: 56px;
}
.leftMarginWide {
  position: absolute;
  margin-left: 90px;
}

.number {
  font-family: 'roboto', monospace;
  font-weight: 400;
}

.diceElement {
  font-family: 'roboto', monospace;
  font-weight: 500;
  font-size: 22pt;
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.dice {
  background-color: var(--red-600);
  color: white;
}

.math {
  font-weight: 400;
  width: 30px;
}

/* Pile constant and border on top of each other, so the border doesn't affect the height for the number */
.constantContainer {
  position: relative;
  width: 34px;
  height: 34px;
  border: 3px solid var(--yellow-300);
}
.constant {
  position: absolute;
  margin-left: -3px; /* margin left instead of top because of 3px border in container */
}

.total {
  font-family: 'roboto', monospace;
  font-weight: 500;
  font-size: 22pt;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.tall {
  height: 64px;
}

.shiftDown {
  margin-top: 3px;
}

.singleStat {
  margin: 0px 0px 8px 0px;
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
