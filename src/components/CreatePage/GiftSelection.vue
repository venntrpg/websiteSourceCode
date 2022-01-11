<template>
  <div>
    <div v-if="showGiftList">
      <button
        v-on:click="toggleDropDown()"
        :disabled="dropDownDisabled"
        class="btn basicBtn noSelect"
      >
        <div class="basicBtnContents">
          Hide Unselected Gifts
          <span class="material-icons">keyboard_arrow_up</span>
        </div>
      </button>
      <div class="giftCardGroup">
        <button
          v-for="(giftName, giftCode) in giftMap"
          v-bind:key="giftCode"
          v-on:click="giftButton(giftCode)"
          class="btn noSelect card selectable giftCard"
          v-bind:class="getGiftSelectedClass(giftCode)"
        >
          <GiftDescription :gift="giftName" />
        </button>
      </div>
    </div>
    <div v-else>
      <button v-on:click="toggleDropDown()" class="btn basicBtn noSelect">
        <div class="basicBtnContents">
          Show All Gifts
          <span class="material-icons">keyboard_arrow_down</span>
        </div>
      </button>
      <div class="card singleCard">
        <GiftDescription :gift="giftMap[gift]" />
      </div>
    </div>
  </div>
</template>

<script>
import GiftDescription from "../Common/CombatStatsComponents/GiftDescription.vue";

export default {
  name: "GiftSelection",
  props: {
    gift: String,
  },
  components: {
    GiftDescription,
  },
  data() {
    return {
      showFullList: false,
    };
  },
  computed: {
    dropDownDisabled() {
      return this.giftMap[this.gift] === undefined;
    },
    showGiftList() {
      return this.showFullList || this.dropDownDisabled;
    },
    giftMap() {
      return {
        per: "Alertness",
        tek: "Craft",
        agi: "Alacrity",
        dex: "Finesse",
        int: "Mind",
        spi: "Magic",
        str: "Rage",
        wis: "Science",
        cha: "Charm",
        none: "None",
      };
    },
  },
  methods: {
    getGiftSelectedClass(gift) {
      if (this.gift === gift) {
        return "selected";
      }
      return "";
    },
    giftButton(gift) {
      this.$emit("giftUpdated", gift);
    },
    toggleDropDown() {
      this.showFullList = !this.showFullList;
    },
  },
};
</script>

<style scoped>
.basicBtn {
  width: 100%;
  margin-top: 4px;
  justify-content: flex-end;
}

.giftCardGroup {
  margin-top: 2px;
  display: grid;
  grid-template-columns: repeat(3, 1fr [col-start]);
  grid-gap: 8px;
}

.giftCard {
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.singleCard {
  flex-direction: column;
  align-items: center;
}

/* mobile styles */
.main.bp900 .giftCardGroup {
  grid-template-columns: repeat(2, 1fr [col-start]);
}
.main.bp600 .giftCardGroup {
  grid-template-columns: repeat(1, 1fr [col-start]);
}
</style>
