<template>
  <div v-bind:class="hideCountClass" class="card column">
    <div class="alignRow tableData tableHeader">
      <div class="itemName headerFont">
        <b>{{ itemType }}</b>
      </div>
      <div class="itemCount headerFont">
        <b>Count</b>
      </div>
      <div class="itemDesc headerFont">
        <b>Description</b>
      </div>
    </div>
    <div
      v-for="(item, index) in items"
      v-bind:key="index"
      v-bind:id="itemID(item)"
      v-bind:class="itemOpenned(item) ? 'selected' : ''"
      class="alignRow tableItems"
    >
      <div class="tableData">
        <div class="itemName">{{ itemName(item) }}</div>
        <div class="itemCount number">{{ item.ids.length }}</div>
        <div class="itemDesc"><display-item-desc :item="item" /></div>
      </div>
      <router-link :to="itemLink(item)" class="btn basicBtn link">
        <div class="basicBtnContents">
          <span class="material-icons">{{
            itemOpenned(item) ? "keyboard_arrow_left" : "keyboard_arrow_right"
          }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import DisplayItemDesc from "../Common/Items/DisplayItemDesc.vue";
import { SECTION_INVENTORY } from "../../utils/constants";
import {
  improveTextForDisplay,
  stringToLinkID,
} from "../../utils/characterStringFormatting";
export default {
  components: { DisplayItemDesc },
  name: "ItemTable",
  props: {
    id: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemType: {
      type: String,
      default: "Item",
    },
    hideCount: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hideCountClass() {
      return this.hideCount ? "hideCount" : "";
    },
  },
  methods: {
    itemID(item) {
      return stringToLinkID(item.id);
    },
    itemName(item) {
      return improveTextForDisplay(item.name);
    },
    itemOpenned(item) {
      return this.$route.params.detail === item.id;
    },
    itemLink(item) {
      if (this.itemOpenned(item)) {
        return {
          name: "Character",
          params: { id: this.id, section: SECTION_INVENTORY },
        };
      }
      return {
        name: "Character",
        params: { id: this.id, section: SECTION_INVENTORY, detail: item.id },
      };
    },
  },
};
</script>

<style scoped>
.itemName {
  width: 20%;
  font-size: 14pt;
}
.itemCount {
  width: 10%;
  font-size: 14pt;
}
.itemDesc {
  width: 70%;
}

.hideCount .itemCount {
  display: none;
}
.hideCount .itemDesc {
  width: 80%;
}

.main.bp750 .itemName {
  width: 40%;
}
.main.bp750 .itemCount {
  display: none;
}
.main.bp750 .itemDesc {
  width: 60%;
}
</style>
