<template>
  <div>
    <button
      v-on:click="toggleVisible"
      class="btn roundedButton"
      v-bind:class="buttonClass"
      v-bind:disabled="disabled"
    >
      {{ buttonText }}
    </button>
    <div
      v-if="visible"
      v-on:click="closeClick"
      class="modal show"
      id="confirmation-modal"
    >
      <div class="dialogue card column">
        <div class="dialogue-content">
          <div class="alignRow split dialogue-title">
            <h2 class="mt-0 mb-0">{{ title }}</h2>
            <button v-on:click="toggleVisible" class="btn basicBtn">
              <div class="basicBtnContents">
                <span class="material-icons">close</span>
              </div>
            </button>
          </div>
          <div class="seperator thin"></div>
          <div class="dialogue-details">
            <!-- TODO: Could probably replace this with a slot maybe? -->
            {{ details }}
          </div>
          <div class="seperator thin"></div>
          <div class="alignRow end gap wrap dialogue-details">
            <button v-on:click="mainButton" class="btn roundedButton purple">
              {{ confStr }}
            </button>
            <button v-on:click="toggleVisible" class="btn roundedButton clear">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationModal",
  props: {
    buttonText: {
      type: String,
      default: "Delete",
    },
    buttonClass: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Are you sure?",
    },
    details: {
      type: String,
      default: "Are you sure?",
    },
    confStr: {
      type: String,
      default: "Yes",
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    visibleClass() {
      return this.visible ? "show" : "";
    },
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible;
    },
    mainButton() {
      this.$emit("mainButton");
      this.toggleVisible();
    },
    closeClick(event) {
      if (document.getElementById("confirmation-modal") === event.target) {
        this.toggleVisible();
      }
    },
  },
};
</script>
