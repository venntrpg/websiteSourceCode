<template>
  <div v-if="item !== undefined">
    <div v-if="['weapon', 'armor', 'shield'].includes(item.type)">
      <h2>
        {{ itemName
        }}<span v-if="item.category">
          (<a
            v-bind:href="`https://vennt.fandom.com/wiki/Weapons#${item.category}`"
            target="_blank"
            class="link stealth"
            >{{ item.category }}</a
          >)</span
        >
      </h2>
      <weapon-detail :weapon="item" />
    </div>
    <display-basic-item-details v-else :item="item" :prefix="prefix" />
    <div v-if="item.courses" class="mt-16 mb-16">
      <b>Courses:</b> {{ item.courses }}
    </div>
  </div>
</template>

<script>
import DisplayBasicItemDetails from "../Common/Items/DisplayBasicItemDetails.vue";
import WeaponDetail from "./WeaponDetail.vue";
import { prefixName } from "../../utils/itemUtils";
export default {
  components: { WeaponDetail, DisplayBasicItemDetails },
  name: "FullItemDetail",
  props: {
    item: { type: Object, required: true },
    prefix: { type: String, default: "" },
  },
  computed: {
    itemName() {
      return prefixName(this.item, this.prefix, true);
    },
  },
};
</script>
