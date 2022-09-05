<template>
  <div class="alignRow gap mb-16 timeButtons">
    <button class="btn roundedButton wide">End turn</button>
    <button class="btn roundedButton clear wide hideExtra">
      End Combat /&nbsp;Scene
    </button>
    <button class="btn roundedButton purple wide">Rest</button>
  </div>
</template>

<script>
export default {
  name: "CombatTimeButtons",
};
</script>

<style scoped>
.bp600 .timeButtons {
  flex-direction: column;
}
</style>
