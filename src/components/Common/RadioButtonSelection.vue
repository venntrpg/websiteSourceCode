<template>
  <div>
    <button
      v-for="(option, optionCode) in options"
      v-bind:key="optionCode"
      v-on:click="selectionButton(optionCode)"
      class="btn noSelect basicBtn"
    >
      <div class="basicBtnContents">
        <CheckedRadioButton v-if="isSelected(optionCode)" class="basicBtnSVG" />
        <UncheckedRadioButton v-else class="basicBtnSVG" />
        <div v-html="option" class="textContents"></div>
      </div>
    </button>
  </div>
</template>

<script>
import CheckedRadioButton from "./SVGs/CheckedRadioButtonSVG.vue";
import UncheckedRadioButton from "./SVGs/UncheckedRadioButtonSVG.vue";

export default {
  name: "RadioButtonSelection",
  props: {
    options: Object,
    selected: String,
  },
  components: {
    CheckedRadioButton,
    UncheckedRadioButton,
  },
  methods: {
    isSelected(option) {
      return option === this.selected;
    },
    selectionButton(option) {
      if (!this.isSelected(option)) {
        this.$emit("selectedUpdated", option);
      }
    },
  },
};
</script>

<style scoped>
.basicBtn {
  width: 100%;
}

.basicBtnContents {
  margin-left: 8px;
  margin: 4px;
  font-size: 12pt;
}

.textContents {
  margin-left: 8px;
  text-align: left;
}
</style>
