<template>
  <button
    v-on:click="heroButton"
    :disabled="disabled"
    title="Use a hero point"
    class="btn basicBtn"
  >
    <div class="basicBtnContents">
      <span class="material-icons selected">auto_awesome</span>
    </div>
  </button>
</template>

<script>
import { mapState } from "vuex";
import {
  adjustAttrsAPI,
  generateDefaultAdjustMsg,
} from "../../utils/attributeUtils";
export default {
  name: "HeroPointButton",
  props: { reason: { type: String, default: "" } },
  computed: {
    ...mapState("character", ["character"]),
    disabled() {
      return this.character.hero <= 0;
    },
  },
  methods: {
    heroButton() {
      const msg = this.reason
        ? this.reason
        : generateDefaultAdjustMsg("hero", -1);
      adjustAttrsAPI(this.character, { hero: -1 }, true, msg);
    },
  },
};
</script>
