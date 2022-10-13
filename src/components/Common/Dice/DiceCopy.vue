<template>
  <div class="wide">
    <dice-copy-button v-if="combineDice" :dice="dice.discord" />
    <div v-else class="alignRow gap">
      <dice-copy-button :dice="dice.discord" text="Discord" />
      <dice-copy-button :dice="dice.roll20" text="Roll20" />
    </div>
  </div>
</template>

<script>
import DiceCopyButton from "./DiceCopyButton.vue";

export default {
  components: { DiceCopyButton },
  name: "DiceCopy",
  props: { dice: { type: Object, required: true } },
  computed: {
    combineDice() {
      return this.dice.discord === this.dice.roll20;
    },
  },
};
</script>
