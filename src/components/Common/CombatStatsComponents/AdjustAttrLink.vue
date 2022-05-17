<template>
  <router-link :to="attrModalLink" class="btn roundedButton">
    <div class="basicBtnContents">
      <span class="material-icons space">edit</span>
      Edit {{ attrFullName }} / History
    </div>
  </router-link>
</template>

<script>
import { getAttrFullName } from "../../../utils/attributeUtils";
export default {
  name: "AdjustAttrLink",
  props: {
    attr: String,
  },
  computed: {
    attrFullName() {
      return getAttrFullName(this.attr);
    },
    attrModalLink() {
      return {
        name: this.$route.name,
        params: this.$route.params,
        query: { attr: this.attr },
      };
    },
  },
};
</script>
