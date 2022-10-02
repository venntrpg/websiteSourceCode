<template>
  <div class="container">
    <button
      v-for="attr in attributes"
      v-bind:key="attr"
      v-on:click="selectionButton(attr)"
      :disabled="buttonDisabled(attr)"
      class="btn noSelect basicBtn"
    >
      <div class="basicBtnContents skinny">
        <span v-if="isSelected(attr)" class="material-icons space">
          radio_button_checked
        </span>
        <span v-else class="material-icons space">radio_button_unchecked</span>
        <span
          >{{ attr.toUpperCase() }}
          <span v-if="character && attr in character"
            >(<span class="number">{{ character[attr] }}</span
            >)</span
          ></span
        >
      </div>
    </button>
  </div>
</template>

<script>
import { ATTRIBUTES } from "../../utils/constants";
export default {
  name: "AttributeSelection",
  props: {
    attributes: { type: Array, default: () => ATTRIBUTES },
    selected: { type: Array, required: true },
    maxChoices: { type: Number, required: true },
    disabledChoices: { type: Array, default: () => [] },
    character: { type: Object, required: false },
  },
  methods: {
    isSelected(attr) {
      return this.selected.includes(attr);
    },
    buttonDisabled(attr) {
      const disabled =
        this.selected.length >= this.maxChoices && !this.isSelected(attr);
      if (this.disabledChoices.length > 0) {
        return this.disabledChoices.includes(attr) || disabled;
      }
      return disabled;
    },
    selectionButton(attr) {
      if (this.selected.length > this.maxChoices) {
        return;
      }
      let list = this.selected;
      if (this.isSelected(attr)) {
        list = list.filter((sel) => sel !== attr);
      } else {
        list.push(attr);
      }
      this.$emit("selectedUpdated", list);
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
}
</style>
