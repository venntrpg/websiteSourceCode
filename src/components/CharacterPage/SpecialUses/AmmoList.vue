<template>
  <div>
    <h3>Ammo Options</h3>
    <router-link
      v-if="ammo.length === 0"
      :to="{ name: 'Character', params: { id: character.id, section: 'shop' } }"
      class="btn basicBtn link mt-24"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">store</span>
        Buy some ammo
      </div>
    </router-link>
    <div v-else class="card column border">
      <div
        v-for="(item, index) in ammo"
        v-bind:key="index"
        class="tableItems noHeader padded"
      >
        <h3 class="mt-0 mb-8">{{ item.name }}</h3>
        <p class="mt-0 mb-0">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "AmmoList",
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems"]),
    ammo() {
      return this.consolidatedItems.filter(
        (item) =>
          item.type === "consumable" &&
          (item.name.includes("Ammunition") || item.name.includes("Ammo"))
      );
    },
  },
};
</script>
