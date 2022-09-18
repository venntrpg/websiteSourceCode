<template>
  <div>
    <div v-if="attrs.armor && attrs.armor.items.length > 0">
      <div class="labelText mb-8">
        Armor: <span class="number ml-8">{{ attrs.armor.val }}</span>
      </div>
      <simple-item-table :items="attrs.armor.items" class="mb-8" />
    </div>
    <div v-if="attrs.shield && attrs.shield.items.length > 0">
      <div class="labelText mb-8">
        Shield Bonus: <span class="number ml-8">{{ attrs.shield.val }}</span>
      </div>
      <simple-item-table :items="attrs.shield.items" />
    </div>
    <div
      v-if="
        !(attrs.armor && attrs.armor.items.length > 0) ||
        !(attrs.shield && attrs.shield.items.length > 0)
      "
    >
      <router-link
        :to="{ name: 'Character', params: { id: id, section: 'shop' } }"
        class="btn basicBtn link"
      >
        <div class="basicBtnContents">
          <span class="material-icons space">store</span>
          Buy armor at the shop
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import SimpleItemTable from "../../CharacterPage/InventorySection/SimpleItemTable.vue";
export default {
  components: { SimpleItemTable },
  name: "ArmorSection",
  props: {
    id: { type: String, required: true },
    attrs: { type: Object, required: true },
  },
};
</script>
