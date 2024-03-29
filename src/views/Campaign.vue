<template>
  <div>
    <div v-bind:class="getHiddenSidebarClass" class="sideBar">
      <combat-stats :character="character" v-if="characterPage" />
      <div v-else>
        GM page side panel? Who knows what this will be used for!?
      </div>
    </div>
    <div v-bind:class="getHiddenSidebarClass" class="page sideBarPage">
      <campaign-screen v-if="characterPage || gmPage" />
      <campaign-options v-else :campaignName="campaignName" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import isUUID from "is-uuid";
import CombatStats from "../components/Common/CombatStats.vue";
import CampaignOptions from "../components/CampaignPage/CampaignOptions.vue";
import CampaignScreen from "@/components/CampaignPage/CampaignScreen.vue";

export default {
  name: "Campaign",
  data() {
    return {
      campaignId: "",
      characterId: "",
    };
  },
  components: {
    CombatStats,
    CampaignOptions,
    CampaignScreen,
  },
  beforeMount() {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      this.$router.push({ name: "Home" });
    }
    this.campaignId = this.$route.params.campaignId;
    if (
      !this.campaignId ||
      this.campaignId.charAt(0) !== "G" ||
      !isUUID.v4(this.campaignId.substring(1))
    ) {
      // campaignId is not valid, redirect to Home
      this.$router.push({ name: "Home" });
    }
    if (this.$route.params.characterId !== undefined) {
      this.characterId = this.$route.params.characterId;
    }
    if (!this.optionsPage && !this.gmPage && !this.characterPage) {
      // characterId is not valid, redirect to Home
      this.$router.push({ name: "Home" });
    }
  },
  mounted() {
    this.$store.dispatch("campaign/getCampaign", this.campaignId);
    if (this.characterPage) {
      if (
        this.characters !== {} &&
        this.characters[this.characterId] !== undefined
      ) {
        this.$store.commit(
          "character/setCharacter",
          this.characters[this.characterId]
        );
      } else {
        this.$store.dispatch("character/getCharacter", this.characterId);
      }
    }
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState("campaign", ["campaign"]),
    ...mapState("character", ["characters", "character"]),
    optionsPage() {
      return this.characterId === "";
    },
    gmPage() {
      return this.characterId === "gm";
    },
    characterPage() {
      return (
        this.characterId.charAt(0) === "C" &&
        isUUID.v4(this.characterId.substring(1))
      );
    },
    getHiddenSidebarClass() {
      return this.gmPage || this.characterPage ? "" : "hidden";
    },
    campaignName() {
      if (this.campaign && this.campaign.name) {
        return this.campaign.name;
      }
      return "";
    },
  },
};
</script>

<style></style>
