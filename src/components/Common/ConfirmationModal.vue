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
    <div class="modal" v-bind:class="visibleClass">
      <div class="dialogue card column">
        <div class="dialogue-content">
          <div class="alignRow split dialogue-title">
            <h2>{{ title }}</h2>
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
          <div class="alignRow end gap dialogue-details">
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
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: none;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10; /* Needs to sit on top of everything else */
}

.modal.show {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.dialogue {
  width: 500px;
  margin: 8px;
  margin-top: 80px;
  border: 1px solid var(--gray-700);
}

.dialogue-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dialogue-title {
  margin-left: 16px;
  margin-right: 16px;
}

.dialogue-details {
  margin: 16px;
}
</style>
