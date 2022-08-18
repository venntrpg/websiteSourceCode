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
    <div class="panel">
      <ability-detail v-if="abilitiesPage" />
      <item-detail v-else-if="inventoryPage" />
      <weapon-shop-detail v-else-if="weaponShopPage" />
    </div>
  </div>
</template>

<script>
import AbilityDetail from "./AbilityDetail.vue";
import ItemDetail from "./ItemDetail.vue";
import WeaponShopDetail from "./WeaponShopDetail.vue";
import {
  SECTION_ABILITIES,
  SECTION_INVENTORY,
  SECTION_WEAPON_SHOP,
} from "../../utils/constants";

export default {
  name: "rightSideBar",
  components: {
    AbilityDetail,
    ItemDetail,
    WeaponShopDetail,
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
  },
};
</script>

<style>
.panel {
  margin-left: 16px;
  margin-right: 16px;
}
</style>
