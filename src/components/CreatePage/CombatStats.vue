<template>
  <div class="panel">
    <h2>Combat Stats</h2>
    <div class="card combatStats">
      <div class="stat">
        HP: {{ character.hp }}<div class="slash">/</div>{{ character.maxHp }}
      </div>
      <div class="stat">
        MP: {{ character.mp }}<div class="slash">/</div>{{ character.maxMp }}
      </div>
      <div class="stat">
        VIM: {{ character.vim }}<div class="slash">/</div>{{ character.maxVim }}
      </div>
    </div>
    <h2>Attributes</h2>
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
            {{ attr.toUpperCase() }}: {{ character[attr] }}
          </div>
        </button>
      </div>
      <div
      v-for="attr in attrRow"
      v-bind:key="attr">
        <div v-if="showDiceForAttr(attr)" class="card">
          <div class="margin">
            <div class="alignRow">
              <div class="attrFullName">{{ getAttrFullName(attr) }}</div>
              <button v-on:click="attrRollButton(attr)" class="btn noSelect basicBtn">
                <div class="basicBtnContents"><DiceSVG class="basicBtnSVG" /> Roll Dice</div>
              </button>
            </div>
            <!-- Procedurally render dice rolls so if they are in a more complicated format than 3d6 + constant we can handle it -->
            <div v-if="showDice(attr)" class="diceSection">
              <div class="diceRow">
                <div
                v-for="(diceElement, i) in getDiceRolls(attr)"
                v-bind:key="i"
                class="diceRow">
                  <div v-if="renderDie(diceElement)" class="diceRow">
                    <div
                    v-for="(die, j) in diceElement.rolls"
                    v-bind:key="j"
                    class="diceRow">
                      <div v-if="j !== 0" class="math">+</div>
                      <div class="dice">{{ die.value }}</div>
                    </div>
                  </div>
                  <div v-else-if="renderMath(diceElement)" class="math">{{ diceElement }}</div>
                  <div v-else-if="renderConstant(diceElement)" class="constantContainer">
                    <div class="constant">{{ diceElement }}</div>
                    <div class="constantBorder"></div>
                  </div>
                </div>
                <div class="diceRow">
                  <div class="math">=</div>
                  <div class="total">{{ getDiceTotal(attr) }}</div>
                </div>
              </div>
              <div>average value: {{ getDiceAverage(attr) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tall"></div>
  </div>
</template>

<script>

/*
TODO:
- Make sidepanel background slightly darker so white buttons are more visible
- Add animation (maybe) to opening and closing dice roll panels
- Make dice larger, should probably find a way to describe the syntax for the roll that is being run too
- Add other stats, like gift (if set), speed, etc
- maybe update other stat numbers to roboto because its a bit easier to work with
*/

import { DiceRoll } from 'rpg-dice-roller'
import DiceSVG from '../Common/DiceSVG.vue'

export default {
  name: 'combatStats',
  props: {
    character: Object
  },
  components: {
    DiceSVG
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
      const name = nameMap[this.create.gift]
      if (name) {
        return name
      }
      return ''
    },
    attributeRows () {
      return [['per', 'tek', 'agi'], ['dex', 'int', 'spi'], ['str', 'wis', 'cha']]
    },
    topAttributes () {
      return ['per', 'tek', 'agi']
    },
    middleAttributes () {
      return ['dex', 'int', 'spi']
    },
    bottomAttributes () {
      return ['str', 'wis', 'cha']
    }
  },
  methods: {
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
    showDiceForAttr (attr) {
      return this.selectedAttr === attr
    },
    attrButton (attr) {
      if (this.selectedAttr === attr) {
        this.selectedAttr = ''
      } else {
        this.selectedAttr = attr
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
      console.log(this.latestRoll[attr].rolls)
      return this.latestRoll[attr].rolls
    },
    renderDie (diceElement) {
      console.log(diceElement)
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
    getDiceAverage (attr) {
      return this.latestRoll[attr].averageTotal
    }
  }
}
</script>

<style scoped>

.panel {
  margin-left: 8px;
  margin-right: 8px;
}

.combatStats {
  justify-content: space-evenly;
}
.stat {
  font-size: 16pt;
  display: flex;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
}
.slash {
  font-size: 25pt;
  font-weight: 300;
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
  margin-bottom: 0px;
  border-radius: 5px 5px 0px 0px;
}
.attrButtonContents {
  font-size: 16pt;
}

.margin {
  margin: 4px;
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

.diceSection {
  margin-top: 8px;
}

.diceRow {
  display: flex;
}

.dice {
  background-color: var(--red-600);
  font-family: 'roboto mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  width: 30px;
  height: 30px;
  text-align: center;
  color: white;
  border-radius: 5px;
}

.math {
  font-family: 'roboto mono', monospace;
  font-weight: 400;
  font-size: 16pt;
  width: 25px;
  height: 30px;
  text-align: center;
}

/* Pile constant and border on top of each other, so the border doesn't affect the height for the number */
.constantContainer {
  position: relative;
  width: 30px;
  height: 30px;
}
.constant {
  font-family: 'roboto mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  position: absolute;
}
.constantBorder {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  border: 3px solid var(--yellow-300);
  position: absolute;
}

.total {
  font-family: 'roboto mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  height: 30px;
  text-align: center;
  border-radius: 5px;
}

.tall {
  height: 100px;
}

/* Mobile Styles */
@media screen and (max-width: 350px) {
  .panel {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
