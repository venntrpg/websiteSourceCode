<template>
  <div class="card column border">
    <div
      v-for="(item, index) in items"
      v-bind:key="item.name + index"
      class="tableItems noHeader padded"
    >
      <h3 class="mt-0 mb-8">{{ item.name }}</h3>
      <p class="mt-0 mb-0">{{ item.desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleItemTable",
  props: { items: { type: Array, required: true } },
};
</script>
