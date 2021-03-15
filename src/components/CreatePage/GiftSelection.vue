<template>
  <div>
    <div v-if="showGiftList">
      <button v-on:click="toggleDropDown()" :disabled="dropDownDisabled" class="btn dropDownBtn noSelect">
        <div class="btnContents dropDownBtnContents">
          Hide Unselected Gifts<UpArrowSVG class="dropDownBtnSVG" />
        </div>
      </button>
      <div class="giftCardGroup">
        <button
          v-for="(giftMap, giftCode) in giftCopy"
          v-bind:key="giftCode"
          v-on:click="giftButton(giftCode)"
          class="btn noSelect card giftCard"
          v-bind:class="getGiftSelectedClass(giftCode)">
          <h3 v-html="giftMap.title"></h3>
          <div class="horizontalLine"></div>
          <div class="textMargin">
            <i v-html="giftMap.flavor"></i>
            <ul>
              <li v-for="benefit in giftMap.benefits" v-bind:key="benefit" v-html="benefit"></li>
            </ul>
          </div>
        </button>
      </div>
    </div>
    <div v-else>
      <button v-on:click="toggleDropDown()" class="btn dropDownBtn noSelect">
        <div class="btnContents dropDownBtnContents">
          Show All Gifts <DownArrowSVG class="dropDownBtnSVG" />
        </div>
      </button>
      <div class="card singleCard">
        <h3 v-html="giftCopy[gift].title"></h3>
        <div class="horizontalLine"></div>
        <div class="textMargin">
          <i v-html="giftCopy[gift].flavor"></i>
          <ul>
            <li v-for="benefit in giftCopy[gift].benefits" v-bind:key="benefit" v-html="benefit"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import UpArrowSVG from '../Common/UpArrowSVG.vue'
import DownArrowSVG from '../Common/DownArrowSVG.vue'

export default {
  name: 'GiftSelection',
  props: {
    gift: String
  },
  components: {
    UpArrowSVG,
    DownArrowSVG
  },
  data () {
    return {
      showFullList: false
    }
  },
  computed: {
    dropDownDisabled () {
      return this.giftCopy[this.gift] === undefined
    },
    showGiftList () {
      return this.showFullList || this.dropDownDisabled
    },
    giftCopy () {
      return {
        per: {
          title: 'Alertness, The Gift of Perception',
          flavor: 'Your senses are razor sharp. If a tree falls and no one is around to hear it, you do.',
          benefits: [
            'This gift greatly benefits hunters, spies, and inquisitors.',
            this.getGiftedPathLinkSentence('Path of the Gifted Scout')
          ]
        },
        tek: {
          title: 'Craft, The Gift of Technology',
          flavor: 'You discover. You take apart and rebuild. You have a natural curiosity for how things work and a knack for making them do so.',
          benefits: [
            'This gift greatly benefits mechanics, craftsmen, and tinkers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Craftsman')
          ]
        },
        agi: {
          title: 'Alacrity, the Gift of Agility',
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
          flavor: `Graceful as a cat, swift as the wind, you have mastered fine motor control.
          For good or evil, you can hide, dodge, maneuver, and strike with blade or bullet when your enemy least expects with startling precision.`,
          benefits: [
            'This gift greatly benefits duelists, rogues, and gunslingers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Duelist')
          ]
        },
        int: {
          title: 'Mind, The Gift of Intelligence',
          flavor: `You are a lifelong learner. Some call you a scholar, others call you a know-it-all.
          Either way, you have a photographic memory for textbooks and a natural talent for learning new disciplines.`,
          benefits: [
            'This gift greatly benefits polymaths, tacticians, and dilettantes.',
            this.getGiftedPathLinkSentence('Path of the Gifted Loremaster')
          ]
        },
        spi: {
          title: 'Magic, The Gift of Spirit',
          flavor: `You are one of the few who possess an intuitive knack for the arcane.
          In short, the spells you are able to cast and the strength with which you cast is immensely improved.`,
          benefits: [
            'This gift greatly benefits mages, priests, and arcane scholars.',
            this.getGiftedPathLinkSentence('Path of the Gifted Magician')
          ]
        },
        str: {
          title: 'Rage, The Gift of Strength',
          flavor: 'Brutality is in your blood. The only skill you don\'t possess is weakness. Everything else you have already taken by force.',
          benefits: [
            'This gift greatly benefits berserkers, bruisers, and fighters.',
            this.getGiftedPathLinkSentence('Path of the Gifted Fighter')
          ]
        },
        wis: {
          title: 'Science, The Gift of Wisdom',
          flavor: 'You have an aptitude for insight. No matter what you study, you pursue it with rigor and find its purpose as another tool in your arsenal.',
          benefits: [
            'This gift greatly benefits alchemists, scholars, and improvisers.',
            this.getGiftedPathLinkSentence('Path of the Gifted Researcher')
          ]
        },
        cha: {
          title: 'Charm, The Gift of Charisma',
          flavor: `You have an indomitable soul, granting courage and hope to those around you.
          Your heroism is unmatched in and out of battle.
          At the same time, people cannot help but be drawn to you, and believe every word that leaves your lips...even where doubt may be prudent.`,
          benefits: [
            'This gift greatly benefits leaders, diplomats, and bards.',
            this.getGiftedPathLinkSentence('Path of the Gifted Heart')
          ]
        },
        none: {
          title: 'Normality, the Lack of a Gift',
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
    getGiftSelectedClass (gift) {
      if (this.gift === gift) {
        return 'selected'
      }
      return ''
    },
    getGiftedPathLinkSentence (name) {
      const linkName = name.replace(' ', '_')
      return `Having this gift partially unlocks the <a href="https://vennt.fandom.com/wiki/${linkName}" target="_blank" class="link">${name}</a>.`
    },
    giftButton (gift) {
      this.$emit('giftUpdated', gift)
    },
    toggleDropDown () {
      this.showFullList = !this.showFullList
    }
  }
}
</script>

<style scoped lang="postcss">

h3 {
  text-align: center;
}

.btnContents {
  display: flex;
  align-items: center;
}

.dropDownBtn {
  width: 100%;
  margin-top: 4px;
  justify-content: flex-end;
  background-color: transparent;
  border-radius: 10px;
}
.dropDownBtn:disabled {
  fill: var(--gray-500);
  color: var(--gray-500);
}
.dropDownBtn:hover:not(:disabled) {
  background-color: var(--gray-300);
}
.dropDownBtn:active:not(:disabled) {
  background-color: var(--gray-400);
}
.dropDownBtnContents {
  margin: 8px;
  font-size: 14pt;
}
.dropDownBtnSVG {
  width: 30px;
  height: 30px;
}

.giftCardGroup {
  margin-right: -4px;
  margin-left: -4px;
  margin-top: 2px;
  display: grid;
  grid-template-columns: repeat(3, 33% [col-start]);
}

.giftCard {
  flex-direction: column;
  align-items: center;
  margin: 4px;
  flex-grow: 1;
}
.giftCard:hover {
  background-color: var(--gray-100);
  border: 1px solid var(--yellow-300);
}
.giftCard.selected {
  background-color: var(--gray-100);
  border: 1px solid var(--red-600);
}

.singleCard {
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
}

.horizontalLine {
  height: 1px;
  width: 100%;
  background-color: var(--gray-400);
}

.textMargin {
  margin: 16px;
  text-align: left;
  user-select: text; /* Allows users to highlight text for easier reading */
}

/* mobile styles */
.main.bp900 .giftCardGroup {
  grid-template-columns: repeat(2, 50% [col-start]);
}
.main.bp600 .giftCardGroup {
  grid-template-columns: repeat(1, 100% [col-start]);
}
</style>
