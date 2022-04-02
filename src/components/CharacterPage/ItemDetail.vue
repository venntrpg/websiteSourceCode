<template>
  <div>
    <div v-if="item !== undefined">
      <display-basic-item-details :item="item" />
      <button
        v-on:click="removeItemButton()"
        class="btn roundedButton clear wide mb-16"
      >
        Remove Item
      </button>
      <div v-if="item.courses" class="mb-16">
        <b>Courses:</b> {{ item.courses }}
      </div>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this item ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DisplayBasicItemDetails from "../Common/Items/DisplayBasicItemDetails.vue";

export default {
  components: { DisplayBasicItemDetails },
  name: "itemDetail",
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems"]),
    item() {
      if (this.consolidatedItems === undefined) {
        return undefined;
      }
      return this.consolidatedItems.find(
        (searchItem) => searchItem.id === this.$route.params.detail
      );
    },
  },
  methods: {
    removeItemButton() {
      const itemId = this.item.ids[this.item.ids.length - 1];
      this.$store.dispatch("character/removeItem", {
        id: this.character.id,
        itemId,
        redirectToInventory: itemId === this.$route.params.detail,
      });
    },
  },
};
</script>
