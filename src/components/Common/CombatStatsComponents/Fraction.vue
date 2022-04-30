<template>
  <div class="alignRow" v-bind:class="warningClass">
    <div class="number">{{ top }}</div>
    <div v-if="Number.isInteger(bottom)" class="alignRow">
      <div class="slash ml-2 mr-2">/</div>
      <div class="number">{{ bottom }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fraction",
  props: {
    top: Number,
    bottom: Number,
    noWarning: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    warningClass() {
      return (this.top > this.bottom || this.top < 0) && !this.noWarning
        ? "errorText"
        : "";
    },
  },
};
</script>

<style scoped>
.slash {
  font-size: 25pt;
  font-weight: 300;
}
</style>
