<template>
  <button
    type="button"
    v-on:click="copyCommand"
    v-bind:title="command"
    class="btn basicBtn wide"
  >
    <div class="basicBtnContents">
      <span class="material-icons space">content_copy</span>
      {{ text }}
    </div>
  </button>
</template>

<script>
export default {
  name: "DiceCopyButton",
  props: { dice: String, text: { type: String, default: "Roll command" } },
  computed: {
    command() {
      return `/roll ${this.dice}`;
    },
  },
  methods: {
    copyCommand() {
      navigator.clipboard.writeText(this.command);
    },
  },
};
</script>
