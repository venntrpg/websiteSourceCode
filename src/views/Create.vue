<template>
  <div>
    <div class="subNav">
      <button v-on:click="createNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect createNavButton">CREATE CHARACTER</button>
      <button v-on:click="statsNavButton()" v-bind:class="getMobileSidebarClass" class="btn navButton subNavButton noSelect statsNavButton">SHOW STATS</button>
    </div>
    <div class="sideBar" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]">
      This is a sidebar, hopefully :o
    </div>
    <div class="page sideBarPage" v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]">
      <div class="largePageWidth">
        <h1>CHARACTER CREATION</h1>
        <div v-if="isNewCharacter">
          <h2>Step 1: Choose a name</h2>
          <div>
            This follows the guide on the <a href="https://vennt.fandom.com/wiki/Character_Creation" target="_blank" class="link">character creation wiki page</a>.
          </div>
          <div>
            Choose a name for your character. You can always come back to this step later. Or, press the button to generate a random name for now.
          </div>
          <div class="alignRow nameRow">
            <input type="text" name="charName" placeholder="Bilbo Baggins" class="input nameInput" v-model="character.name">
            <button v-on:click="randomNameButton()" class="btn roundedButton randomNameButton" :disabled="randomNamesDisabled">
              <div class="randomNameButtonContents">
                <RefreshSVG class="matchText" /> Random name
              </div>
            </button>
          </div>
          <h2>Step 2: Choose a Gift</h2>
          <div>
            <i>Most legends are born gifted in some way. Mozart was gifted in music, Achilles was gifted in combat, and Merlin was gifted in magic.
              There are nine gifts available to choose from as a hero of Amnis, each one providing unique boons to your character.</i>
          </div>
          <div class="giftCardGroup">
            <button v-on:click="giftButton('per')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('per')">
              <h3>
                Alertness, The Gift of Perception
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                Your senses are razor sharp. If a tree falls and no one is around to hear it, you do. This gift greatly benefits hunters, spies, and inquisitors.
                Having this gift partially unlocks the <a href="https://vennt.fandom.com/wiki/Path_of_the_Gifted_Scout" target="_blank" class="link">Path of the Gifted Scout</a>.
              </div>
            </button>
            <button v-on:click="giftButton('tek')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('tek')">
              <h3>
                Craft, The Gift of Technology
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You discover. You take apart and rebuild. You have a natural curiosity for how things work and a knack for making them do so.
                This gift greatly benefits mechanics, craftsmen, and tinkers.
                Having this gift partially unlocks the Path of the Gifted Craftsman.
              </div>
            </button>
            <button v-on:click="giftButton('agi')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('agi')">
              <h3>
                Alacrity, the Gift of Agility
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You can appear and disappear in the blink of an eye.
                Every surface, be they walls or even ceilings, is yours to traverse, as easily as others would walk across the street.
                You have almost as much maneuverability in midair as you do upon the ground, and you could barely lose a race even if you tried.
                This gift greatly benefits duelists, rogues, and gunslingers.
                Having this gift partially unlocks the Path of the Gifted Ninja.
              </div>
            </button>
            <button v-on:click="giftButton('dex')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('dex')">
              <h3>
                Finesse, The Gift of Dexterity
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                Graceful as a cat, swift as the wind, you have mastered fine motor control.
                For good or evil, you can hide, dodge, maneuver, and strike with blade or bullet when your enemy least expects with startling precision.
                This gift greatly benefits duelists, rogues, and gunslingers.
                Having this gift partially unlocks the Path of the Gifted Duelist.
              </div>
            </button>
            <button v-on:click="giftButton('int')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('int')">
              <h3>
                Mind, The Gift of Intelligence
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You are a lifelong learner. Some call you a scholar, others call you a know-it-all.
                Either way, you have a photographic memory for textbooks and a natural talent for learning new disciplines.
                This gift greatly benefits polymaths, tacticians, and dilettantes.
                Having this gift partially unlocks the Path of the Gifted Loremaster.
              </div>
            </button>
            <button v-on:click="giftButton('spi')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('spi')">
              <h3>
                Magic, The Gift of Spirit
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You are one of the few who possess an intuitive knack for the arcane.
                In short, the spells you are able to cast and the strength with which you cast is immensely improved.
                This gift greatly benefits mages, priests, and arcane scholars.
                Having this gift partially unlocks the Path of the Gifted Magician.
              </div>
            </button>
            <button v-on:click="giftButton('str')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('str')">
              <h3>
                Rage, The Gift of Strength
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                Brutality is in your blood. The only skill you don't possess is weakness.
                Everything else you have already taken by force. This gift greatly benefits berserkers, bruisers, and fighters.
                Having this gift partially unlocks the Path of the Gifted Fighter.
              </div>
            </button>
            <button v-on:click="giftButton('wis')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('wis')">
              <h3>
                Science, The Gift of Wisdom
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You have an aptitude for insight.
                No matter what you study, you pursue it with rigor and find its purpose as another tool in your arsenal.
                This gift greatly benefits alchemists, scholars, and improvisers.
                Having this gift partially unlocks the Path of the Gifted Researcher.
              </div>
            </button>
            <button v-on:click="giftButton('cha')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('cha')">
              <h3>
                Charm, The Gift of Charisma
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You have an indomitable soul, granting courage and hope to those around you.
                Your heroism is unmatched in and out of battle.
                At the same time, people cannot help but be drawn to you, and believe every word that leaves your lips... even where doubt may be prudent.
                This gift greatly benefits leaders, diplomats, and bards.
                Having this gift partially unlocks the Path of the Gifted Heart.
              </div>
            </button>
            <button v-on:click="giftButton('')" class="btn noSelect giftCard" v-bind:class="getGiftSelectedClass('')">
              <h3>
                Normality, the Lack of Gift
              </h3>
              <div class="horizontalLine"></div>
              <div class="textMargin">
                You are not a special snowflake, and that’s exactly what makes you powerful.
                Nothing comes easy to you, but you put hard labor into everything you do.
                You weren’t born gifted, but you’re determined to prove that you don’t need to be gifted to be heroic.
                This choice is for generalists and hardcore players.
                Having this gift unlocks the Path of the Unchosen One.
              </div>
            </button>
          </div>
          <h2>Step 3: Create your backstory</h2>
          Do this somewhere else for now. Also make Tides, Grates, and Quests
          <h2>Step 4: Attribute scores</h2>
          <h2>Step 5: Beginner's equipment</h2>
          <h2>Step 6: Abilities and XP</h2>
        </div>
        <div v-else-if="isImportCharacter">
          Import character creation flow
        </div>
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
import { mapState } from 'vuex'

// Constants
const NEW_CREATION_FLOW = 'new'
const IMPORT_CREATION_FLOW = 'import'

export default {
  name: 'CharacterCreation',
  components: {
    RefreshSVG
  },
  data () {
    return {
      showingStats: false,
      creationFlow: '',
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
      if (this.character.name === '') {
        return 'hidden'
      }
      return ''
    },
    getMobileSidebarClass () {
      if (this.showingStats) {
        return 'showStats'
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
        this.character.name = this.randomNames[0]
        this.$store.commit('shiftRandomNames')
      }
    },
    getGiftSelectedClass (gift) {
      if (this.character.gift === gift) {
        return 'selected'
      }
      return ''
    },
    giftButton (newGift) {
      // 1. decrement old gift allocation
      if (this.isValidAttribute(this.character.gift)) {
        this.character[this.character.gift] = this.character[this.character.gift] - 2
      }
      // 2. increment new gift allocation
      if (this.isValidAttribute(newGift)) {
        this.character[newGift] = this.character[newGift] + 2
      }
      // 3. set the gift
      this.character.gift = newGift
    },
    isValidAttribute (attr) {
      const attributes = ['agi', 'cha', 'dex', 'int', 'per', 'spi', 'str', 'tek', 'wis']
      return attributes.includes(attr)
    }
  }
}
</script>

<style scoped>

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
}

.giftCard {
  background-color: white;
  border-radius: 10px;
  border: 1px solid var(--gray-400);
  width: calc(33% - 8px);
  margin: 4px;
  display: inline-block;
}
.giftCard:hover {
  border: 1px solid var(--gray-500);
}
.giftCard.selected {
  border: solid 1px var(--yellow-600);
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

/* Styles for showing the subnav */
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

@media screen and (max-width: 1000px) {
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
    display: flex;
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
@media screen and (max-width: 600px) {
  .nameRow {
    display: block;
  }
  .nameInput {
    margin-right: 0px;
    max-width: 100%;
  }
  .randomNameButton {
    margin-top: 8px;
    width: 100%;
  }
}

</style>
