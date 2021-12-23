<template>
  <div>
    <h1>Inventory</h1>
    <div v-if="consolidatedItems.length > 0" class="card column">
      <div class="alignRow item header">
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
        class="alignRow"
      >
        <div class="item">
          <div class="itemName">{{ item.name }}</div>
          <div class="itemCount">{{ item.count }}</div>
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
            <RightArrowSVG class="basicBtnSVG" />
          </div>
        </router-link>
      </div>
    </div>
    <h2>Add unique Item</h2>
    <div class="contentRow">
      <div class="label">Item name:</div>
      <input placeholder="Donut" v-model="itemName" class="input" />
    </div>
    <div class="contentRow">
      <div class="label">Item bulk:</div>
      <input type="number" placeholder="0" v-model="itemBulk" class="input" />
    </div>
    <div class="contentRow">
      <div class="label">Item description:</div>
      <input placeholder="Just a donut" v-model="itemDesc" class="input" />
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
// TODO: I would like to add a shop link so you can just buy common items without needing to insert all of the details individually

import { mapState } from "vuex";
import RightArrowSVG from "../Common/SVGs/RightArrowSVG.vue";

export default {
  name: "Inventory",
  components: {
    RightArrowSVG,
  },
  data() {
    return {
      itemName: "",
      itemBulk: "0",
      itemDesc: "",
    };
  },
  computed: {
    ...mapState(["character"]),
    addItemButtonDisabled() {
      return (
        this.itemName === "" ||
        this.itemBulk === "" ||
        isNaN(parseInt(this.itemBulk)) ||
        this.itemDesc === ""
      );
    },
    consolidatedItems() {
      if (this.character.items === undefined) {
        return [];
      }
      const itemList = [];
      for (const item of this.character.items) {
        const index = itemList.findIndex(
          (i) =>
            i.name === item.name && i.bulk === item.bulk && i.desc === item.desc
        );
        if (index === -1) {
          item.count = 1;
          itemList.push(item);
        } else {
          const foundItem = itemList[index];
          foundItem.count++;
        }
      }
      return itemList;
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
        this.$store.dispatch("addItem", {
          id: this.character.id,
          item: item,
          refreshCharacter: true,
        });
      }
    },
  },
};
</script>

<style scoped>
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

.header {
  margin-right: 46px;
}

.item {
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 14pt;
  text-align: left;
  flex-grow: 1;
}
.itemName {
  width: 20%;
}
.itemCount {
  width: 10%;
}
.itemDesc {
  width: 70%;
  font-size: 12pt;
}

.headerFont {
  font-size: 15pt;
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
