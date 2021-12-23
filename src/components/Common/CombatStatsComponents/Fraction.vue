<template>
  <div>
    <div class="number">{{ top }}</div>
    <div v-if="Number.isInteger(bottom)" class="flex">
      <div class="slash">/</div>
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
  },
};
</script>

<style>
.slash {
  font-size: 25pt;
  font-weight: 300;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
