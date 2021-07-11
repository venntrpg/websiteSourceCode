<template>
  <div>
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav" v-bind:class="getSelectScreenClass">
      <button v-on:click="createNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect createNavButton">CREATE CHARACTER</button>
      <button v-on:click="statsNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect statsNavButton">SHOW STATS</button>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass, getSelectScreenClass]">
      <CombatStats :character="createCharacter" />
    </div>
    <!--  --------------------- START OF CHARACTER CREATION FLOW --------------------- -->
    <div class="page sideBarPage" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass, getSelectScreenClass]">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <div v-if="isNewCharacter">
          <h1>CREATE NEW CHARACTER</h1>
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
          TODO: intergrate this into the site better.
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
            <button v-on:click="createCharacterButton()" class="btn roundedButton">
              <div class="btnContents">
                Create Character
              </div>
            </button>
            <button v-if="clearCreateShowing" v-on:click="clearCreateButton()" class="btn basicBtn">
              <div class="basicBtnContents">
                Clear Character
              </div>
            </button>
            <button v-else v-on:click="clearCreateCharacter()" class="btn basicBtn">
              <div class="basicBtnContents">
                Are you sure?
              </div>
            </button>
          </div>
        </div>
        <!--  --------------------- START OF CHARACTER IMPORT FLOW --------------------- -->
        <div v-else-if="isImportCharacter">
          <h1>IMPORT CHARACTER</h1>
          <h2>Copy in your Character Stats</h2>
          Character name:
          <input type="text" name="name" placeholder="Bilbo Baggins" class="input smallTopMargin" v-model="character.name" v-on:blur="backupImport">
          Attributes:
          <div class="attributeInputContainer">
            <div v-for="attr in validAttributes" v-bind:key="attr" class="attributeInput">
              <div class="attributeName">{{attr.toUpperCase()}}:</div>
              <input type="number" placeholder="0" class="input" v-model="character[attr]" v-on:blur="backupImport">
            </div>
          </div>
          Max HP: <input type="number" placeholder="0" class="input" v-model="character.maxHp" v-on:blur="backupImport">
          Max MP: <input type="number" placeholder="0" class="input" v-model="character.maxMp" v-on:blur="backupImport">
          Max Vim: <input type="number" placeholder="0" class="input" v-model="character.maxVim" v-on:blur="backupImport">
          Current Hero Points: <input type="number" placeholder="0" class="input" v-model="character.hero" v-on:blur="backupImport">
          Max Hero Points: <input type="number" placeholder="0" class="input" v-model="character.maxHero" v-on:blur="backupImport">
          Initiative: <input type="number" placeholder="0" class="input" v-model="character.init" v-on:blur="backupImport">
          Speed: <input type="number" placeholder="0" class="input" v-model="character.speed" v-on:blur="backupImport">
          Armor: <input type="number" placeholder="0" class="input" v-model="character.armor" v-on:blur="backupImport">
          Total XP: <input type="number" placeholder="0" class="input" v-model="character.xp" v-on:blur="backupImport">
          SP: <input type="number" placeholder="0" class="input" v-model="character.sp" v-on:blur="backupImport">
          <h2>Import your Character</h2>
          Click the "Create Character" button to officially create the character.
          Click the "Clear Character" button to delete this character and start again.
          <div class="bottomButtons">
            <button v-on:click="createCharacterButton()" class="btn roundedButton">
              <div class="btnContents">
                Create Character
              </div>
            </button>
            <button v-if="clearCreateShowing" v-on:click="clearCreateButton()" class="btn basicBtn">
              <div class="basicBtnContents">
                Clear Character
              </div>
            </button>
            <button v-else v-on:click="clearCreateCharacter()" class="btn basicBtn">
              <div class="basicBtnContents">
                Are you sure?
              </div>
            </button>
          </div>
        </div>
        <!--  --------------------- CHARACTER NOT STARTED --------------------- -->
        <div v-else class="selectFlowContainer">
          <div class="selectFlow">
            <h1>CHARACTER CREATION</h1>
            You can create a totally new character or import a character which you have already created.
            <button v-on:click="newCharacterButton()" class="btn roundedButton wide noSelect topMargin">Make a new character!</button>
            <button v-on:click="importCharacterButton()" class="btn roundedButton wide noSelect topMargin">Import an old character!</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import RefreshSVG from '../components/Common/SVGs/RefreshSVG.vue'
import AttributeSelection from '../components/CreatePage/AttributeSelection.vue'
import CombatStats from '../components/Common/CombatStats.vue'
import GiftSelection from '../components/CreatePage/GiftSelection.vue'
import RadioButtonSelection from '../components/Common/RadioButtonSelection.vue'
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
    CombatStats,
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
      clearCreateShowing: true,
      breakpoints: {
        bp900: el => el.width < 900,
        bp600: el => el.width < 600
      },
      // Stats used for CREATE flow
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
      // Stats used for IMPORT flow
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
        hero: 0,
        maxHero: 0,
        armor: 0,
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
      this.$router.push({ name: 'Home' })
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
    } else if (this.creationFlow === IMPORT_CREATION_FLOW) {
      const rawChar = localStorage.getItem('creation-import-wip')
      if (rawChar) {
        try {
          const char = JSON.parse(rawChar)
          // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
          this.character = char
        } catch (e) {
          // stored json was malformed, so we delete it and restart fresh
          localStorage.removeItem('creation-import-wip')
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
      return !(this.create.name !== '' || this.character.name) ? 'hidden' : ''
    },
    getMobileSidebarClass () {
      return this.showingStats ? 'showStats' : ''
    },
    getSelectScreenClass () {
      return (!this.isNewCharacter && !this.isImportCharacter) ? 'selectFlowPage' : ''
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
    createCharacter () {
      if (this.isNewCharacter) {
        return {
          name: this.create.name,
          gift: this.create.gift,
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
          hero: 3,
          maxHero: 9,
          armor: 0,
          init: this.calculateInit,
          speed: this.calculateSpeed,
          xp: this.calculateXP,
          sp: this.calculateSP
        }
      } else {
        return {
          name: this.character.name,
          agi: this.parseNumber(this.character.agi),
          cha: this.parseNumber(this.character.cha),
          dex: this.parseNumber(this.character.dex),
          int: this.parseNumber(this.character.int),
          per: this.parseNumber(this.character.per),
          spi: this.parseNumber(this.character.spi),
          str: this.parseNumber(this.character.str),
          tek: this.parseNumber(this.character.tek),
          wis: this.parseNumber(this.character.wis),
          // automatically set some stats to max value
          hp: this.parseNumber(this.character.maxHp),
          maxHp: this.parseNumber(this.character.maxHp),
          mp: this.parseNumber(this.character.maxMp),
          maxMp: this.parseNumber(this.character.maxMp),
          vim: this.parseNumber(this.character.maxVim),
          maxVim: this.parseNumber(this.character.maxVim),
          hero: this.parseNumber(this.character.hero),
          maxHero: this.parseNumber(this.character.maxHero),
          armor: this.parseNumber(this.character.armor),
          init: this.parseNumber(this.character.init),
          speed: this.parseNumber(this.character.speed),
          xp: this.parseNumber(this.character.xp),
          sp: this.parseNumber(this.character.sp)
        }
      }
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
      this.create.childAttrs = this.create.childAttrs.filter(attr => attr !== newGift)
      this.create.adultAttrs = this.create.adultAttrs.filter(attr => attr !== newGift)
      this.create.badAttrs = this.create.badAttrs.filter(attr => attr !== newGift)
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
    backupImport () {
      localStorage.setItem('creation-import-wip', JSON.stringify(this.character))
    },
    parseNumber (num) {
      const result = parseInt(num)
      return !isNaN(result) ? result : 0
    },
    createCharacterButton () {
      if (this.createCharacter.name === '') {
        // should probably print an error message on the page or something ¯\_(ツ)_/¯
        return
      }
      console.log(this.createCharacter)
      // need to send this, then once confirmed, send weapon if they selected one, then once cofirmed, we should redirect to the character page
      this.$store.dispatch('createCharacter', { character: this.createCharacter, redirectToCharacter: true })

      // TODO: Wait to see if this api returns confirmed
      // this.clearCreateCharacter()
      // console.log(id)
      // this.$router.push({ name: 'Character', params: { id } })
    },
    clearCreateButton () {
      this.clearCreateShowing = false
    },
    clearCreateCharacter () {
      localStorage.removeItem('creation-create-wip')
      localStorage.removeItem('creation-import-wip')
      localStorage.removeItem('creation-flow')
      this.clearCreateShowing = true
      this.creationFlow = ''
      // reset local data
      this.create = {
        name: '',
        gift: '',
        childAttrs: [],
        adultAttrs: [],
        badAttrs: [],
        sideItem: '',
        outfit: '',
        itemSet: '',
        inexperienced: true
      }
      this.character = {
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
        hero: 0,
        maxHero: 0,
        armor: 0,
        init: 0,
        speed: 0,
        xp: 0,
        sp: 0
      }
    }
  }
}
</script>

<style scoped lang="postcss">

.selectFlowContainer {
  display: flex;
  justify-content: center;
}
.selectFlow {
  width: 320px;
}

.topMargin {
  margin-top: 12px;
}
.smallTopMargin {
  margin-top: 2px;
}

h1 {
  text-align: center;
}

.nameInput {
  max-width: 300px;
  margin-right: 10px;
}

.alignRow {
  margin-top: 5px;
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

.attributeInputContainer {
  display: grid;
  grid-template-columns: repeat(3, 33% [col-start]);
  grid-gap: 8px;
  margin-right: 8px;
}
.attributeInput {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.attributeName {
  width: 72px;
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
  .subNav:not(.selectFlowPage) {
    display: flex;
  }
  .page:not(.selectFlowPage) {
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
  .sideBar.showStats:not(.selectFlowPage) {
    display: block;
  }
  .sideBarPage:not(.showStats) {
    display: flex;
    margin-left: 0px;
  }
  .sideBarPage.showStats:not(.selectFlowPage) {
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
