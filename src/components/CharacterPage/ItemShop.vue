<template>
  <div>
    <h1>Item shop</h1>
    <div class="alignRow gap">
      <input
        placeholder="Item Search"
        v-on:input="itemSearch()"
        v-on:keyup.enter="itemSearch()"
        v-model="itemSearchField"
        id="item-search"
        class="input itemSearchInput"
      />
      <button v-on:click="toggleShowSearchSettings()" class="btn basicBtn">
        <div class="basicBtnContents">
          <span class="material-icons space">filter_list</span>
          Search Settings
        </div>
      </button>
    </div>
    <div v-if="showSearchSettings" class="card column padded">
      <h4 class="mt-0">Filter Item Types:</h4>
      <check-box
        :checked="showEquipment"
        :text="'Show Equipment'"
        :highlight="true"
        @toggled="toggleShowEquipment"
      />
      <check-box
        :checked="showConsumables"
        :text="'Show Consumables'"
        :highlight="true"
        @toggled="toggleShowConsumables"
      />
      <check-box
        :checked="showContainers"
        :text="'Show Containers'"
        :highlight="true"
        @toggled="toggleShowContainers"
      />
      <check-box
        :checked="showWeapons"
        :text="'Show Weapons'"
        :highlight="true"
        @toggled="toggleShowWeapons"
      />
      <div class="seperator"></div>
      <check-box
        :checked="spendOnPurchase"
        :text="'Spend SP on item purchase'"
        :highlight="true"
        @toggled="toggleSpendOnPurchase"
      />
      <div class="seperator"></div>
      <check-box
        :checked="hideExpensive"
        :text="'Hide items that are too expensive for you'"
        :highlight="true"
        @toggled="toggleHideExpensive"
      />
    </div>
    <div v-for="(items, section) in sectionsMap" v-bind:key="section">
      <h2>{{ section }}</h2>
      <div class="card column">
        <div class="alignRow tableData tableHeader sticky">
          <div class="itemName headerFont">
            <b>Item</b>
          </div>
          <div class="itemCost headerFont">
            <b>Cost</b>
          </div>
          <div class="itemDesc headerFont">
            <b>Description</b>
          </div>
        </div>
        <div
          v-for="item in items"
          v-bind:key="item.name"
          class="alignRow tableItems"
        >
          <div class="tableData">
            <div class="itemName">{{ item.name }}</div>
            <div class="itemCost">{{ item.cost }}</div>
            <div class="itemDesc">{{ item.desc }}</div>
          </div>
          <button
            v-on:click="buyButton(item)"
            :disabled="buyButtonDisabled(item)"
            class="btn basicBtn"
          >
            <div class="basicBtnContents">
              <span class="material-icons">shopping_bag</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CheckBox from "../Common/CheckBox.vue";
import { itemList, convertToValidItem } from "../Common/Util/ItemUtils";
import { adjustAttrsAPI } from "../../utils/attributeUtils";

const ITEM_TYPE_EQUIPMENT = "equipment";
const ITEM_TYPE_CONSUMABLE = "consumable";
const ITEM_TYPE_CONTAINER = "container";
const ITEM_TYPE_WEAPON = "weapon";

export default {
  components: { CheckBox },
  name: "ItemShop",
  data() {
    return {
      itemSearchField: "",
      activeSearchTerm: "",
      showSearchSettings: false,
      showEquipment: false,
      showConsumables: false,
      showContainers: false,
      showWeapons: false,
      spendOnPurchase: true,
      hideExpensive: false,
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    sectionsMap() {
      const typeFilters = [];
      if (
        !this.showEquipment &&
        !this.showConsumables &&
        !this.showContainers &&
        !this.showWeapons
      ) {
        typeFilters.push(
          ITEM_TYPE_EQUIPMENT,
          ITEM_TYPE_CONSUMABLE,
          ITEM_TYPE_CONTAINER,
          ITEM_TYPE_WEAPON
        );
      } else {
        if (this.showEquipment) {
          typeFilters.push(ITEM_TYPE_EQUIPMENT);
        }
        if (this.showConsumables) {
          typeFilters.push(ITEM_TYPE_CONSUMABLE);
        }
        if (this.showContainers) {
          typeFilters.push(ITEM_TYPE_CONTAINER);
        }
        if (this.showWeapons) {
          typeFilters.push(ITEM_TYPE_WEAPON);
        }
      }
      const sections = {};
      itemList
        .filter((item) => {
          if (this.hideExpensive && this.buyButtonDisabled(item)) {
            return false;
          }
          return (
            item.name.toLowerCase().includes(this.activeSearchTerm) &&
            typeFilters.includes(item.type)
          );
        })
        .forEach((item) => {
          if (item.section in sections) {
            sections[item.section].push(item);
          } else {
            sections[item.section] = [item];
          }
        });

      return sections;
    },
  },
  methods: {
    itemSearch() {
      this.activeSearchTerm = this.itemSearchField.toLowerCase();
    },
    toggleShowSearchSettings() {
      this.showSearchSettings = !this.showSearchSettings;
    },
    toggleShowEquipment() {
      this.showEquipment = !this.showEquipment;
    },
    toggleShowConsumables() {
      this.showConsumables = !this.showConsumables;
    },
    toggleShowContainers() {
      this.showContainers = !this.showContainers;
    },
    toggleShowWeapons() {
      this.showWeapons = !this.showWeapons;
    },
    toggleSpendOnPurchase() {
      this.spendOnPurchase = !this.spendOnPurchase;
    },
    toggleHideExpensive() {
      this.hideExpensive = !this.hideExpensive;
    },
    buyButtonDisabled(item) {
      return (
        this.spendOnPurchase && "sp" in item && item.sp > this.character.sp
      );
    },
    buyButton(item) {
      this.$store.dispatch("character/addItem", {
        id: this.character.id,
        item: convertToValidItem(item),
        refreshCharacter: true,
      });
      if (this.spendOnPurchase && "sp" in item) {
        adjustAttrsAPI(
          this.character,
          { sp: -item.sp },
          true,
          `Purchased a ${item.name}`
        );
      }
    },
  },
};
</script>

<style scoped>
.itemSearchInput {
  max-width: 400px;
}

.itemName {
  width: 20%;
  font-size: 14pt;
}
.itemCost {
  width: 10%;
  font-size: 14pt;
}
.itemDesc {
  width: 70%;
}

.main.bp750 .itemName {
  width: 35%;
}
.main.bp750 .itemCost {
  display: 5%;
}
.main.bp750 .itemDesc {
  width: 60%;
}
</style>
