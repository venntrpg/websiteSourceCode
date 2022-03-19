<template>
  <div class="wide">
    <div v-if="showTitle">
      <h3 class="centeredText">{{ typeCopy.title }}</h3>
      <div class="seperator thin"></div>
    </div>
    <div class="textMargin">
      <p>{{ typeCopy.about }}</p>
      <ul v-if="typeCopy.details">
        <li v-for="detail in typeCopy.details" v-bind:key="detail">
          {{ detail }}
        </li>
      </ul>
      <p><b>Tactics:</b> {{ typeCopy.tactics }}</p>
      <ul v-if="typeCopy.tacticsExamples">
        <li v-for="example in typeCopy.tacticsExamples" v-bind:key="example">
          {{ example }}
        </li>
      </ul>
      <p><b>PKO:</b> {{ typeCopy.pko }}</p>
    </div>
  </div>
</template>

<script>
import { cogTypeCopy } from "./CogFlowUtils/CogTypeDescriptionUtils";

export default {
  name: "CogTypeDescription",
  props: {
    cogType: String,
    showTitle: {
      type: Boolean,
      default: true,
    },
    lvl: {
      type: String,
      default: "",
    },
  },
  computed: {
    typeCopy() {
      return cogTypeCopy(this.lvl, this.cogType);
    },
  },
};
</script>

<style scoped>
.wide {
  width: 100%;
}
.textMargin {
  margin: 16px;
  text-align: left;
  user-select: text; /* Allows users to highlight text for easier reading */
}
</style>
