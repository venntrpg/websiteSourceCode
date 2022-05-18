<template>
  <div>
    <div class="alignRow">
      <bullet :character="character" />
      <h2>Abilities</h2>
    </div>
    <div
      v-for="(ability, index) in character.abilities"
      v-bind:key="index"
      class="card column mb-8"
    >
      <!-- TODO: Should probably sort ability list like we do on the character ability list -->
      <display-basic-ability-details :ability="ability" />
      <!-- TODO: Implement this functionality. We can't use a regular #id in an anchor tag because it just results
             in changing what page we are looking at
        <button
          v-if="isEnemy && !showUpdateDropdown"
          v-on:click="jumpToAbility(ability)"
          class="btn roundedButton"
        >
          Jump to ability
        </button>
        -->
    </div>
  </div>
</template>

<script>
import DisplayBasicAbilityDetails from "../Abilities/DisplayBasicAbilityDetails.vue";
import Bullet from "../Bullet.vue";
export default {
  components: { Bullet, DisplayBasicAbilityDetails },
  name: "AbilitiesSection",
  props: {
    character: Object,
  },
};
</script>

<style scoped>
.card {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
