<template>
  <div v-if="item">
    <full-item-detail :item="item" :prefix="'Buy'" />
    <div class="seperator mt-24 mb-24" />
    <form class="mb-64">
      <p v-if="countOwned > 0">
        You already have {{ countOwned }} {{ countName(countOwned) }}
      </p>
      <p v-else>You don't have any {{ pluralName }} yet</p>
      <div class="alignRow gap">
        <label for="item-count" class="labelText nowrap">Number to buy:</label>
        <input
          type="number"
          placeholder="1"
          v-model="count"
          id="item-count"
          v-bind:class="countValid ? '' : 'invalid'"
          class="input"
        />
      </div>
      <p>
        <b>Cost:</b> {{ cost }} SP
        <span class="mutedText">(You have {{ character.sp }} SP)</span>
      </p>
      <button
        type="button"
        v-if="cost > 0"
        v-bind:disabled="!countValid || cost > character.sp"
        v-on:click="buyItem"
        class="btn roundedButton wide mb-8"
      >
        Buy for {{ cost }} SP
      </button>
      <button
        type="button"
        v-bind:disabled="!countValid"
        v-on:click="addItem"
        title="Add this item to your inventory without paying for it"
        class="btn roundedButton clear wide"
      >
        Take item
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FullItemDetail from "../InventorySection/FullItemDetail.vue";
import { itemList, pluralizeName } from "../../../utils/itemUtils";
import { improveTextForDisplay } from "../../../utils/characterStringFormatting";
import { adjustAttrsAPI } from "../../../utils/attributeUtils";

export default {
  components: { FullItemDetail },
  name: "ItemShopDetail",
  data() {
    return {
      count: "1",
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems"]),
    item() {
      const itemName = this.$route.params.detail;
      return itemList.find((it) => it.name === itemName);
    },
    parsedCount() {
      const countInt = parseInt(this.count);
      return isNaN(countInt) ? 0 : countInt;
    },
    cost() {
      return this.item.sp * this.parsedCount;
    },
    countValid() {
      return this.parsedCount > 0 && this.parsedCount <= 10;
    },
    countOwned() {
      const found = this.consolidatedItems.find(
        (it) =>
          it.name === this.item.name &&
          it.bulk === this.item.bulk &&
          it.desc === this.item.desc
      );
      if (!found || !found.ids) {
        return 0;
      }
      return found.ids.length;
    },
    pluralName() {
      return pluralizeName(this.item);
    },
  },
  methods: {
    countName(count) {
      if (count === 1) {
        return this.pluralName;
      }
      return improveTextForDisplay(this.item.name);
    },
    buyItem() {
      adjustAttrsAPI(
        this.character,
        { sp: -this.cost },
        true,
        `Purchased ${this.parsedCount} ${this.countName(this.parsedCount)}`
      );
      this.addItem();
    },
    addItem() {
      const item = { ...this.item };
      if (
        ["container", "armor", "shield", "weapon"].includes(item.type) &&
        item.weaponType !== "grenade"
      ) {
        item.equipped = true;
      }
      for (let i = 0; i < this.parsedCount; i++) {
        this.$store.dispatch("character/addItem", {
          id: this.character.id,
          item,
        });
      }
    },
  },
};
</script>
