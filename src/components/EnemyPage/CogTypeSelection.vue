<template>
  <div>
    <div v-if="showCogTypeList">
      <button
        v-on:click="toggleDropDown()"
        :disabled="dropDownDisabled"
        class="btn basicBtn noSelect"
      >
        <div class="basicBtnContents">
          Hide Unselected Cog Types
          <span class="material-icons">keyboard_arrow_up</span>
        </div>
      </button>
      <div class="giftCardGroup">
        <button
          v-for="type in cogTypeList"
          v-bind:key="type"
          v-on:click="cogTypeButton(type)"
          class="btn noSelect card selectable giftCard"
          v-bind:class="getCogTypeSelectedClass(type)"
        >
          <cog-type-description :cogType="type" :lvl="lvl" />
        </button>
      </div>
    </div>
    <div v-else>
      <button v-on:click="toggleDropDown()" class="btn basicBtn noSelect">
        <div class="basicBtnContents">
          Show All Cog Types
          <span class="material-icons">keyboard_arrow_down</span>
        </div>
      </button>
      <div class="card singleCard">
        <cog-type-description :cogType="cogType" :lvl="lvl" />
      </div>
    </div>
  </div>
</template>

<script>
import CogTypeDescription from "./CogTypeDescription.vue";

export default {
  name: "CogTypeSelection",
  props: {
    cogType: String,
    lvl: {
      type: String,
      default: "",
    },
  },
  components: {
    CogTypeDescription,
  },
  data() {
    return {
      showFullList: false,
    };
  },
  computed: {
    dropDownDisabled() {
      return !this.cogType;
    },
    showCogTypeList() {
      return this.showFullList || this.dropDownDisabled;
    },
    cogTypeList() {
      return [
        "arcanae",
        "automata",
        "beastFlora",
        "humanoid",
        "monster",
        "undead",
      ];
    },
  },
  methods: {
    getCogTypeSelectedClass(cogType) {
      if (this.cogType === cogType) {
        return "selected";
      }
      return "";
    },
    cogTypeButton(type) {
      this.$emit("cogTypeUpdated", type);
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
  width: 100%;
  justify-content: flex-end;
}

/* mobile styles */
.main.bp900 .giftCardGroup {
  grid-template-columns: repeat(2, 1fr [col-start]);
}
.main.bp600 .giftCardGroup {
  grid-template-columns: repeat(1, 1fr [col-start]);
}
</style>
