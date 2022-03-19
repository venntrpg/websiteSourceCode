<template>
  <div>
    <div v-for="(body, title) in options" v-bind:key="title">
      <h3 v-if="body.section && !hideOption(title)">{{ body.section }}</h3>
      <check-box
        v-if="!hideOption(title)"
        :checked="optionSelected(title)"
        :disabled="optionDisabled(title)"
        :text="'<b>' + title + '</b>: ' + body.text"
        :highlight="true"
        :smallText="true"
        @toggled="emitNewSelectedList(title)"
      />
    </div>
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
    progressiveOptions: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Array,
      default: () => [],
    },
    maxSelections: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    optionSelected(title) {
      return this.selected.includes(title);
    },
    hideOption(title) {
      return (
        this.maxSelections >= 0 &&
        this.selected.length >= this.maxSelections &&
        !this.optionSelected(title)
      );
    },
    optionDisabled(title) {
      if (this.disabled.includes(title)) {
        return true;
      }
      // see if it is disabled because we have reached the maximum selections
      if (
        this.maxSelections >= 0 &&
        this.selected.length >= this.maxSelections &&
        !this.optionSelected(title)
      ) {
        return true;
      }
      // look through mutually exclusive lists and disable of another option of one of those lists was already selected
      if (this.hideOption(title)) {
        return true;
      }
      // look through progressive options and disable if a lower option on the scale is not selected
      if (
        this.progressiveOptions
          .filter((list) => list.includes(title))
          .some((list) => {
            const index = list.indexOf(title);
            if (index <= 0) {
              return false;
            }
            // check option 1 earlier
            return !this.optionSelected(list[index - 1]);
          })
      ) {
        return true;
      }
      return false;
    },
    emitNewSelectedList(title) {
      let newList = [];
      if (this.optionSelected(title)) {
        const itemsToUnselect = [title];
        const progressiveLists = this.progressiveOptions.filter((list) =>
          list.includes(title)
        );
        // Handle case where an item of a progressive list is unselected
        progressiveLists.forEach((list) => {
          const index = list.indexOf(title);
          // need to unselect all items after this index
          const toAdd = list.slice(index);
          itemsToUnselect.push(...toAdd);
        });
        // need to unselect it
        newList = this.selected.filter(
          (item) => !itemsToUnselect.includes(item)
        );
      } else {
        newList = [...this.selected, title];
      }
      this.$emit("newSelected", newList);
    },
  },
};
</script>
