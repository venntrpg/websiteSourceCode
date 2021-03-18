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
    <!--  --------------------- START OF CHARACTER CREATION FLOW --------------------- -->
    <div class="page sideBarPage" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <h1>CHARACTER CREATION</h1>
        <div v-if="isNewCharacter">
          <h2>Step 1: Choose a name</h2>
          This follows the guide on the <a href="https://vennt.fandom.com/wiki/Character_Creation" target="_blank" class="link">character creation wiki page</a>.
          <br>
          Choose a name for your character. You can always come back to this step later. Or, press the button to generate a random name for now.
          <div class="alignRow nameRow">
            <input type="text" name="charName" placeholder="Bilbo Baggins" class="input nameInput" v-model="create.name">
            <button v-on:click="randomNameButton()" class="btn roundedButton randomNameButton" :disabled="randomNamesDisabled">
              <div class="btnContents">
                <RefreshSVG class="matchText" />Random name
              </div>
            </button>
          </div>
          <h2>Step 2: Create your backstory</h2>
          For now, this process must be completed in a seperate document.
          Follow <a href="https://vennt.fandom.com/wiki/Backstory" target="_blank" class="link">this wiki page</a> for help with coming up a character concept
          and describing your backstory.
          <h2>Step 3: Develop your Flux</h2>
          TODO: integreate this better into the site.
          <br>
          Once you have developed your backstory, your <a href="https://vennt.fandom.com/wiki/Flux" target="_blank" class="link">Flux</a> represents who you are right now:
          your personality, your ambitions, and so on.
          <ol>
            <li>Create 1-3 <a href="https://vennt.fandom.com/wiki/Tides" target="_blank" class="link">Tides</a></li>
            <li>Create 1-3 <a href="https://vennt.fandom.com/wiki/Grates" target="_blank" class="link">Grates</a></li>
            <li>Create 1-3 <a href="https://vennt.fandom.com/wiki/Quests" target="_blank" class="link">Quests</a></li>
          </ol>
          <h2>Step 4: Choose a Gift</h2>
          <div>
            <i>Most legends are born gifted in some way. Mozart was gifted in music, Achilles was gifted in combat, and Merlin was gifted in magic.
            There are nine gifts available to choose from as a hero of Amnis, each one providing unique boons to your character.</i>
          </div>
          <GiftSelection :gift="create.gift" @giftUpdated="giftUpdated" />
          <h2>Step 5: Attribute scores</h2>
          In this step, you select your base attributes.
          <br>
          Select three attributes you used most as a child.
          If this would cause any of your Attributes to go over 3, pick the second-most relevant Attribute, and increase that by one instead.
          <AttributeSelection
          :attributes="validAttributes"
          :selected="create.childAttrs"
          :maxChoices="3"
          :disabledChoices="blockChildAttrsChoices"
          @selectedUpdated="childAttrsUpdated"
          class="bottomMargin" />
          Select three attributes you used most in the last six years.
          If this would cause any of your Attributes to go over 3, pick the second-most relevant Attribute, and increase that by one instead.
          <AttributeSelection
          :attributes="validAttributes"
          :selected="create.adultAttrs"
          :maxChoices="3"
          :disabledChoices="blockAdultAttrsChoices"
          @selectedUpdated="adultAttrsUpdated"
          class="bottomMargin" />
          Select one attribute that is currently at 0.
          If you have no Attributes at 0, skip this step.
          You may pick any Attribute from amongst those at 0, but if your character is...
          <ul>
            <li>Inattentive... ...You might want to pick PER.</li>
            <li>A luddite... ...You might want to pick TEK.</li>
            <li>Clumsy... ...You might want to pick DEX.</li>
            <li>Ignorant... ...You might want to pick INT.</li>
            <li>Impatient... ...You might want to pick WIS.</li>
            <li>Sluggish... ...You might want to pick AGI.</li>
            <li>Apathetic... ...You might want to pick SPI.</li>
            <li>Weak... ...You might want to pick STR.</li>
            <li>Repulsive... ...You might want to pick CHA.</li>
          </ul>
          <AttributeSelection
          :attributes="validAttributes"
          :selected="create.badAttrs"
          :maxChoices="1"
          :disabledChoices="blockBadAttrsChoices"
          @selectedUpdated="badAttrsUpdated" />
          <h2>Step 6: Beginner's equipment</h2>
          This section helps you figure out what equipment you have on you.
          <br>
          1. What do you keep at your side?
          <RadioButtonSelection
          :options="getSideEquipmentOptions"
          :selected="create.sideItem"
          @selectedUpdated="sideItemUpdated"
          class="bottomMargin" />
          2. Describe your outfit.
          <br>
          This is your starting Item Container. If you buy another item container, it replaces this one.
          <RadioButtonSelection
          :options="getOutfitOptions"
          :selected="create.outfit"
          @selectedUpdated="outfitUpdated"
          class="bottomMargin" />
          3. What did you bring with you?
          Note: Actually adding these items to your inventory hasn't been implemented yet here, you will need to add them manually on the Character page
          <RadioButtonSelection
          :options="getItemSetOptions"
          :selected="create.itemSet"
          @selectedUpdated="itemSetUpdated" />
          <h2>Step 7: XP and Abilities</h2>
          Are you new to adventuring?
          <RadioButtonSelection
          :options="getInexperiencedOptions"
          :selected="getInexperiencedOption"
          @selectedUpdated="experienceUpdated"
          class="bottomMargin" />
          For now, you need to go to the Character page to select abilities.
          Hopefully functionality for adding abilities and initial items will be added here in the future!
          <h2>Step 8: Finish the character</h2>
          Click the "Create Character" button to officially create the character.
          Click the "Clear Character" button to delete this character and start again.
          <div class="bottomButtons">
            <button v-on:click="createCharacterButton" class="btn roundedButton">
              <div class="btnContents">
                Create Character
              </div>
            </button>
            <button class="btn basicBtn">
              <div class="basicBtnContents">
                Clear Character
              </div>
            </button>
          </div>
        </div>
        <!--  --------------------- START OF CHARACTER IMPORT FLOW --------------------- -->
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
import AttributeSelection from '../components/CreatePage/AttributeSelection.vue'
import GiftSelection from '../components/CreatePage/GiftSelection.vue'
import RadioButtonSelection from '../components/CreatePage/RadioButtonSelection.vue'
import { ResponsiveDirective } from 'vue-responsive-components'
import { mapState } from 'vuex'

// Constants
const NEW_CREATION_FLOW = 'new'
const IMPORT_CREATION_FLOW = 'import'

export default {
  name: 'Create',
  components: {
    RefreshSVG,
    AttributeSelection,
    GiftSelection,
    RadioButtonSelection
  },
  directives: {
    responsive: ResponsiveDirective
  },
  data () {
    return {
      showingStats: false,
      creationFlow: '',
      breakpoints: {
        bp900: el => el.width < 900,
        bp600: el => el.width < 600
      },
      create: {
        name: '',
        gift: '',
        childAttrs: [],
        adultAttrs: [],
        badAttrs: [],
        sideItem: '',
        outfit: '',
        itemSet: '',
        inexperienced: true
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
      const levelHP = this.create.inexperienced ? 1 : 2
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
    calculateXP () {
      let sum = 0
      sum += this.create.inexperienced ? 1000 : 2500
      if (this.create.sideItem === 'read') {
        sum += 75
      }
      return sum
    },
    calculateSP () {
      let sum = 0
      if (['useful', 'eat'].includes(this.create.sideItem)) {
        sum += 30
      }
      if (this.create.outfit === 'fashionable') {
        sum += 100
      }
      return sum
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
    },
    blockChildAttrsChoices () {
      return this.validAttributes.filter(attr => (this.create.gift === attr && this.create.adultAttrs.includes(attr)) || this.create.badAttrs.includes(attr))
    },
    blockAdultAttrsChoices () {
      return this.validAttributes.filter(attr => (this.create.gift === attr && this.create.childAttrs.includes(attr)) || this.create.badAttrs.includes(attr))
    },
    blockBadAttrsChoices () {
      return this.validAttributes.filter(attr => this.create.gift === attr || this.create.childAttrs.includes(attr) || this.create.adultAttrs.includes(attr))
    },
    getSideEquipmentOptions () {
      return {
        painful: '<b>Something painful:</b> Gain +1 Strength. Add a Brutal weapon to your inventory',
        sharp: '<b>Something sharp:</b> Gain +1 Dexterity. Add a Blade weapon to your inventory',
        quick: '<b>Something quick:</b> Gain +1 Perception. Add a Sidearm weapon to your inventory',
        useful: '<b>Something useful:</b> Gain +1 Wisdom and 30 sp to spend on Equipment.',
        eat: '<b>Something to eat:</b> Gain +1 Strength and 30 sp to spend on Consumables.',
        read: '<b>Something to read:</b> Gain +1 Intelligence and 75 XP.'
      }
    },
    getOutfitOptions () {
      return {
        fashionable: '<b>Fashionable:</b> Gain +1 Charisma and 100sp. You have a carrying capacity of 5 Bulk.',
        functional: '<b>Functional:</b> Gain +1 Agility. You have a carrying capacity of 15 Bulk.'
      }
    },
    getItemSetOptions () {
      return {
        chef: '<b>Chef:</b> 3 Rations, 3 Tasty Waters, 1 Frying Pan, 1 Cooking Kit',
        dungeoneer: '<b>Dungeoneer:</b> 1 Flare Rocket, 1 Lockpick set, 1 Flint and Steel, 1 Rope, 1 bag of Sounding Stones, 1 Lux Ward, 1 Lantern',
        merchant: '<b>Merchant:</b> 1 Elixir of Energy, 1 Rope, 1 Writing Kit, 1 Lantern, 3 Coffee or Alcohol',
        medic: '<b>Medic:</b> 3 Bandages, 2 Healing Salves, 1 Godfire, 1 Sour Blessing, 1 Elixir of Life',
        scientist: '<b>Scientist:</b> 1 Lux Ward, 1 Elixir of Focus, 1 Compass, 1 Writing Kit, 1 Bullseye Lantern',
        Traveler: '<b>Traveler:</b> 1 Bedroll, 1 Lux Ward, 1 Spyglass, 6 Rations'
      }
    },
    getInexperiencedOption () {
      return this.create.inexperienced ? 'yes' : 'no'
    },
    getInexperiencedOptions () {
      return {
        yes: `<b>Yes:</b> Gain 1000 XP. When you complete a Novice Path for the first time, gain 300 XP.
        When you complete a Journeyman Path for the first time, gain 700 XP.
        When you complete an Adept Path for the first time, gain 1000 XP.`,
        no: '<b>No:</b> Gain 2500 XP.'
      }
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
    childAttrsUpdated (newList) {
      this.create.childAttrs = newList
      this.backupCreate()
    },
    adultAttrsUpdated (newList) {
      this.create.adultAttrs = newList
      this.backupCreate()
    },
    badAttrsUpdated (newList) {
      this.create.badAttrs = newList
      this.backupCreate()
    },
    sideItemUpdated (newItem) {
      this.create.sideItem = newItem
      this.backupCreate()
    },
    outfitUpdated (newOutfit) {
      this.create.outfit = newOutfit
      this.backupCreate()
    },
    itemSetUpdated (newItemSet) {
      this.create.itemSet = newItemSet
      this.backupCreate()
    },
    experienceUpdated (inexperienced) {
      this.create.inexperienced = (inexperienced === 'yes')
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
      if (this.create.badAttrs.includes(attr)) {
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
    },
    createCharacterButton () {
      const character = {
        name: this.create.name,
        agi: this.calculateAttribute('agi'),
        cha: this.calculateAttribute('cha'),
        dex: this.calculateAttribute('dex'),
        int: this.calculateAttribute('int'),
        per: this.calculateAttribute('per'),
        spi: this.calculateAttribute('spi'),
        str: this.calculateAttribute('str'),
        tek: this.calculateAttribute('tek'),
        wis: this.calculateAttribute('wis'),
        hp: this.calculateHP,
        maxHp: this.calculateHP,
        mp: this.calculateMP,
        maxMp: this.calculateMP,
        vim: this.calculateVim,
        maxVim: this.calculateVim,
        armour: 0,
        hero: 3,
        init: this.calculateInit,
        speed: this.calculateSpeed,
        xp: this.calculateXP,
        sp: this.calculateSP
      }
      // for now, we are just logging this. In the future, this will get hooked back up to the api
      console.log(character)
      // need to send this, then once confirmed, send weapon if they selected one, then once cofirmed, we should redirect to the character page
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

.bottomMargin {
  margin-bottom: 20px;
}

.bottomButtons {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 150px;
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
