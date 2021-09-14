<template>
  <div class="container">
    <button
    v-for="attr in attributes"
    v-bind:key="attr"
    v-on:click="selectionButton(attr)"
    :disabled="buttonDisabled(attr)"
    class="btn noSelect basicBtn">
      <div class="basicBtnContents">
        <CheckedRadioButton v-if="isSelected(attr)" class="basicBtnSVG" />
        <UncheckedRadioButton v-else class="basicBtnSVG" />
        <div v-html="attr.toUpperCase()" class="basicBtnContents"></div>
      </div>
    </button>
  </div>
</template>

<script>

import CheckedRadioButton from '../Common/SVGs/CheckedRadioButtonSVG.vue'
import UncheckedRadioButton from '../Common/SVGs/UncheckedRadioButtonSVG.vue'

export default {
  name: 'AttributeSelection',
  props: {
    attributes: Array,
    selected: Array,
    maxChoices: Number,
    disabledChoices: Array
  },
  components: {
    CheckedRadioButton,
    UncheckedRadioButton
  },
  methods: {
    isSelected (attr) {
      return this.selected.includes(attr)
    },
    buttonDisabled (attr) {
      const disabled = this.selected.length >= this.maxChoices && !this.isSelected(attr)
      if (this.disabledChoices && this.disabledChoices.length > 0) {
        return this.disabledChoices.includes(attr) || disabled
      }
      return disabled
    },
    selectionButton (attr) {
      if (this.selected.length > this.maxChoices) {
        return
      }
      let list = this.selected
      if (this.isSelected(attr)) {
        list = list.filter(sel => sel !== attr)
      } else {
        list.push(attr)
      }
      this.$emit('selectedUpdated', list)
    }
  }
}
</script>

<style scoped>

.container {
  display: grid;
  grid-template-columns: repeat(3, 33% [col-start]);
}

.basicBtnContents {
  margin-left: 8px;
  margin: 4px;
}
</style>
