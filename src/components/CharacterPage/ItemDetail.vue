<template>
  <div>
    <div v-if="item !== undefined">
      <h2>{{ item.name }}</h2>
      <div class="bottomMargin"><b>Description:</b> {{ item.desc }}</div>
      <div class="bottomMargin"><b>Bulk:</b> {{ item.bulk }}</div>
      <button
        v-on:click="removeItemButton()"
        class="btn roundedButton clear wide bottomMargin"
      >
        Remove Item
      </button>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this item ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "itemDetail",
  computed: {
    ...mapState(["character"]),
    item() {
      if (this.character.items === undefined) {
        return undefined;
      }
      return this.character.items.find(
        (searchItem) => searchItem.id === this.$route.params.detail
      );
    },
  },
  methods: {
    removeItemButton() {
      this.$store.dispatch("removeItem", {
        id: this.character.id,
        itemId: this.item.id,
        redirectToInventory: true,
      });
    },
  },
};
</script>

<style>
.bottomMargin {
  margin-bottom: 16px;
}
</style>
