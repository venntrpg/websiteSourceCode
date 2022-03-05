<template>
  <div>
    <check-box
      v-for="(body, title) in options"
      v-bind:key="title"
      :checked="optionSelected(title)"
      :disabled="optionDisabled(title)"
      :text="title + ': ' + body"
      :highlight="true"
      :smallText="true"
      @toggled="emitNewSelectedList(title)"
    />
  </div>
</template>

<script>
import CheckBox from "../Common/CheckBox.vue";
// take in object with list of key value pairs - key is effect name, value is description
// take in mututally exclusive list - list of lists where if one item in a sub list is taken, the others may not be taken
// take in list of disabled effects
export default {
  components: { CheckBox },
  name: "CogToggleableEffects",
  props: {
    options: Object,
    selected: Array,
    mutuallyExclusive: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    optionSelected(title) {
      return this.selected.includes(title);
    },
    optionDisabled(title) {
      if (this.disabled.includes(title)) {
        return true;
      }
      // look through mutually exclusive lists and disable of another option of one of those lists was already selected
      return this.mutuallyExclusive
        .filter((list) => list.includes(title))
        .some((list) =>
          list.some((item) => item !== title && this.optionSelected(item))
        );
    },
    emitNewSelectedList(title) {
      if (this.optionSelected(title)) {
        // need to unselect it
        this.$emit(
          "newSelected",
          this.selected.filter((item) => item !== title)
        );
      } else {
        this.$emit("newSelected", [...this.selected, title]);
      }
    },
  },
};
</script>
