<template>
  <div>
    <button
      v-if="combineDice"
      type="button"
      v-on:click="copyDiscord"
      v-bind:title="discordCommand"
      class="btn basicBtn wide"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">content_copy</span>
        Roll command
      </div>
    </button>
    <div v-else class="alignRow gap">
      <button
        type="button"
        v-on:click="copyDiscord"
        v-bind:title="discordCommand"
        class="btn basicBtn wide"
      >
        <div class="basicBtnContents">
          <span class="material-icons space">content_copy</span>
          Discord
        </div>
      </button>
      <button
        type="button"
        v-on:click="copyRoll20"
        v-bind:title="roll20Command"
        class="btn basicBtn wide"
      >
        <div class="basicBtnContents">
          <span class="material-icons space">content_copy</span>
          Roll20
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { defaultDice } from "../../../utils/diceUtils";
export default {
  name: "DiceCopy",
  props: {
    character: Object,
    attr: String,
    settings: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dice() {
      return defaultDice(this.character, this.attr, this.settings);
    },
    combineDice() {
      return this.dice.discord === this.dice.roll20;
    },
    discordCommand() {
      return "/roll " + this.dice.discord;
    },
    roll20Command() {
      return "/roll " + this.dice.roll20;
    },
  },
  methods: {
    copyDiscord() {
      navigator.clipboard.writeText(this.discordCommand);
    },
    copyRoll20() {
      navigator.clipboard.writeText(this.roll20Command);
    },
  },
};
</script>
