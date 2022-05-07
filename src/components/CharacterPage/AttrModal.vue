<template>
  <div v-on:click="closeClick" class="modal show" id="attribute-modal">
    <div class="dialogue lg card column">
      <div class="dialogue-content">
        <div class="alignRow split dialogue-title">
          <h2 class="mt-0 mb-0">Edit {{ attrFullName }}</h2>
          <router-link :to="exitRoute" class="btn basicBtn">
            <div class="basicBtnContents">
              <span class="material-icons">close</span>
            </div>
          </router-link>
        </div>
        <div class="seperator thin"></div>
        <div class="dialogue-details">
          <h3 class="mt-0">{{ attrDisplayName }} History</h3>
          <div v-if="changelog.length !== 0" class="card column border">
            <div class="alignRow tableData tableHeader noBtn">
              <div class="logPrev headerFont">
                <b>Prev Val</b>
              </div>
              <div class="logMsg headerFont">
                <b>Message</b>
              </div>
              <div class="logTime headerFont">
                <b>Time</b>
              </div>
            </div>
            <div class="seperator thin"></div>
            <div
              v-for="(log, idx) in changelog"
              v-bind:key="idx"
              class="alignRow tableItems"
            >
              <div class="tableData">
                <div class="logPrev">
                  {{ log.prev ? log.prev : "-" }}
                </div>
                <div class="logMsg">{{ log.msg }}</div>
                <div class="logTime">{{ log.time }}</div>
              </div>
            </div>
          </div>
          <div v-else class="mutedText">This Attribute has no history yet.</div>
          <h3>Current {{ attrDisplayName }}: {{ character[attr] }}</h3>
          <div class="seperator thin mb-8"></div>
          <div class="alignRow split top">
            <adjust-attr
              :attr="attr"
              :character="character"
              loc="modal"
              :submitBtn="true"
            />
            <div>Hi 2</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
TODO: move history to left side of modal - reset history & full heal button below. Adjust buttons should go on right
*/
import {
  getAttrFullName,
  getAttrDisplayName,
} from "../../utils/attributeUtils";
import AdjustAttr from "../Common/CombatStatsComponents/AdjustAttr.vue";

export default {
  components: { AdjustAttr },
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
    changelog() {
      if (!this.character.changelog) {
        return [];
      }
      return this.character.changelog
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
    },
  },
  methods: {
    closeClick(event) {
      if (document.getElementById("attribute-modal") === event.target) {
        this.$router.push(this.exitRoute);
      }
    },
  },
};
</script>

<style scoped>
.logPrev {
  width: 15%;
}
.logMsg {
  width: 60%;
}
.logTime {
  width: 25%;
}
</style>
