<template>
  <div class="modal show" id="level-modal-background">
    <div class="dialogue lg card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0">Level Up to {{ levelToProcess }}</h2>
          <button
            v-on:click="exitModal"
            type="button"
            class="btn basicBtn"
            id="level-modal-first-interactive"
          >
            <div class="basicBtnContents">
              <span class="material-icons">close</span>
            </div>
          </button>
        </div>
        <div class="seperator thin"></div>
        <div class="dialogue-details">
          <p class="mt-0">
            Select an attribute to increase for level {{ levelToProcess }}:
          </p>
          <attribute-selection
            :maxChoices="1"
            :selected="selected"
            :disabledChoices="disabledChoices"
            :character="character"
            @selectedUpdated="selectedUpdated"
          />
          <button
            :disabled="buttonDisabled"
            v-on:click="levelUpButton"
            type="button"
            class="btn roundedButton wide mt-16"
          >
            Level Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { adjustAttrsAPI } from "../../utils/attributeUtils";
import { ATTRIBUTES } from "../../utils/constants";
import AttributeSelection from "../CreatePage/AttributeSelection.vue";
export default {
  components: { AttributeSelection },
  name: "LevelUpModal",
  props: {
    character: Object,
  },
  data() {
    return {
      selected: [],
    };
  },
  mounted() {
    // When the user is using keyboard navigation, jump focus to modal
    document.getElementById("level-modal-first-interactive").focus();
  },
  computed: {
    ...mapState("character", ["levelsToProcess"]),
    levelToProcess() {
      return Math.floor(this.character.xp / 1000) - this.levelsToProcess + 1;
    },
    disabledChoices() {
      return ATTRIBUTES.filter(
        (attr) => this.character[attr] > Math.floor(this.levelToProcess / 2)
      );
    },
    buttonDisabled() {
      return this.selected.length === 0;
    },
  },
  methods: {
    exitModal() {
      this.selected = [];
      this.$store.commit(
        "character/setLevelsToProcess",
        this.levelsToProcess - 1
      );
    },
    selectedUpdated(selected) {
      this.selected = selected;
    },
    levelUpButton() {
      if (!this.buttonDisabled) {
        const attrs = {};
        attrs[this.selected[0]] = 1;
        adjustAttrsAPI(
          this.character,
          attrs,
          true,
          `Level up bonus for level ${this.levelToProcess}`
        );
        this.exitModal();
      }
    },
  },
};
</script>
