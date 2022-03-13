<template>
  <button
    v-on:click="toggle()"
    v-bind:disabled="disabled"
    class="btn basicBtn wide noSelect"
  >
    <div class="basicBtnContents">
      <span
        v-if="checked"
        class="material-icons space"
        v-bind:class="selectedClass"
      >
        check_box
      </span>
      <span v-else class="material-icons space">check_box_outline_blank</span>
      <span v-bind:class="textClass" v-html="text"></span>
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
    disabled: {
      type: Boolean,
      default: false,
    },
    smallText: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedClass() {
      return this.highlight ? "selected" : "";
    },
    textClass() {
      return this.smallText ? "pt-12" : "";
    },
  },
  methods: {
    toggle() {
      this.$emit("toggled");
    },
  },
};
</script>
