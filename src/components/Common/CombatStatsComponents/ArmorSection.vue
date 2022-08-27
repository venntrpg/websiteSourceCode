<template>
  <div v-if="itemArmorMap !== undefined">
    <div v-if="itemArmorMap.shield" class="labelText mb-8">
      <span>Shield Bonus:</span>
      <span class="number ml-8">{{ itemArmorMap.shield }}</span>
    </div>
    <div class="card column border">
      <div
        v-for="(item, index) in itemArmorMap.items"
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
export default {
  name: "ArmorSection",
  props: {
    itemArmorMap: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
