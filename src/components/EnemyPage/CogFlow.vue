<template>
  <div class="page">
    <div class="largePageWidth">
      <h1 class="centeredText">CREATE COG</h1>
      <h2>Step 1: Enemy Type</h2>
      <div class="alignRow gap">
        <label for="enemyType" class="nowrap">Enemy type:</label>
        <input
          type="text"
          v-model="cogName"
          placeholder="Wind Elemental"
          id="enemyType"
          class="input shortenned"
        />
      </div>
      <h2>Step 2: Choose Template</h2>
      <h2>Step 3: Choose Level</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "CogFlow",
  data() {
    return {
      cogName: "",
    };
  },
};
</script>

<style scoped>
.input.shortenned {
  max-width: 400px;
}
</style>
