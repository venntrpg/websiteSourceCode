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
    <simple-item-table v-else :items="ammo" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SimpleItemTable from "../InventorySection/SimpleItemTable.vue";
export default {
  components: { SimpleItemTable },
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
