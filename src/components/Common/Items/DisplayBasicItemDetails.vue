<template>
  <div>
    <h2>{{ item.name }}</h2>
    <div class="mb-16"><b>Description:</b> {{ item.desc }}</div>
    <div class="mb-16">
      <b>{{ bulkLabel }}:</b> <span class="number">{{ item.bulk }}</span>
    </div>
    <div v-if="item.ids && item.ids.length !== 1" class="mb-16">
      <b>Count:</b> <span class="number">{{ item.ids.length }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DisplayBasicItemDetails",
  props: {
    item: Object,
  },
  computed: {
    bulkLabel() {
      return this.item && this.item.type && this.item.type === "container"
        ? "Carrying Capacity"
        : "Bulk";
    },
  },
};
</script>
