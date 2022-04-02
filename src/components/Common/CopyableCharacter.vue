<template>
  <div>
    <div class="alignRow split">
      <h3>{{ characterType }} in basic string format</h3>
      <button
        v-on:click="copyCharacterButton()"
        class="btn basicBtn toolTipTrigger"
      >
        <div class="basicBtnContents">
          <span class="material-icons space">content_copy</span>
          Copy
        </div>
        <div class="toolTip">Copy text version of {{ characterType }}</div>
      </button>
    </div>
    <div class="card border padded column">
      <code v-html="characterText2HTML"></code>
    </div>
  </div>
</template>

<script>
import {
  convertCharacter,
  convertCombatCogFoe,
} from "./Util/CharacterStringFormatting";

export default {
  name: "CogCopyable",
  props: {
    character: Object,
  },
  computed: {
    isCombatCogFoe() {
      return this.character.template || this.character.cogType;
    },
    characterType() {
      return this.character.is_enemy || this.isCombatCogFoe
        ? "Enemy"
        : "Character";
    },
    character2Text() {
      let characterText = "";
      if (this.isCombatCogFoe) {
        characterText = convertCombatCogFoe(this.character);
      } else {
        characterText = convertCharacter(this.character);
      }
      return characterText;
    },
    characterText2HTML() {
      return this.character2Text.replaceAll("\n", "<br>");
    },
  },
  methods: {
    copyCharacterButton() {
      navigator.clipboard.writeText(this.character2Text);
    },
  },
};
</script>
