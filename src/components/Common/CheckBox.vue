<template>
  <button v-on:click="toggle()" class="btn basicBtn wide noSelect">
    <div class="basicBtnContents">
      <span
        v-if="checked"
        class="material-icons space"
        v-bind:class="selectedClass"
      >
        check_box
      </span>
      <span v-else class="material-icons space">check_box_outline_blank</span>
      {{ text }}
    </div>
  </button>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    text: String,
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedClass() {
      return this.highlight ? "selected" : "";
    },
  },
  methods: {
    toggle() {
      this.$emit("toggled");
    },
  },
};
</script>
