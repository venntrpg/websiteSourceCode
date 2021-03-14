<template>
  <div>
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav">
      <button v-on:click="createNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect createNavButton">CREATE CHARACTER</button>
      <button v-on:click="statsNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect statsNavButton">SHOW STATS</button>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]">
      <div class="displayName">
        <h2 v-html="create.name"></h2>
      </div>
      <div class="alignRow">
        Gift: <div v-html="getGiftName"></div>
      </div>
      <div class="alignRow">
        HP: <div v-html="calculateHP"></div> / <div v-html="calculateHP"></div>
      </div>
      <div class="alignRow">
        MP: <div v-html="calculateMP"></div> / <div v-html="calculateMP"></div>
      </div>
      <div class="alignRow">
        Vim: <div v-html="calculateVim"></div> / <div v-html="calculateVim"></div>
      </div>
      <div v-for="attr in validAttributes" v-bind:key="attr" class="alignRow">
        <div v-html="attr.toUpperCase()"></div>: <div v-html="calculateAttribute(attr)"></div>
      </div>
    </div>
    <!--  --------------------- START OF NORMAL CHARACTER CREATION FLOW --------------------- -->
    <div class="page sideBarPage" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <h1>CHARACTER CREATION</h1>
        <div v-if="isNewCharacter">
          <!--  --------------------- STEP 1 --------------------- -->
          <h2>Step 1: Choose a name</h2>
          <div>
            This follows the guide on the <a href="https://vennt.fandom.com/wiki/Character_Creation" target="_blank" class="link">character creation wiki page</a>.
          </div>
          <div>
            Choose a name for your character. You can always come back to this step later. Or, press the button to generate a random name for now.
          </div>
          <div class="alignRow nameRow">
            <input type="text" name="charName" placeholder="Bilbo Baggins" class="input nameInput" v-model="create.name">
            <button v-on:click="randomNameButton()" class="btn roundedButton randomNameButton" :disabled="randomNamesDisabled">
              <div class="btnContents">
                <RefreshSVG class="matchText" />Random name
              </div>
            </button>
          </div>
          <!--  --------------------- STEP 2 --------------------- -->
          <h2>Step 2: Choose a Gift</h2>
          <div>
            <i>Most legends are born gifted in some way. Mozart was gifted in music, Achilles was gifted in combat, and Merlin was gifted in magic.
            There are nine gifts available to choose from as a hero of Amnis, each one providing unique boons to your character.</i>
          </div>
          <CreatePageGiftSelection :gift="create.gift" @giftUpdated="giftUpdated" />
          <!--  --------------------- STEP 3 --------------------- -->
          <h2>Step 3: Create your backstory</h2>
          Do this somewhere else for now. Also make Tides, Grates, and Quests
          <!--  --------------------- STEP 4 --------------------- -->
          <h2>Step 4: Attribute scores</h2>
          <!--  --------------------- STEP 5 --------------------- -->
          <h2>Step 5: Beginner's equipment</h2>
          <!--  --------------------- STEP 6 --------------------- -->
          <h2>Step 6: Abilities and XP</h2>
        </div>
        <div v-else-if="isImportCharacter">
          Import character creation flow
        </div>
        <!--  --------------------- CHARACTER NOT STARTED --------------------- -->
        <div v-else>
          <button v-on:click="newCharacterButton()" class="btn roundedButton wide noSelect">Make a new character!</button>
          <button v-on:click="importCharacterButton()" class="btn roundedButton wide noSelect">Import an old character!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RefreshSVG from '../components/Common/RefreshSVG.vue'
import CreatePageGiftSelection from '../components/CreatePage/CreatePageGiftSelection.vue'
import { ResponsiveDirective } from 'vue-responsive-components'
import { mapState } from 'vuex'

// Constants
const NEW_CREATION_FLOW = 'new'
const IMPORT_CREATION_FLOW = 'import'

export default {
  name: 'Create',
  components: {
    RefreshSVG,
    CreatePageGiftSelection
  },
  directives: {
    responsive: ResponsiveDirective
  },
  data () {
    return {
      showingStats: false,
      creationFlow: '',
      breakpoints: {
        bp1000: el => el.width < 1000,
        bp600: el => el.width < 600
      },
      create: {
        name: '',
        gift: '',
        childAttrs: [],
        adultAttrs: [],
        badAttr: '',
        sideItem: '',
        outfit: '',
        experienced: false,
        itemSet: ''
      },
      // NOT USING ANY STATS BELOW HERE ANYMORE:
      character: {
        name: '',
        gift: '',
        agi: 0,
        cha: 0,
        dex: 0,
        int: 0,
        per: 0,
        spi: 0,
        str: 0,
        tek: 0,
        wis: 0,
        hp: 0,
        maxHp: 0,
        mp: 0,
        maxMp: 0,
        vim: 0,
        maxVim: 0,
        armour: 0,
        hero: 0,
        init: 0,
        speed: 0,
        xp: 0,
        sp: 0
      }
    }
  },
  beforeMount () {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      // this.$router.push({ name: 'Home' })
    }
    this.creationFlow = localStorage.getItem('creation-flow')
    if (this.creationFlow === NEW_CREATION_FLOW) {
      const rawChar = localStorage.getItem('creation-create-wip')
      if (rawChar) {
        try {
          const char = JSON.parse(rawChar)
          // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
          this.create = char
        } catch (e) {
        // stored json was malformed, so we delete it and restart fresh
          localStorage.removeItem('creation-create-wip')
        }
      }
    }
  },
  mounted () {
    // call silly api for getting random names
    this.$store.dispatch('getRandomNames')
  },
  computed: {
    ...mapState(['isLoggedIn', 'randomNames', 'randomNamesDisabled']),
    isNewCharacter () {
      return this.creationFlow === NEW_CREATION_FLOW
    },
    isImportCharacter () {
      return this.creationFlow === IMPORT_CREATION_FLOW
    },
    getHiddenSidebarClass () {
      if (this.create.name === '') {
        return 'hidden'
      }
      return ''
    },
    getMobileSidebarClass () {
      if (this.showingStats) {
        return 'showStats'
      }
      return ''
    },
    validAttributes () {
      return ['per', 'tek', 'agi', 'dex', 'int', 'spi', 'str', 'wis', 'cha']
    },
    // formulas come from https://vennt.fandom.com/wiki/Character_Creation
    calculateHP () {
      const levelHP = this.create.experienced ? 2 : 1
      return 20 + levelHP + this.calculateAttribute('str') * 3
    },
    calculateMP () {
      return 6 + this.calculateAttribute('wis') * 3
    },
    calculateVim () {
      return this.calculateHP
    },
    calculateInit () {
      return this.calculateAttribute('agi') + this.calculateAttribute('dex')
    },
    calculateSpeed () {
      return 3 + this.calculateAttribute('agi')
    },
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
    }
  },
  methods: {
    newCharacterButton () {
      localStorage.setItem('creation-flow', NEW_CREATION_FLOW)
      this.creationFlow = NEW_CREATION_FLOW
    },
    importCharacterButton () {
      localStorage.setItem('creation-flow', IMPORT_CREATION_FLOW)
      this.creationFlow = IMPORT_CREATION_FLOW
    },
    createNavButton () {
      this.showingStats = false
    },
    statsNavButton () {
      this.showingStats = true
    },
    randomNameButton () {
      if (this.randomNames.length < 3) {
        // need to get more random names
        this.$store.dispatch('getRandomNames')
      }
      if (this.randomNames.length > 0) {
        // pop item off front of array
        this.create.name = this.randomNames[0]
        this.$store.commit('shiftRandomNames')
      }
    },
    giftUpdated (newGift) {
      this.create.gift = newGift
      this.backupCreate()
    },
    isValidAttribute (attr) {
      return this.validAttributes.includes(attr)
    },
    calculateAttribute (attr) {
      if (!this.isValidAttribute(attr)) {
        return 0
      }
      let sum = 0
      // gift gets +2
      if (this.create.gift === attr) {
        sum += 2
      }
      // child & adult attributes
      if (this.create.childAttrs.includes(attr)) {
        sum += 1
      }
      if (this.create.adultAttrs.includes(attr)) {
        sum += 1
      }
      if (this.create.badAttr === attr) {
        sum -= 1
      }
      // add attribute according to side item
      const sideItemMap = {
        painful: 'str',
        sharp: 'dex',
        quick: 'per',
        useful: 'wis',
        eat: 'str',
        read: 'int'
      }
      if (sideItemMap[this.create.sideItem] === attr) {
        sum += 1
      }
      // add attribute according to outfit
      const outfitMap = {
        fashionable: 'cha',
        functional: 'agi'
      }
      if (outfitMap[this.create.outfit] === attr) {
        sum += 1
      }
      return sum
    },
    backupCreate () {
      localStorage.setItem('creation-create-wip', JSON.stringify(this.create))
    }
  }
}
</script>

<style scoped lang="postcss">

/* SIDEBAR STYLING */

.sideBar {
  position: fixed;
  z-index: 1;
  top: 42px; /* 42px is the height of the nav bar */
  left: 0;
  overflow-x: hidden;
  width: 400px;
  min-height: calc(100vh - 42px); /* 42px is the height of the nav bar */
  -webkit-box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
}
.sideBar.hidden {
  display: none;
}

.sideBarPage {
  margin-left: 400px;
}
.sideBarPage.hidden {
  margin-left: 0px;
}

.displayName {
  text-align: center;
  border-bottom: 2px solid var(--gray-400);
}

/* PAGE STYLING */

h1 {
  text-align: center;
}

.nameInput {
  max-width: 300px;
  margin-right: 10px;
}

.alignRow {
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.btnContents {
  display: flex;
  align-items: center;
}

.matchText {
  fill: white;
}

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
    margin-top: 80px; /* 42px + 38px to account for the navs */
  }
  .sideBar {
    top: 80px; /* 42px + 38px to account for the navs */
    min-height: calc(100vh - 80px);
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

/* mobile styles */
.main.bp600 .nameRow {
  display: block;
}
.main.bp600 .nameInput {
  margin-right: 0px;
  max-width: 100%;
}
.main.bp600 .randomNameButton {
  margin-top: 8px;
  width: calc(100% - 20px);
}
</style>
