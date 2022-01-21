<template>
  <div class="wide">
    <div v-if="showTitle">
      <h3 class="centeredText">{{ giftCopy[gift].title }}</h3>
      <div class="seperator thin"></div>
    </div>
    <div class="textMargin">
      <i>{{ giftCopy[gift].flavor }}</i>
      <ul>
        <li
          v-for="benefit in giftCopy[gift].benefits"
          v-bind:key="benefit"
          v-html="benefit"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "giftDescription",
  props: {
    gift: String,
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    giftCopy() {
      return {
        Alertness: {
          title: "Alertness, The Gift of Perception",
          flavor:
            "Your senses are razor sharp. If a tree falls and no one is around to hear it, you do.",
          benefits: [
            "This gift greatly benefits hunters, spies, and inquisitors.",
            this.getGiftedPathLinkSentence("Path of the Gifted Scout"),
          ],
        },
        Craft: {
          title: "Craft, The Gift of Technology",
          flavor:
            "You discover. You take apart and rebuild. You have a natural curiosity for how things work and a knack for making them do so.",
          benefits: [
            "This gift greatly benefits mechanics, craftsmen, and tinkers.",
            this.getGiftedPathLinkSentence("Path of the Gifted Craftsman"),
          ],
        },
        Alacrity: {
          title: "Alacrity, the Gift of Agility",
          flavor: `You can appear and disappear in the blink of an eye.
          Every surface, be they walls or even ceilings, is yours to traverse, as easily as others would walk across the street.
          You have almost as much maneuverability in midair as you do upon the ground, and you could barely lose a race even if you tried.`,
          benefits: [
            "This gift greatly benefits duelists, rogues, and gunslingers.",
            this.getGiftedPathLinkSentence("Path of the Gifted Ninja"),
          ],
        },
        Finesse: {
          title: "Finesse, The Gift of Dexterity",
          flavor: `Graceful as a cat, swift as the wind, you have mastered fine motor control.
          For good or evil, you can hide, dodge, maneuver, and strike with blade or bullet when your enemy least expects with startling precision.`,
          benefits: [
            "This gift greatly benefits duelists, rogues, and gunslingers.",
            this.getGiftedPathLinkSentence("Path of the Gifted Duelist"),
          ],
        },
        Mind: {
          title: "Mind, The Gift of Intelligence",
          flavor: `You are a lifelong learner. Some call you a scholar, others call you a know-it-all.
          Either way, you have a photographic memory for textbooks and a natural talent for learning new disciplines.`,
          benefits: [
            "This gift greatly benefits polymaths, tacticians, and dilettantes.",
            this.getGiftedPathLinkSentence("Path of the Gifted Loremaster"),
          ],
        },
        Magic: {
          title: "Magic, The Gift of Spirit",
          flavor: `You are one of the few who possess an intuitive knack for the arcane.
          In short, the spells you are able to cast and the strength with which you cast is immensely improved.`,
          benefits: [
            "This gift greatly benefits mages, priests, and arcane scholars.",
            this.getGiftedPathLinkSentence("Path of the Gifted Magician"),
          ],
        },
        Rage: {
          title: "Rage, The Gift of Strength",
          flavor:
            "Brutality is in your blood. The only skill you don’t possess is weakness. Everything else you have already taken by force.",
          benefits: [
            "This gift greatly benefits berserkers, bruisers, and fighters.",
            this.getGiftedPathLinkSentence("Path of the Gifted Fighter"),
          ],
        },
        Science: {
          title: "Science, The Gift of Wisdom",
          flavor:
            "You have an aptitude for insight. No matter what you study, you pursue it with rigor and find its purpose as another tool in your arsenal.",
          benefits: [
            "This gift greatly benefits alchemists, scholars, and improvisers.",
            this.getGiftedPathLinkSentence("Path of the Gifted Researcher"),
          ],
        },
        Charm: {
          title: "Charm, The Gift of Charisma",
          flavor: `You have an indomitable soul, granting courage and hope to those around you.
          Your heroism is unmatched in and out of battle.
          At the same time, people cannot help but be drawn to you, and believe every word that leaves your lips...even where doubt may be prudent.`,
          benefits: [
            "This gift greatly benefits leaders, diplomats, and bards.",
            this.getGiftedPathLinkSentence("Path of the Gifted Heart"),
          ],
        },
        None: {
          title: "Normality, the Lack of a Gift",
          flavor: `You are not a special snowflake, and that’s exactly what makes you powerful.
          Nothing comes easy to you, but you put hard labor into everything you do.
          You weren’t born gifted, but you’re determined to prove that you don’t need to be gifted to be heroic.`,
          benefits: [
            "This choice is for generalists and hardcore players.",
            this.getGiftedPathLinkSentence("Path of the Unchosen One"),
          ],
        },
      };
    },
  },
  methods: {
    getGiftedPathLinkSentence(name) {
      const linkName = name.replaceAll(" ", "_");
      return `Having this gift partially unlocks the <a href="https://vennt.fandom.com/wiki/${linkName}" target="_blank" class="link">${name}</a>.`;
    },
  },
};
</script>

<style scoped>
.wide {
  width: 100%;
}
.textMargin {
  margin: 16px;
  text-align: left;
  user-select: text; /* Allows users to highlight text for easier reading */
}
</style>
