<template>
  <div class="wide">
    <h2>{{ ability.name }}</h2>
    <div v-if="ability.path" class="bottomMargin">
      <i>{{ ability.path }}</i>
    </div>
    <div v-if="ability.activation" class="bottomMargin">
      <b>Activation:</b> {{ ability.activation }}
    </div>
    <div v-if="ability.range" class="bottomMargin">
      <b>Range:</b> {{ ability.range }}
    </div>
    <div v-if="ability.effect" class="bottomMargin">
      <p><b>Effect:</b></p>
      <p v-if="ability.flavor" class="textBlock">
        <i>{{ ability.flavor }}</i>
      </p>
      <parse-ability-effect :ability="ability" class="textBlock" />
    </div>
  </div>
</template>

<script>
import ParseAbilityEffect from "./ParseAbilityEffect.vue";
export default {
  components: { ParseAbilityEffect },
  name: "DisplayBasicAbilityDetails",
  props: {
    ability: Object,
  },
};
</script>

<style>
.bottomMargin {
  margin-bottom: 16px;
}
</style>
