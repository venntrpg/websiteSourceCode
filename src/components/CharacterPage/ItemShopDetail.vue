<template>
  <div>
    <full-item-detail :item="item" />
    <div class="seperator mt-24 mb-24" />
  </div>
</template>

<script>
import FullItemDetail from "./FullItemDetail.vue";
import { itemList } from "../../utils/itemUtils";
export default {
  components: { FullItemDetail },
  name: "ItemShopDetail",
  computed: {
    item() {
      const itemName = this.$route.params.detail;
      return itemList.find((it) => it.name === itemName);
    },
  },
};
</script>
