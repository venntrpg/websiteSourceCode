<template>
  <div class="mb-64">
    <div v-if="item !== undefined">
      <full-item-detail :item="item" />
      <item-uses-map
        v-if="foundShopItem && foundShopItem.uses"
        :item="item"
        :uses="foundShopItem.uses"
      />
      <special-item-uses :item="item" />
      <div v-if="!isDefaultWeapon">
        <div class="seperator mt-24 mb-24" />
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
            character may have to get a better (or worse) price. The shop value
            of this item is {{ shopValue }} SP.
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this item ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FullItemDetail from "./FullItemDetail.vue";
import SpecialItemUses from "../SpecialUses/SpecialItemUses.vue";
import ItemUsesMap from "../SpecialUses/ItemUsesMap.vue";
import {
  getShopItem,
  defaultWeapons,
  defaultWeaponNames,
} from "../../../utils/itemUtils";
import { adjustAttrsAPI } from "../../../utils/attributeUtils";

export default {
  components: { FullItemDetail, SpecialItemUses, ItemUsesMap },
  name: "itemDetail",
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems"]),
    isDefaultWeapon() {
      return defaultWeaponNames.includes(this.$route.params.detail);
    },
    item() {
      if (this.isDefaultWeapon) {
        return defaultWeapons.find(
          (weapon) => weapon.name === this.$route.params.detail
        );
      }
      if (this.consolidatedItems === undefined) {
        return undefined;
      }
      return this.consolidatedItems.find(
        (searchItem) => searchItem.id === this.$route.params.detail
      );
    },
    foundShopItem() {
      return getShopItem(this.item);
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
