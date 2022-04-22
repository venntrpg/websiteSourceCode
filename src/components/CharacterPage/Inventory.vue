<template>
  <div>
    <h1>Inventory</h1>
    <div class="alignRow bulkLabel">
      Current Carrying Capacity:
      <fraction :top="bulkSum" :bottom="bulkCapacity" class="bulkFraction" />
    </div>
    <div v-if="consolidatedItems.length > 0" class="card column">
      <div class="alignRow tableData tableHeader">
        <div class="itemName headerFont">
          <b>Item</b>
        </div>
        <div class="itemCount headerFont">
          <b>Count</b>
        </div>
        <div class="itemDesc headerFont">
          <b>Description</b>
        </div>
      </div>
      <div class="seperator thin"></div>
      <div
        v-for="(item, index) in consolidatedItems"
        v-bind:key="index"
        class="alignRow tableItems"
      >
        <div class="tableData">
          <div class="itemName">{{ item.name }}</div>
          <div class="itemCount number">{{ item.ids.length }}</div>
          <div class="itemDesc">{{ item.desc }}</div>
        </div>
        <router-link
          :to="{
            name: 'Character',
            params: { id: character.id, section: 'inventory', detail: item.id },
          }"
          class="btn basicBtn link"
        >
          <div class="basicBtnContents">
            <span class="material-icons">keyboard_arrow_right</span>
          </div>
        </router-link>
      </div>
    </div>
    <router-link
      :to="{ name: 'Character', params: { id: character.id, section: 'shop' } }"
      class="btn basicBtn link mt-24"
    >
      <div class="basicBtnContents">
        <span class="material-icons space">store</span>
        Buy items
      </div>
    </router-link>
    <h2>Add custom Item</h2>
    <div class="contentRow">
      <label for="item-name" class="label">Item name:</label>
      <input
        type="text"
        placeholder="Donut"
        v-model="itemName"
        id="item-name"
        class="input"
      />
    </div>
    <div class="contentRow">
      <label for="item-bulk" class="label">Item bulk:</label>
      <input
        type="number"
        placeholder="0"
        v-model="itemBulk"
        id="item-bulk"
        class="input"
      />
    </div>
    <div class="contentRow">
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
// TODO: I would like to add a shop link so you can just buy common items without
// needing to insert all of the details individually

import { mapGetters, mapState } from "vuex";
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";

export default {
  components: { Fraction },
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
        .filter((item) => item.type !== undefined && item.type === "container")
        .reduce((sum, item) => sum + item.bulk, 0);
    },
    bulkSum() {
      if (this.character.items === undefined) {
        return 0;
      }
      return this.character.items
        .filter((item) => item.type === undefined || item.type !== "container")
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
.bulkLabel {
  font-size: 16pt;
  margin-bottom: 16px;
}
.bulkFraction {
  margin-left: 16px;
}

.contentRow {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
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
