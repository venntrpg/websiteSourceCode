<template>
  <div>
    <button v-on:click="toggleVisible" class="btn roundedButton">
      {{ buttonText }}
    </button>
    <div class="modal" v-bind:class="visibleClass">
      <div class="dialogue card column">
        <div class="dialogue-content">
          <div class="alignRow split dialogue-title">
            <h2 class="mt-0 mb-0">Title</h2>
            <button v-on:click="toggleVisible" class="btn basicBtn">
              <div class="basicBtnContents">
                <span class="material-icons">close</span>
              </div>
            </button>
          </div>
          <div class="seperator thin"></div>
          <div class="dialogue-details">
            <!-- TODO: Could probably replace this with a slot maybe? -->
            Details
          </div>
          <div class="seperator thin"></div>
          <div class="alignRow end gap wrap dialogue-details">
            <button v-on:click="toggleVisible" class="btn roundedButton clear">
              Close
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
    character: Object,
    attr: String,
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
      this.toggleVisible();
    },
  },
};
</script>
