<template>
  <div class="wide">
    <div v-if="showTitle">
      <h3 class="centeredText">{{ typeCopy[cogType].title }}</h3>
      <div class="seperator thin"></div>
    </div>
    <div class="textMargin">
      <p>{{ typeCopy[cogType].about }}</p>
      <ul v-if="typeCopy[cogType].details">
        <li v-for="detail in typeCopy[cogType].details" v-bind:key="detail">
          {{ detail }}
        </li>
      </ul>
      <p><b>Tactics:</b> {{ typeCopy[cogType].tactics }}</p>
      <ul v-if="typeCopy[cogType].tacticsExamples">
        <li
          v-for="example in typeCopy[cogType].tacticsExamples"
          v-bind:key="example"
        >
          {{ example }}
        </li>
      </ul>
      <p><b>PK0:</b> {{ typeCopy[cogType].pk0 }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CogTypeDescription",
  props: {
    cogType: String,
    showTitle: {
      type: Boolean,
      default: true,
    },
    lvl: {
      type: String,
      default: "",
    },
  },
  computed: {
    typeCopy() {
      return {
        arcanae: {
          title: "Arcanae",
          about: "This Cog is a magical being, creature, or creation.",
          tactics: "Set by GM or use the Tactics of another Type",
          pk0: "Set by GM or use the Tactics of another Type",
        },
        automata: {
          title: "Automata",
          about:
            "This Cog is a robotic construction, or otherwise technologically animated.",
          details: [
            "Their Charisma, Wisdom, and Spirit are set to -2 and cannot be increased",
            `Their Technology is ${this.lvlStr()}`,
            "They do not need to eat, breathe, or sleep",
          ],
          tactics:
            "Automatons spread out evenly, each targeting a different enemy where possible",
          pk0: "Automatons don’t interact with the PCs on PKO",
        },
        beastFlora: {
          title: "Beast / Flora",
          about: "This Cog is an animal or plant of bestial instinct.",
          details: [
            "Their Wisdom, Technology, and Intelligence are set to -2 and cannot be increased",
            `Their Strength, Dexterity, Perception, and Agility are ${this.lvlStr()}`,
          ],
          tactics: "Beasts swarm the closest enemy",
          pk0: "Beasts eat everything deemed edible that the PCs carry on them",
        },
        humanoid: {
          title: "Humanoid",
          about:
            "This Cog is a sentient creature, such as humans, elves, orcs, etc.",
          tactics:
            "Humanoids are unpredictable and use clever strategies, such as focusing the enemy healer or using hazards to their advantage",
          pk0: "Humanoids steal everything deemed valuable from the PCs",
        },
        monster: {
          title: "Monster",
          about:
            "This Cog is a chaotic and exotic beast, including most enemies found in the Tributaries.",
          details: [
            `Their Strength, Dexterity, Perception, and Agility are ${this.lvlStr()}`,
          ],
          tactics: "Monsters attack the closest enemy.",
          pk0: "Monsters eat all of the PCs food and destroy their Lux Wards.",
        },
        undead: {
          title: "Undead",
          about: "This Cog was raised from the dead by dark magicks or curses.",
          details: [
            "Their Charisma, Technology, Spirit, and Intelligence are set to -2 and cannot be increased",
            "They do not need to eat, breathe, or sleep",
          ],
          tactics:
            "Tactics: Undead choose a single strategy, set by the GM, and attempt to execute it. For example:",
          tacticsExamples: [
            "All attack the closest target",
            "All attack the farthest target",
            "All defend their ally healer",
            "All stay adjacent to each other and attack who they can",
          ],
          pk0: "Undead steal all silver pieces and valuable objects, then destroy all Lux Wards",
        },
      };
    },
  },
  methods: {
    lvlStr(def, fun) {
      if (!this.lvl) {
        if (!def) {
          return "L";
        }
        return def;
      }
      if (!fun) {
        return "L (" + this.lvl + ")";
      }
      return def + " (" + fun(parseInt(this.lvl)) + ")";
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
