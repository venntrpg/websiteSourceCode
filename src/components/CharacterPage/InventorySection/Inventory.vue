<template>
  <div>
    <h1>Inventory</h1>
    <div class="alignRow labelText mb-16">
      Used Carrying Capacity:
      <fraction :top="bulkSum" :bottom="bulkCapacity" class="ml-16" />
    </div>
    <div v-if="weapons.length > 0">
      <h2>Weapons</h2>
      <item-table
        :id="character.id"
        :items="weapons"
        :itemType="'Weapon'"
        :hideCount="true"
        class="mb-24"
      />
    </div>
    <div v-if="generalItems.length > 0">
      <h2>Equipment &amp; Consumables</h2>
      <item-table
        :id="character.id"
        :items="generalItems"
        :itemType="'Item'"
        class="mb-24"
      />
    </div>
    <div v-if="containers.length > 0">
      <h2>Item Containers</h2>
      <item-table
        :id="character.id"
        :items="containers"
        :itemType="'Container'"
        class="mb-24"
      />
    </div>
    <h2>Buy Items</h2>
    <router-link
      :to="{ name: 'Character', params: { id: character.id, section: 'shop' } }"
      class="btn basicBtn link mt-24"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">store</span>
        Item Shop
      </div>
    </router-link>
    <router-link
      :to="{
        name: 'Character',
        params: { id: character.id, section: 'weaponShop' },
      }"
      class="btn basicBtn link mt-8"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">sports_martial_arts</span>
        Weapon Shop
      </div>
    </router-link>
    <h2>Add custom Item</h2>
    <div class="alignRow mb-8">
      <label for="item-name" class="label">Item name:</label>
      <input
        type="text"
        placeholder="Donut"
        v-model="itemName"
        id="item-name"
        class="input"
      />
    </div>
    <div class="alignRow mb-8">
      <label for="item-bulk" class="label">Item bulk:</label>
      <input
        type="number"
        placeholder="0"
        v-model="itemBulk"
        id="item-bulk"
        class="input"
      />
    </div>
    <div class="alignRow mb-8">
      <label for="item-desc" class="label">Item description:</label>
      <textarea
        placeholder="Just a donut"
        v-model="itemDesc"
        id="item-desc"
        class="input textInput"
      ></textarea>
    </div>
    <button
      v-on:click="addItemButton()"
      :disabled="addItemButtonDisabled"
      class="btn roundedButton widen"
    >
      Add Item
    </button>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Fraction from "../../Common/CombatStatsComponents/Fraction.vue";
import ItemTable from "./ItemTable.vue";

export default {
  components: { Fraction, ItemTable },
  name: "Inventory",
  data() {
    return {
      itemName: "",
      itemBulk: "0",
      itemDesc: "",
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems"]),
    weapons() {
      return this.consolidatedItems.filter((item) => item.type === "weapon");
    },
    containers() {
      return this.consolidatedItems.filter((item) => item.type === "container");
    },
    generalItems() {
      return this.consolidatedItems.filter(
        (item) =>
          !this.weapons.includes(item) && !this.containers.includes(item)
      );
    },
    addItemButtonDisabled() {
      return (
        this.itemName === "" ||
        this.itemBulk === "" ||
        isNaN(parseInt(this.itemBulk)) ||
        this.itemDesc === ""
      );
    },
    bulkCapacity() {
      if (this.character.items === undefined) {
        return 0;
      }
      return this.character.items
        .filter((item) => item.type === "container")
        .reduce((sum, item) => sum + item.bulk, 0);
    },
    bulkSum() {
      if (this.character.items === undefined) {
        return 0;
      }
      return this.character.items
        .filter((item) => item.type !== "container" && !item.equipped)
        .reduce((sum, item) => sum + item.bulk, 0);
    },
  },
  methods: {
    addItemButton() {
      if (!this.addItemButtonDisabled) {
        const item = {
          name: this.itemName,
          bulk: parseInt(this.itemBulk),
          desc: this.itemDesc,
        };
        this.$store.dispatch("character/addItem", {
          id: this.character.id,
          item: item,
          refreshCharacter: true,
        });
        this.itemName = "";
        this.itemBulk = "0";
        this.itemDesc = "";
      }
    },
  },
};
</script>

<style scoped>
.label {
  width: 170px;
}
.widen {
  width: 200px;
}

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
