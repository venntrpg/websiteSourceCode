<template>
  <div>
    <div v-if="item !== undefined">
      <display-basic-item-details :item="item" />
      <button
        v-on:click="removeItemButton()"
        class="btn roundedButton clear wide"
      >
        Remove Item
      </button>
      <div v-if="showSellItemButton" class="mt-8">
        <button
          v-on:click="sellItemButton()"
          class="btn roundedButton wide mb-4"
        >
          Sell Item for {{ sellValue }} SP
        </button>
        <div class="pt-10 mutedText">
          Note: This does not currently take into account any benefits your
          character may have to get a better price. The shop value of this item
          is
          {{ shopValue }} SP.
        </div>
      </div>
      <div v-if="item.courses" class="mt-16 mb-16">
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
import { itemList } from "../../utils/itemUtils";
import { adjustAttrsAPI } from "../../utils/attributeUtils";

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
    foundShopItem() {
      return itemList.find(
        (it) =>
          it.name === this.item.name &&
          it.type === this.item.type &&
          it.bulk === this.item.bulk &&
          it.desc === this.item.desc
      );
    },
    showSellItemButton() {
      return this.foundShopItem !== undefined;
    },
    shopValue() {
      return this.foundShopItem && this.foundShopItem.sp;
    },
    sellValue() {
      return Math.floor(this.shopValue / 2);
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
    sellItemButton() {
      adjustAttrsAPI(
        this.character,
        { sp: this.sellValue },
        true,
        `Sold ${this.item.name}`
      );
      this.removeItemButton();
    },
  },
};
</script>
