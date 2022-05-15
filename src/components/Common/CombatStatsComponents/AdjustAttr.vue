<template>
  <div>
    <label v-bind:for="adjustReasonID" class="attrHeaderMargin">
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
    <button
      v-if="submitBtn"
      v-bind:disabled="adjustButtonDisabled"
      type="button"
      v-on:click="adjustAttrFromAdjustField"
      class="btn roundedButton wide mt-4"
    >
      Submit Adjustment
    </button>
  </div>
</template>

<script>
import {
  getAttrDisplayName,
  adjustAttrsAPI,
} from "../../../utils/attributeUtils";

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
    validateAdjustField() {
      const adjust = parseInt(this.adjust);
      if (isNaN(adjust) || adjust === 0) {
        return false;
      }
      const val = this.character[this.attr] + adjust;
      if (this.attr !== "init" && val < 0) {
        return false;
      }
      /*
      // NOTE: COMMENTED OUT FOR NOW SINCE I THINK THIS IS ACTUALLY OK
      if (["hp", "mp", "vim", "hero"].includes(attr)) {
        if (this.getAttrMaxValue(attr) && val > this.getAttrMaxValue(attr)) {
          return false;
        }
      }
      */
      if (this.reason.length > 300) {
        return false;
      }
      return adjust;
    },
    inputAdjustFieldClass() {
      return this.validateAdjustField === false && this.adjust !== ""
        ? "invalid"
        : "";
    },
    adjustButtonDisabled() {
      return this.validateAdjustField === false;
    },
  },
  methods: {
    jumpToAdjustField() {
      document.getElementById(this.adjustFieldID).focus();
    },
    adjustAttrFromAdjustField() {
      const adjust = this.validateAdjustField;
      if (adjust !== false) {
        const attrs = {};
        attrs[this.attr] = adjust;
        adjustAttrsAPI(
          this.character,
          attrs,
          this.propegateChanges,
          this.reason
        );
        this.adjust = "";
        this.reason = "";
      }
    },
  },
};
</script>
