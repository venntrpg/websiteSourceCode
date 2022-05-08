<template>
  <div v-on:click="closeClick" class="modal show" id="attribute-modal">
    <div class="dialogue lg card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0">Edit {{ attrFullName }}</h2>
          <router-link :to="exitRoute" class="btn basicBtn">
            <div class="basicBtnContents">
              <span class="material-icons">close</span>
            </div>
          </router-link>
        </div>
        <div class="seperator thin"></div>
        <div class="dialogue-details">
          <div class="alignRow labelText mb-16">
            Current {{ attrDisplayName }}:
            <fraction
              v-if="maxAttr"
              :top="character[attr]"
              :bottom="character[maxAttr]"
              class="ml-8"
            />
            <span v-else class="ml-8">{{ character[attr] }}</span>
          </div>
          <div class="cols-2">
            <div>
              <attr-history :attr="attr" :character="character" />
              <button
                type="button"
                v-if="showResetButton"
                v-on:click="resetButton"
                class="btn roundedButton wide mt-8"
              >
                Reset {{ attrDisplayName }} to Full
              </button>
            </div>
            <div>
              <adjust-attr
                :attr="attr"
                :character="character"
                loc="modal"
                :submitBtn="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdjustAttr from "./CombatStatsComponents/AdjustAttr.vue";
import AttrHistory from "./AttrHistory.vue";
import Fraction from "./CombatStatsComponents/Fraction.vue";
import {
  getMaxAttr,
  getAttrFullName,
  getAttrDisplayName,
  adjustAttrsAPI,
} from "../../utils/attributeUtils";

export default {
  components: { AdjustAttr, AttrHistory, Fraction },
  name: "ConfirmationModal",
  props: {
    character: Object,
    attr: String,
  },
  computed: {
    exitRoute() {
      return { name: this.$route.name, params: this.$route.params };
    },
    attrFullName() {
      return getAttrFullName(this.attr);
    },
    attrDisplayName() {
      return getAttrDisplayName(this.attr);
    },
    maxAttr() {
      return getMaxAttr(this.attr);
    },
    showResetButton() {
      return (
        this.maxAttr !== undefined &&
        this.character[this.attr] !== this.character[this.maxAttr]
      );
    },
  },
  methods: {
    closeClick(event) {
      if (document.getElementById("attribute-modal") === event.target) {
        this.$router.push(this.exitRoute);
      }
    },
    resetButton() {
      const attrs = {};
      attrs[this.attr] =
        this.character[this.maxAttr] - this.character[this.attr];
      adjustAttrsAPI(this.character, attrs, true);
      this.$store.dispatch("character/filterChangelog", {
        id: this.character.id,
        attr: this.attr,
      });
    },
  },
};
</script>

<style scoped>
.cols-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
</style>
