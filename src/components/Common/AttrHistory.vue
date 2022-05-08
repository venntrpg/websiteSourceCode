<template>
  <div>
    <div v-if="changelog.length !== 0" class="card column border">
      <div class="alignRow tableData tableHeader noBtn">
        <div class="logPrev headerFont">
          <b v-if="showDiff">Change</b>
          <b v-else>Prev Val</b>
        </div>
        <div class="logMsg headerFont">
          <b>Message</b>
        </div>
      </div>
      <div class="seperator thin"></div>
      <div
        v-for="(log, idx) in changelog"
        v-bind:key="idx"
        v-bind:title="`Updated at ${log.time}`"
        class="alignRow tableItems"
      >
        <div class="tableData">
          <div v-if="showDiff" class="logPrev">{{ log.diff }}</div>
          <div v-else class="logPrev">
            {{ log.prev ? log.prev : "-" }}
          </div>
          <div class="logMsg">{{ log.msg }}</div>
        </div>
      </div>
    </div>
    <div v-else class="mutedText">This Attribute has no history yet.</div>
  </div>
</template>

<script>
import { getMaxAttr } from "../../utils/attributeUtils";

export default {
  name: "AttrHistory",
  props: {
    character: Object,
    attr: String,
  },
  computed: {
    maxAttr() {
      return getMaxAttr(this.attr);
    },
    showDiff() {
      return (
        this.maxAttr !== undefined && this.character[this.maxAttr] !== undefined
      );
    },
    changelog() {
      if (!this.character.changelog) {
        return [];
      }
      const changelog = this.character.changelog
        .filter((log) => log.attr === this.attr)
        .map((log) => {
          let time = log.time;
          if (time < 1600000000000) {
            // js timestamps use milliseconds
            time *= 1000;
          }
          log.time = new Date(time).toLocaleString();
          return log;
        });
      if (this.showDiff) {
        changelog.reduceRight((prev, log) => {
          const newPrev = log.prev === undefined ? 0 : log.prev;
          log.diff = prev - newPrev;
          return newPrev;
        }, this.character[this.attr]);
      }
      return changelog;
    },
  },
};
</script>

<style scoped>
.logPrev {
  width: 30%;
}
.logMsg {
  width: 70%;
}
</style>
