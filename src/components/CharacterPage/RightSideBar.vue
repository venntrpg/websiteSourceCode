<template>
  <div>
    <router-link
      :to="{
        name: 'Character',
        params: { id: $route.params.id, section: $route.params.section },
      }"
      class="btn basicBtn wide link"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">close</span>
        Close
      </div>
    </router-link>
    <div class="ml-16 mr-16">
      <ability-detail v-if="abilitiesPage || (combatPage && !isItem)" />
      <item-detail v-else-if="inventoryPage || combatPage" />
      <weapon-shop-detail v-else-if="weaponShopPage" />
      <item-shop-detail v-else-if="itemShopPage" />
    </div>
  </div>
</template>

<script>
import isUUID from "is-uuid";
import AbilityDetail from "./AbilitySection/AbilityDetail.vue";
import ItemDetail from "./InventorySection/ItemDetail.vue";
import WeaponShopDetail from "./ShopSection/WeaponShopDetail.vue";
import ItemShopDetail from "./ShopSection/ItemShopDetail.vue";
import { defaultWeaponNames } from "../../utils/itemUtils";
import {
  SECTION_ABILITIES,
  SECTION_INVENTORY,
  SECTION_WEAPON_SHOP,
  SECTION_SHOP,
  SECTION_COMBAT,
} from "../../utils/constants";

export default {
  name: "rightSideBar",
  components: {
    AbilityDetail,
    ItemDetail,
    WeaponShopDetail,
    ItemShopDetail,
  },
  computed: {
    abilitiesPage() {
      return this.$route.params.section === SECTION_ABILITIES;
    },
    inventoryPage() {
      return this.$route.params.section === SECTION_INVENTORY;
    },
    weaponShopPage() {
      return this.$route.params.section === SECTION_WEAPON_SHOP;
    },
    itemShopPage() {
      return this.$route.params.section === SECTION_SHOP;
    },
    combatPage() {
      return this.$route.params.section === SECTION_COMBAT;
    },
    isItem() {
      return (
        (this.$route.params.detail &&
          this.$route.params.detail.charAt(0) === "I" &&
          isUUID.v4(this.$route.params.detail.substring(1))) ||
        defaultWeaponNames.includes(this.$route.params.detail)
      );
    },
  },
};
</script>
