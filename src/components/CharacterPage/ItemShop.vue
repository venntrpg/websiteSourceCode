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
      <h4 class="mt-0 mb-0">Filter Item Types:</h4>
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
            <div class="itemName">{{ itemName(item) }}</div>
            <div class="itemCost">{{ item.cost }}</div>
            <div class="itemDesc"><display-item-desc :item="item" /></div>
          </div>
          <router-link :to="itemLink(item)" class="btn basicBtn link">
            <div class="basicBtnContents">
              <span class="material-icons">{{
                itemOpenned(item)
                  ? "keyboard_arrow_left"
                  : "keyboard_arrow_right"
              }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CheckBox from "../Common/CheckBox.vue";
import DisplayItemDesc from "../Common/Items/DisplayItemDesc.vue";
import { itemList } from "../../utils/itemUtils";
import { improveTextForDisplay } from "../../utils/characterStringFormatting";
import { SECTION_SHOP } from "../../utils/constants";

const ITEM_TYPE_EQUIPMENT = "equipment";
const ITEM_TYPE_CONSUMABLE = "consumable";
const ITEM_TYPE_CONTAINER = "container";
const ITEM_TYPE_WEAPON = "weapon";

export default {
  components: { CheckBox, DisplayItemDesc },
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
        .filter(
          (item) =>
            item.name.toLowerCase().includes(this.activeSearchTerm) &&
            typeFilters.includes(item.type)
        )
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
    itemName(item) {
      return improveTextForDisplay(item.name);
    },
    itemOpenned(item) {
      return this.$route.params.detail === item.name;
    },
    itemLink(item) {
      if (this.itemOpenned(item)) {
        return {
          name: "Character",
          params: { id: this.character.id, section: SECTION_SHOP },
        };
      }
      return {
        name: "Character",
        params: {
          id: this.character.id,
          section: SECTION_SHOP,
          detail: item.name,
        },
      };
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
