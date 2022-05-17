<template>
  <div v-on:click="closeClick" class="modal show" id="attr-modal-background">
    <div class="dialogue lg card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0">Edit {{ attrFullName }}</h2>
          <router-link
            :to="exitRoute"
            class="btn basicBtn"
            id="attr-modal-first-interactive"
          >
            <div class="basicBtnContents">
              <span class="material-icons">close</span>
            </div>
          </router-link>
        </div>
        <div class="seperator thin"></div>
        <div class="dialogue-details">
          <div class="alignRow split wrap mb-16">
            <div class="alignRow labelText">
              Current {{ attrDisplayName }}:
              <fraction
                v-if="maxAttr"
                :top="character[attr]"
                :bottom="character[maxAttr]"
                class="ml-8"
              />
              <span v-else-if="attr in character" class="ml-8">
                {{ character[attr] }}
              </span>
              <span v-else class="ml-8">Not yet defined</span>
            </div>
            <router-link
              v-if="maxAttr"
              :to="maxAttrModalRoute"
              class="btn basicBtn"
            >
              <div class="basicBtnContents">
                <span class="material-icons space">edit</span>
                Edit {{ maxAttrDisplayName }}
              </div>
            </router-link>
            <router-link
              v-else-if="baseAttr"
              :to="baseAttrModalRoute"
              class="btn basicBtn"
            >
              <div class="basicBtnContents">
                <span class="material-icons space">edit</span>
                Edit {{ baseAttrDisplayName }}
              </div>
            </router-link>
          </div>
          <div class="cols-2 table-split">
            <div class="attr-history-side">
              <attr-history :attr="attr" :character="character" />
              <button
                type="button"
                v-if="showResetButton"
                v-on:click="resetButton"
                :title="`Refill your ${attrDisplayName} to full. Warning: this will clear your ${attrDisplayName} history.`"
                class="btn basicBtn wide mt-8"
              >
                <div class="basicBtnContents">
                  <span class="material-icons space">restart_alt</span>
                  Reset {{ attrDisplayName }} to Full
                </div>
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
  getBaseAttrFromMax,
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
  mounted() {
    // When the user is using keyboard navigation, jump focus to modal
    document.getElementById("attr-modal-first-interactive").focus();
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
    maxAttrDisplayName() {
      return this.maxAttr === undefined ? "" : getAttrFullName(this.maxAttr);
    },
    maxAttrModalRoute() {
      return {
        name: this.$route.name,
        params: this.$route.params,
        query: { attr: this.maxAttr },
      };
    },
    baseAttr() {
      return getBaseAttrFromMax(this.attr);
    },
    baseAttrDisplayName() {
      return this.baseAttr === undefined ? "" : getAttrFullName(this.baseAttr);
    },
    baseAttrModalRoute() {
      return {
        name: this.$route.name,
        params: this.$route.params,
        query: { attr: this.baseAttr },
      };
    },
    showResetButton() {
      return (
        this.maxAttr !== undefined &&
        this.character[this.attr] !== this.character[this.maxAttr] &&
        this.attr !== "hero"
      );
    },
  },
  methods: {
    closeClick(event) {
      if (document.getElementById("attr-modal-background") === event.target) {
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

/* Mobile Styles */
@media screen and (max-width: 600px) {
  .table-split {
    grid-template-columns: 1fr;
  }
  .attr-history-side {
    border-bottom: 2px solid var(--border);
    padding-bottom: 8px;
  }
}

@media screen and (max-width: 500px), screen and (max-height: 400px) {
  .dialogue {
    min-width: 100vw;
    min-height: 100vh;
    margin: 0px;
    border: 0px;
  }
}
</style>
