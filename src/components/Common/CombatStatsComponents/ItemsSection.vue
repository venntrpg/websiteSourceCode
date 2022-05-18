<template>
  <div>
    <div class="alignRow">
      <bullet :character="character" />
      <h2>Items</h2>
    </div>
    <div
      v-for="(item, index) in items"
      v-bind:key="index"
      class="card column mb-8"
    >
      <display-basic-item-details :item="item" />
    </div>
  </div>
</template>

<script>
import Bullet from "../Bullet.vue";
import DisplayBasicItemDetails from "../Items/DisplayBasicItemDetails.vue";
import { consolidateItemList } from "../Util/ItemUtils";

export default {
  components: { Bullet, DisplayBasicItemDetails },
  name: "AbilitiesSection",
  props: {
    character: Object,
  },
  computed: {
    items() {
      return consolidateItemList(this.character.items);
    },
  },
};
</script>

<style scoped>
.card {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
