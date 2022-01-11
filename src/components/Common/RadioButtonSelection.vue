<template>
  <div>
    <button
      v-for="(option, optionCode) in options"
      v-bind:key="optionCode"
      v-on:click="selectionButton(optionCode)"
      class="btn noSelect basicBtn"
    >
      <div class="basicBtnContents skinny">
        <span v-if="isSelected(optionCode)" class="material-icons space">
          radio_button_checked
        </span>
        <span v-else class="material-icons space">radio_button_unchecked</span>
        <div v-html="option" class="textContents"></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: "RadioButtonSelection",
  props: {
    options: Object,
    selected: String,
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
  font-size: 12pt;
}

.textContents {
  text-align: left;
}
</style>
