<template>
  <div class="wide">
    <h2>{{ ability.name }}</h2>
    <div v-if="ability.path" class="mb-16">
      <i>{{ ability.path }}</i>
    </div>
    <div v-if="ability.mp_cost" class="mb-16">
      <b>MP Cost:</b> {{ mpCostStr }}
    </div>
    <div v-if="ability.cast_dl" class="mb-16">
      <b>Casting DL:</b> {{ castingDLStr }}
    </div>
    <div v-if="ability.build_dc" class="mb-16">
      <b>DC:</b> {{ ability.build_dc }}
    </div>
    <div v-if="ability.build_time" class="mb-16">
      <b>Build Time:</b> {{ ability.build_time }}
    </div>
    <div v-if="ability.activation" class="mb-16">
      <b>Activation:</b> {{ ability.activation }}
    </div>
    <div v-if="ability.range" class="mb-16">
      <b>Range:</b> {{ ability.range }}
    </div>
    <div v-if="ability.effect" class="mb-16">
      <p><b>Effect:</b></p>
      <p v-if="flavorStr" class="textBlock">
        <i>{{ flavorStr }}</i>
      </p>
      <parse-ability-effect :ability="ability" class="textBlock" />
    </div>
  </div>
</template>

<script>
import ParseAbilityEffect from "./ParseAbilityEffect.vue";
import { improveTextForDisplay } from "../../../utils/characterStringFormatting";
export default {
  components: { ParseAbilityEffect },
  name: "DisplayBasicAbilityDetails",
  props: {
    ability: Object,
  },
  computed: {
    mpCostStr() {
      if (!this.ability.mp_cost) {
        return "";
      }
      if (this.ability.mp_cost.length !== 3) {
        return this.ability.mp_cost;
      }
      return `[ ${this.ability.mp_cost[0]} / ${this.ability.mp_cost[1]} / ${this.ability.mp_cost[2]} ]`;
    },
    castingDLStr() {
      if (!this.ability.cast_dl) {
        return "";
      }
      if (this.ability.cast_dl.length !== 3) {
        return this.ability.cast_dl;
      }
      return `[ ${this.ability.cast_dl[0]} / ${this.ability.cast_dl[1]} / ${this.ability.cast_dl[2]} ]`;
    },
    flavorStr() {
      if (!this.ability.flavor) {
        return "";
      }
      return improveTextForDisplay(this.ability.flavor);
    },
  },
};
</script>
