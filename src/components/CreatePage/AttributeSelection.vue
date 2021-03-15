<template>
  <div class="container">
    <button
    v-for="attr in attributes"
    v-bind:key="attr"
    v-on:click="selectionButton(attr)"
    :disabled="buttonDisabled(attr)"
    class="btn noSelect attributeBtn">
      <div class="btnContents">
        <CheckedRadioButton v-if="isSelected(attr)" />
        <UncheckedRadioButton v-else />
        <div v-html="attr.toUpperCase()" class="attributeBtnContents"></div>
      </div>
    </button>
  </div>
</template>

<script>

import CheckedRadioButton from '../Common/CheckedRadioButton.vue'
import UncheckedRadioButton from '../Common/UncheckedRadioButton.vue'

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

.attributeBtn {
  background-color: transparent;
  border-radius: 10px;
}
.attributeBtn:disabled {
  fill: var(--gray-500);
  color: var(--gray-500);
}
.attributeBtn:hover:not(:disabled) {
  background-color: var(--gray-300);
}
.attributeBtn:active:not(:disabled) {
  background-color: var(--gray-400);
}
.attributeBtnContents {
  margin: 8px;
  font-size: 14pt;
}
.attributeBtnSVG {
  width: 30px;
  height: 30px;
}

.btnContents {
  margin-left: 8px;
  display: flex;
  align-items: center;
}
</style>
