<template>
  <form>
    <label v-bind:for="adjustReasonID" class="labelText">
      Adjust {{ attrDisplayName }} Values:
    </label>
    <input
      type="text"
      v-on:keyup.enter="jumpToAdjustField"
      v-model="reason"
      placeholder="Reason for update (not required)"
      title="Press Enter to jump to the next field"
      v-bind:id="adjustReasonID"
      v-bind:class="inputAdjustFieldClass"
      class="input mt-4"
    />
    <div class="alignRow mt-4">
      <label v-bind:for="adjustFieldID" class="nowrap mr-8">
        Adjust (+/-) {{ attrDisplayName }}:
      </label>
      <input
        type="number"
        v-on:keyup.enter="adjustAttrFromAdjustField"
        v-model="adjust"
        placeholder="0"
        title="Press Enter to Submit"
        v-bind:id="adjustFieldID"
        v-bind:class="inputAdjustFieldClass"
        class="input"
      />
    </div>
    <p v-if="showError" class="errorText pt-12 mt-2 mb-2">{{ adjustError }}</p>
    <button
      v-if="submitBtn"
      v-bind:disabled="adjustButtonDisabled"
      type="button"
      v-on:click="adjustAttrFromAdjustField"
      class="btn roundedButton wide mt-4"
    >
      Submit Adjustment
    </button>
  </form>
</template>

<script>
import {
  getAttrDisplayName,
  generateDefaultAdjustMsg,
  calcLevelDiff,
  adjustAttrsObject,
} from "../../../utils/attributeUtils";
import {
  ATTRIBUTES,
  MIN_ATTRIBUTE_CAP,
  MAX_ATTRIBUTE_CAP,
} from "../../../utils/constants";

export default {
  name: "AdjustAttr",
  props: {
    character: Object,
    attr: String,
    loc: {
      type: String,
      default: "loc",
    },
    submitBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      reason: "",
      adjust: "",
    };
  },
  computed: {
    attrDisplayName() {
      return getAttrDisplayName(this.attr);
    },
    adjustReasonID() {
      return `${this.loc}-${this.attr}-adjustReason`;
    },
    adjustFieldID() {
      return `${this.loc}-${this.attr}-adjust`;
    },
    adjustVal() {
      const adjust = parseInt(this.adjust);
      return isNaN(adjust) ? 0 : adjust;
    },
    adjustError() {
      if (this.adjustVal === 0) {
        return `${this.adjust} must adjust current value`;
      }
      const val = this.character[this.attr] + this.adjustVal;
      const negativeAttrs = ATTRIBUTES + ["init", "sp"];
      if (!negativeAttrs.includes(this.attr) && val < 0) {
        return `${this.attrDisplayName} cannot be negative`;
      }
      if (ATTRIBUTES.includes(this.attr)) {
        if (val < MIN_ATTRIBUTE_CAP || val > MAX_ATTRIBUTE_CAP) {
          return `${this.attrDisplayName} cannot exceed attribute caps`;
        }
      }
      // We used to check if values like HP exceeded maximum value, but I think this is ok because that's
      // how you can handle having temp HP and things like that.
      if (this.reason.length > 300) {
        return "Reason is too long";
      }
      return false;
    },
    adjustButtonDisabled() {
      return this.adjustError !== false;
    },
    showError() {
      return this.adjustButtonDisabled && this.adjust !== "";
    },
    inputAdjustFieldClass() {
      return this.showError ? "invalid" : "";
    },
  },
  methods: {
    jumpToAdjustField() {
      document.getElementById(this.adjustFieldID).focus();
    },
    adjustAttrFromAdjustField() {
      const adjust = this.adjustVal;
      if (adjust !== false) {
        const attrs = {};
        attrs[this.attr] = adjust;
        let reason =
          this.reason !== ""
            ? this.reason
            : generateDefaultAdjustMsg(this.attr, adjust);
        const updateObject = adjustAttrsObject(this.character, attrs, true);
        if (updateObject.xp) {
          const levelDiff = calcLevelDiff(updateObject.xp, this.character.xp);
          if (levelDiff > 0) {
            console.log(levelDiff);
          }
        }
        this.$store.dispatch("character/updateAttributes", {
          id: this.character.id,
          updateObject,
          reason,
        });
        this.adjust = "";
        this.reason = "";
      }
    },
  },
};
</script>
