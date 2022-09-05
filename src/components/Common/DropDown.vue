<template>
  <button
    v-if="useDiceToggle ? !diceDropDown : closed"
    v-on:click="toggleDropDown"
    class="btn basicBtn wide"
  >
    <div class="basicBtnContents">
      <span class="material-icons">keyboard_arrow_down</span>
      Show {{ title }}
    </div>
  </button>
  <div v-else class="card column">
    <button v-on:click="toggleDropDown" class="btn basicBtn wide">
      <div class="basicBtnContents">
        <span class="material-icons">keyboard_arrow_up</span>
        Hide {{ title }}
      </div>
    </button>
    <div class="seperator thin"></div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DropDown",
  props: {
    title: { type: String, default: "" },
    useDiceToggle: { type: Boolean, default: false },
  },
  data() {
    return { closed: true };
  },
  computed: {
    ...mapState("dice", ["diceDropDown"]),
  },
  methods: {
    toggleDropDown() {
      if (this.useDiceToggle) {
        this.$store.commit("dice/toggleDiceDropDown");
      } else {
        this.closed = !this.closed;
      }
    },
  },
};
</script>
