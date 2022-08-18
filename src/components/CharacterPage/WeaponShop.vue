<template>
  <div>
    <h1>Weapon shop</h1>
    <h2>List of Weapon Categories</h2>
    <p class="textBlock">
      The weapons listed below are not specific weapons, but rather categories.
      For example, if you want to wield a battleaxe, you might pick your weapon
      to be Brutal. You would then have a battleaxe that has all the properties
      of Brutal weapons. Even though there are examples listed of the common
      weapons of that category, your weapon can be anything. For example, you
      can have a Great frying pan, or a shortbow that you treat as a Shotgun
      because your character tweaked it to use gunpowder to fire the arrows, so
      it isn’t very much like a Bow at all. Some weapons may be Two-Handed.
    </p>
    <div class="cardGroup">
      <router-link
        v-for="weaponType in weaponTypes"
        v-bind:key="weaponType.category"
        :to="{
          name: 'Character',
          params: {
            id: character.id,
            section: 'weaponShop',
            detail: weaponType.category,
          },
        }"
        class="btn card column padded selectable"
        v-bind:class="selectedClass(weaponType.category)"
      >
        <h3 class="centeredText mt-0 mb-0">{{ weaponType.category }}</h3>
        <weapon-detail :weapon="weaponType" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { weaponTypesList } from "../../utils/itemUtils";
import WeaponDetail from "./WeaponDetail.vue";

export default {
  components: { WeaponDetail },
  name: "WeaponShop",
  computed: {
    ...mapState("character", ["character"]),
    weaponTypes() {
      return weaponTypesList.filter(
        // filter out weapon types you can't purchase.
        // These weapon types can be added to your inventory in different ways.
        (weaponType) => weaponType.sp
      );
    },
  },
  methods: {
    selectedClass(category) {
      return this.$route.params.detail === category ? "selected" : "";
    },
  },
};
</script>

<style scoped>
.cardGroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
  grid-gap: 8px;
}
/* mobile styles */
.main.bp900 .cardGroup {
  grid-template-columns: repeat(2, 1fr [col-start]);
}
.main.bp600 .cardGroup {
  grid-template-columns: repeat(1, 1fr [col-start]);
}
</style>
