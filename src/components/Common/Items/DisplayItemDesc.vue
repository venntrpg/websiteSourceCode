<template>
  <span>{{ itemDesc }}</span>
</template>

<script>
import { improveTextForDisplay } from "../../../utils/characterStringFormatting";
export default {
  name: "DisplayItemDesc",
  props: { item: { type: Object, required: true } },
  computed: {
    itemDesc() {
      const desc =
        this.item.category === "Grenade" ? this.item.special : this.item.desc;
      return improveTextForDisplay(desc);
    },
  },
};
</script>
