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
              <div class="randomNameButtonContents">
                <RefreshSVG class="matchText" /> Random name
              </div>
            </button>
          </div>
          <!--  --------------------- STEP 2 --------------------- -->
          <h2>Step 2: Choose a Gift</h2>
          <div>
            <i>Most legends are born gifted in some way. Mozart was gifted in music, Achilles was gifted in combat, and Merlin was gifted in magic.
              There are nine gifts available to choose from as a hero of Amnis, each one providing unique boons to your character.</i>
          </div>
          <!-- TODO: add a dropdown here to hide / show this section of cards to make viewing the page a bit easier -->
          <div class="giftCardGroup">
            <button
            v-for="(gift, giftCode) in giftCopy"
            v-bind:key="giftCode"
            v-on:click="giftButton(giftCode)"
            class="btn noSelect giftCard"
            v-bind:class="getGiftSelectedClass(giftCode)">
              <h3 v-html="gift.title">
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                <i v-html="gift.flavor"></i>
                <ul>
                  <li v-for="benefit in gift.benefits" v-bind:key="benefit" v-html="benefit"></li>
                </ul>
              </div>
            </button>
          </div>
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
import { ResponsiveDirective } from 'vue-responsive-components'
import { mapState } from 'vuex'

// Constants
const NEW_CREATION_FLOW = 'new'
const IMPORT_CREATION_FLOW = 'import'

export default {
  name: 'CharacterCreation',
  components: {
    RefreshSVG
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
      const gift = this.giftCopy[this.create.gift]
      if (gift && gift.shortTitle) {
        return gift.shortTitle
      }
      return ''
    },
    giftCopy () {
      return {
        per: {
          title: 'Alertness, The Gift of Perception',
          shortTitle: 'Alertness',
          flavor: 'Your senses are razor sharp. If a tree falls and no one is around to hear it, you do.',
          benefits: [
            'This gift greatly benefits hunters, spies, and inquisitors.',
            this.getGiftedPathLinkSentence('Path of the Gifted Scout')
          ]
        },
        tek: {
          title: 'Craft, The Gift of Technology',
          shortTitle: 'Craft',
          flavor: 'You discover. You take apart and rebuild. You have a natural curiosity for how things work and a knack for making them do so.',
          benefits: [
            'This gift greatly benefits mechanics, craftsmen, and tinkers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Craftsman')
          ]
        },
        agi: {
          title: 'Alacrity, the Gift of Agility',
          shortTitle: 'Agility',
          flavor: `You can appear and disappear in the blink of an eye.
          Every surface, be they walls or even ceilings, is yours to traverse, as easily as others would walk across the street.
          You have almost as much maneuverability in midair as you do upon the ground, and you could barely lose a race even if you tried.`,
          benefits: [
            'This gift greatly benefits duelists, rogues, and gunslingers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Ninja')
          ]
        },
        dex: {
          title: 'Finesse, The Gift of Dexterity',
          shortTitle: 'Finesse',
          flavor: `Graceful as a cat, swift as the wind, you have mastered fine motor control.
          For good or evil, you can hide, dodge, maneuver, and strike with blade or bullet when your enemy least expects with startling precision.`,
          benefits: [
            'This gift greatly benefits duelists, rogues, and gunslingers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Duelist')
          ]
        },
        int: {
          title: 'Mind, The Gift of Intelligence',
          shortTitle: 'Mind',
          flavor: `You are a lifelong learner. Some call you a scholar, others call you a know-it-all.
          Either way, you have a photographic memory for textbooks and a natural talent for learning new disciplines.`,
          benefits: [
            'This gift greatly benefits polymaths, tacticians, and dilettantes.',
            this.getGiftedPathLinkSentence('Path of the Gifted Loremaster')
          ]
        },
        spi: {
          title: 'Magic, The Gift of Spirit',
          shortTitle: 'Magic',
          flavor: `You are one of the few who possess an intuitive knack for the arcane.
          In short, the spells you are able to cast and the strength with which you cast is immensely improved.`,
          benefits: [
            'This gift greatly benefits mages, priests, and arcane scholars.',
            this.getGiftedPathLinkSentence('Path of the Gifted Magician')
          ]
        },
        str: {
          title: 'Rage, The Gift of Strength',
          shortTitle: 'Rage',
          flavor: 'Brutality is in your blood. The only skill you don\'t possess is weakness. Everything else you have already taken by force.',
          benefits: [
            'This gift greatly benefits berserkers, bruisers, and fighters.',
            this.getGiftedPathLinkSentence('Path of the Gifted Fighter')
          ]
        },
        wis: {
          title: 'Science, The Gift of Wisdom',
          shortTitle: 'Science',
          flavor: 'You have an aptitude for insight. No matter what you study, you pursue it with rigor and find its purpose as another tool in your arsenal.',
          benefits: [
            'This gift greatly benefits alchemists, scholars, and improvisers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Researcher')
          ]
        },
        cha: {
          title: 'Charm, The Gift of Charisma',
          shortTitle: 'Charm',
          flavor: `You have an indomitable soul, granting courage and hope to those around you.
          Your heroism is unmatched in and out of battle.
          At the same time, people cannot help but be drawn to you, and believe every word that leaves your lips...even where doubt may be prudent.`,
          benefits: [
            'This gift greatly benefits leaders, diplomats, and bards.',
            this.getGiftedPathLinkSentence('Path of the Gifted Heart')
          ]
        },
        none: {
          title: 'Normality, the Lack of Gift',
          shortTitle: 'None',
          flavor: `You are not a special snowflake, and that’s exactly what makes you powerful.
          Nothing comes easy to you, but you put hard labor into everything you do.
          You weren’t born gifted, but you’re determined to prove that you don’t need to be gifted to be heroic.`,
          benefits: [
            'This choice is for generalists and hardcore players.',
            this.getGiftedPathLinkSentence('Path of the Unchosen One')
          ]
        }
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
    getGiftSelectedClass (gift) {
      if (this.create.gift === gift) {
        return 'selected'
      }
      return ''
    },
    giftButton (newGift) {
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
    },
    getGiftedPathLinkSentence (name) {
      const linkName = name.replace(' ', '_')
      return `Having this gift partially unlocks the <a href="https://vennt.fandom.com/wiki/${linkName}" target="_blank" class="link">${name}</a>.`
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

h1,
h3 {
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

.randomNameButtonContents {
  display: flex;
  align-items: center;
}

.matchText {
  fill: white;
}

.giftCardGroup {
  margin-top: 4px;
  margin-right: -4px;
  margin-left: -4px;
  display: flex;
  flex-wrap: wrap;
}

.giftCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border: 1px solid var(--gray-400);
  border-radius: 10px;
  margin: 4px;
  width: calc(33% - 8px);
}
.giftCard:hover {
  background-color: var(--gray-100);
  border: 1px solid var(--yellow-300);
}
.giftCard.selected {
  background-color: var(--gray-100);
  border: 1px solid var(--red-600);
}

.horizontalLine {
  height: 1px;
  width: 100%;
  background-color: var(--gray-400);
}

.textMargin {
  margin: 16px;
  text-align: left;
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
.main.bp1000 .giftCard {
  width: calc(49% - 8px);
}
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
.main.bp600 .giftCard {
    width: calc(100% - 8px);
  }
</style>
