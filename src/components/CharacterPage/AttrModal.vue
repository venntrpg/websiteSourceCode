<template>
  <div class="modal show">
    <div class="dialogue card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0">Title</h2>
          <router-link :to="exitRoute" class="btn basicBtn">
            <div class="basicBtnContents">
              <span class="material-icons">close</span>
            </div>
          </router-link>
        </div>
        <div class="seperator thin"></div>
        <div class="dialogue-details">
          <!-- TODO: Could probably replace this with a slot maybe? -->
          Details
        </div>
        <div class="seperator thin"></div>
        <div class="alignRow end gap wrap dialogue-details">
          <router-link :to="exitRoute" class="btn roundedButton clear">
            Close
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAttrFullName,
  getAttrDisplayName,
} from "../../utils/attributeUtils";

export default {
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
  },
};
</script>
