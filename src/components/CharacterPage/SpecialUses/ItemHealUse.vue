<template>
  <button
    type="button"
    title="Removes the item from your inventory and heals you by the given amount"
    v-on:click="useItem"
    class="btn roundedButton purple wide mb-8"
  >
    Use Item
  </button>
</template>

<script>
import { mapState } from "vuex";
import { adjustAttrsAPI } from "../../../utils/attributeUtils";
import { prefixName } from "../../../utils/itemUtils";
export default {
  name: "ItemHealUse",
  props: {
    item: { type: Object, required: true },
    heal: { type: Object, required: true },
  },
  computed: {
    ...mapState("character", ["character"]),
  },
  methods: {
    useItem() {
      adjustAttrsAPI(
        this.character,
        this.heal.attr,
        true,
        prefixName(this.item, "Consumed"),
        true
      );
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
