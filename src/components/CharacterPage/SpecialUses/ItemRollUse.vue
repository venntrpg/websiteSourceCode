<template>
  <div class="card column">
    <toggleable-dice-section :dice="roll.dice" @rollValue="updateRollValue" />
    <div class="seperator thin" />
    <div class="mt-8 mb-8 ml-8 mr-8">
      <div class="alignRow gap">
        <label for="item-roll-value" class="labelText nowrap">
          Roll value:
        </label>
        <input
          type="number"
          placeholder="Roll Result"
          v-model="rollValue"
          id="item-roll-value"
          class="input nameInput"
        />
      </div>
      <button
        type="button"
        title="Removes the item from your inventory and heals you by the given amount"
        :disabled="buttonDisabled"
        v-on:click="consumeItem"
        class="btn roundedButton purple wide mt-8"
      >
        Consume Item
      </button>
    </div>
  </div>
</template>

<script>
import ToggleableDiceSection from "../../Common/Dice/ToggleableDiceSection.vue";
import { prefixName } from "../../../utils/itemUtils";
import { adjustAttrsAPI } from "../../../utils/attributeUtils";
import { mapState } from "vuex";
export default {
  components: { ToggleableDiceSection },
  name: "ItemRollUse",
  props: {
    item: { type: Object, required: true },
    roll: { type: Object, required: true },
  },
  data() {
    return {
      rollValue: "",
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    adjust() {
      const val = parseInt(this.rollValue);
      if (isNaN(val)) {
        return 0;
      }
      return val;
    },
    buttonDisabled() {
      return this.adjust === 0;
    },
  },
  methods: {
    updateRollValue(rollValue) {
      this.rollValue = rollValue;
    },
    consumeItem() {
      const adjs = {};
      adjs[this.roll.attr] = this.adjust;
      adjustAttrsAPI(
        this.character,
        adjs,
        true,
        prefixName(this.item, "Consumed"),
        true
      );
      const itemId = this.item.ids[this.item.ids.length - 1];
      this.$store.dispatch("character/removeItem", {
        id: this.character.id,
        itemId,
        redirectToInventory: itemId === this.$route.params.detail,
      });
    },
  },
};
</script>
