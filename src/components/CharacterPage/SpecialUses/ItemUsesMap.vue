<template>
  <div>
    <item-heal-use v-if="uses.heal" :item="item" :heal="uses.heal" />
    <item-roll-use v-if="uses.roll" :item="item" :roll="uses.roll" />
  </div>
</template>

<script>
import ItemHealUse from "./ItemHealUse.vue";
import ItemRollUse from "./ItemRollUse.vue";
export default {
  components: { ItemHealUse, ItemRollUse },
  name: "ItemUsesMap",
  props: {
    item: { type: Object, required: true },
    uses: { type: Object, required: true },
  },
};
</script>
