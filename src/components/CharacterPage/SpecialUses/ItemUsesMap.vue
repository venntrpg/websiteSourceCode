<template>
  <div>
    <item-heal-use v-if="uses.heal" :item="item" :heal="uses.heal" />
    <item-roll-use v-if="uses.roll" :item="item" :roll="uses.roll" />
    <item-check-use v-if="uses.check" :item="item" :check="uses.check" />
  </div>
</template>

<script>
import ItemCheckUse from "./ItemCheckUse.vue";
import ItemHealUse from "./ItemHealUse.vue";
import ItemRollUse from "./ItemRollUse.vue";
export default {
  components: { ItemHealUse, ItemRollUse, ItemCheckUse },
  name: "ItemUsesMap",
  props: {
    item: { type: Object, required: true },
    uses: { type: Object, required: true },
  },
};
</script>
