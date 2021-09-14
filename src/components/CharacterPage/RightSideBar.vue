<template>
  <div>
    <router-link
      :to="{ name: 'Character', params: { id: $route.params.id, section: $route.params.section }}"
      class="btn basicBtn wide link">
      <div class="basicBtnContents">
        <CloseSVG class="basicBtnSVG red" />
        Close
      </div>
    </router-link>
    <div class="panel">
      <AbilityDetail v-if="abilitiesPage" />
      <ItemDetail v-else-if="inventoryPage" />
    </div>
  </div>
</template>

<script>

import AbilityDetail from './AbilityDetail.vue'
import ItemDetail from './ItemDetail.vue'
import CloseSVG from '../Common/SVGs/CloseSVG.vue'

const SECTION_ABILITIES = 'abilities'
const SECTION_INVENTORY = 'inventory'

export default {
  name: 'rightSideBar',
  components: {
    AbilityDetail,
    ItemDetail,
    CloseSVG
  },
  computed: {
    abilitiesPage () {
      return this.$route.params.section === SECTION_ABILITIES
    },
    inventoryPage () {
      return this.$route.params.section === SECTION_INVENTORY
    }
  }
}
</script>

<style>
.panel {
  margin-left: 16px;
  margin-right: 16px;
}
</style>
