<template>
  <div>
    <h2>{{ itemName }}</h2>
    <div class="mb-16"><b>Description:</b> {{ itemDesc }}</div>
    <div class="mb-16">
      <b>{{ bulkLabel }}:</b> <span class="number">{{ item.bulk }}</span>
    </div>
    <div v-if="item.ids && item.ids.length !== 1" class="mb-16">
      <b>Count:</b> <span class="number">{{ item.ids.length }}</span>
    </div>
  </div>
</template>

<script>
import { improveTextForDisplay } from "../../../utils/characterStringFormatting";
export default {
  name: "DisplayBasicItemDetails",
  props: {
    item: Object,
  },
  computed: {
    itemName() {
      return improveTextForDisplay(this.item.name);
    },
    itemDesc() {
      return improveTextForDisplay(this.item.desc);
    },
    bulkLabel() {
      return this.item && this.item.type && this.item.type === "container"
        ? "Carrying Capacity"
        : "Bulk";
    },
  },
};
</script>
