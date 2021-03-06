<template>
  <div>
    <div class="sideBar">
      This is a sidebar, hopefully :o
    </div>
    <div class="page sideBarPage">
      <div class="largePageWidth">
        <h1>CHARACTER CREATION</h1>
        <div v-if="isNewCharacter">
          <h2>Step 1: Choose a name</h2>
          <div>
            Enter a name for your character. You can always come back to this step later. Or, press the button to generate a random name.
          </div>
          <div class="alignRow">
            <input type="text" name="charName" placeholder="Bilbo Baggins" class="input nameInput" v-model="character.name">
            <button v-on:click="randomNameButton" class="btn roundedButton">
              <div class="randomNameButtonContents">
                <RefreshSVG class="matchText" /> Random name
              </div>
            </button>
          </div>
          <h2>Step 2: Choose a Gift</h2>
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
      creationFlow: '',
      character: {
        name: '',
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
    ...mapState(['isLoggedIn', 'randomNames']),
    isNewCharacter () {
      return this.creationFlow === NEW_CREATION_FLOW
    },
    isImportCharacter () {
      return this.creationFlow === IMPORT_CREATION_FLOW
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
    randomNameButton () {
      console.log(this.randomNames.length)
      if (this.randomNames.length < 3) {
        // need to get more random names
        this.$store.dispatch('getRandomNames')
      }
      if (this.randomNames.length > 0) {
        // pop item off front of array
        this.character.name = this.randomNames[0]
        this.$store.commit('shiftRandomNames')
      }
    }
  }
}
</script>

<style scoped>

.sideBar {
  position: fixed;
  z-index: 1;
  top: 42px;
  left: 0;
  overflow-x: hidden;
  width: 400px;
  height: calc(100vh - 42px); /* 42px is the height of the nav bar */
  -webkit-box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 28%);
}

.sideBarPage {
  margin-left: 400px;
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

.card {
  position: relative;
  background-color: white;
  border-radius: 10px;
  border: 1px solid var(--gray-400);
  padding: 10px;
}

</style>
