<template>
  <div>
    <ammo-list v-if="showAmmoList"></ammo-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AmmoList from "./AmmoList.vue";
export default {
  components: { AmmoList },
  name: "SpecialItemUses",
  props: { item: { type: Object, required: true } },
  computed: {
    ...mapState("character", ["character"]),
    showAmmoList() {
      return (
        this.item &&
        this.item.weaponType &&
        this.item.weaponType.includes("Ranged")
      );
    },
  },
};
</script>
