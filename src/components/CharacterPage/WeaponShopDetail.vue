<template>
  <div v-if="weapon">
    <h2>Buy {{ weaponCategory }} weapon</h2>
    <weapon-detail :weapon="weapon" />
    <div class="seperator thin mt-8 mb-8" />
    <form>
      <div class="alignRow gap mb-4">
        <label for="weapon-shop-detail-name" class="labelText">Weapon:</label>
        <input
          type="text"
          v-model="weaponName"
          v-bind:placeholder="placeholder"
          title="Enter the name / type for your weapon here"
          id="weapon-shop-detail-name"
          class="input wide"
        />
      </div>
      <label for="weapon-shop-detail-desc" class="labelText mb-4">
        Description:
      </label>
      <textarea
        v-model="weapon.desc"
        title="Enter a description of your weapon here"
        id="weapon-shop-detail-desc"
        class="input textInput mb-16"
      ></textarea>
      <button
        type="button"
        v-if="weapon.sp"
        v-bind:disabled="buttonDisabled || character.sp < weapon.sp"
        v-on:click="buyItem"
        class="btn roundedButton wide mb-8"
      >
        Buy for {{ weapon.sp }} SP
      </button>
      <button
        type="button"
        v-bind:disabled="buttonDisabled"
        v-on:click="addItem"
        title="Add this item to your inventory without paying for it"
        class="btn roundedButton clear wide"
      >
        Take weapon
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import indefinite from "indefinite";
import WeaponDetail from "./WeaponDetail.vue";
import { weaponTypesList } from "../../utils/itemUtils";
import { adjustAttrsAPI } from "../../utils/attributeUtils";

export default {
  components: { WeaponDetail },
  name: "weaponShopDetail",
  data() {
    return {
      weaponName: "",
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    weapon() {
      return weaponTypesList.find(
        (weaponType) => weaponType.category === this.$route.params.detail
      );
    },
    weaponCategory() {
      return this.weapon && indefinite(this.weapon.category.toLowerCase());
    },
    placeholder() {
      return this.weapon && this.weapon.examples
        ? this.weapon.examples
        : "Weapon name";
    },
    buttonDisabled() {
      return !this.weaponName;
    },
  },
  methods: {
    buyItem() {
      adjustAttrsAPI(
        this.character,
        { sp: -this.weapon.sp },
        true,
        `Purchased "${this.weaponName}"`
      );
      this.addItem();
    },
    addItem() {
      const named = { name: this.weaponName, ...this.weapon };
      this.$store.dispatch("character/addItem", {
        id: this.character.id,
        item: named,
        redirectToDetail: true,
      });
      this.weaponName = "";
    },
  },
};
</script>
