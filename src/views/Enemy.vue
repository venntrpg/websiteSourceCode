<template>
  <div>
    <cog-flow v-if="isCogSection" />
    <div v-else class="page">
      <div class="mediumPageWidth selectFlowContainer">
        <div class="selectFlow">
          <h1 class="centeredText">ENEMY CREATION</h1>
          <p>
            You can create a totally new character or import a character which
            you have already created.
          </p>
          <router-link
            :to="getLink('cog')"
            class="btn roundedButton wide topMargin"
          >
            Combat Cog Creation
          </router-link>
          <router-link
            :to="getLink('new')"
            class="btn roundedButton wide topMargin"
          >
            Enemy Character Creation
          </router-link>
          <router-link
            :to="getLink('import')"
            class="btn roundedButton wide topMargin"
          >
            Import Enemy
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import isUUID from "is-uuid";
import CogFlow from "../components/EnemyPage/CogFlow.vue";

// Constants
const NEW_SECTION = "new";
const IMPORT_SECTION = "import";
const COG_SECTION = "cog";

export default {
  name: "Create",
  components: { CogFlow },
  data() {
    return {
      campaignId: "",
    };
  },
  beforeMount() {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      this.$router.push({ name: "Home" });
    }
    this.campaignId = this.$route.query.campaign;
    if (this.campaignId) {
      if (
        this.campaignId.charAt(0) !== "G" ||
        !isUUID.v4(this.campaignId.substring(1))
      ) {
        // campaignId is not valid, redirect to Home
        this.$router.push({ name: "Home" });
      }
      if (!this.campaign || this.campaign.id !== this.campaignId) {
        this.$store.dispatch("campaign/getCampaign", this.campaignId);
      }
    }
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState("campaign", ["campaign"]),
    isNewSection() {
      return this.$route.params.section === NEW_SECTION;
    },
    isImportSection() {
      return this.$route.params.section === IMPORT_SECTION;
    },
    isCogSection() {
      return this.$route.params.section === COG_SECTION;
    },
  },
  methods: {
    getLink(page) {
      const link = { name: "Enemy", params: { section: page } };
      if (this.campaignId) {
        link.query = { campaign: this.campaignId };
      }
      return link;
    },
  },
};
</script>

<style scoped>
.selectFlowContainer {
  display: flex;
  justify-content: center;
}

.selectFlow {
  width: 320px;
}

.topMargin {
  margin-top: 16px;
}
</style>
