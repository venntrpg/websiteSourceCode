<template>
  <div class="largePageWidth">
    <h3>Your Characters</h3>
    <div>
      <router-link
        v-for="(character, id) in characters"
        v-bind:key="id"
        :to="{ name: 'Character', params: { id } }"
        class="btn basicBtn link"
      >
        <div class="basicBtnContents">
          <Bullet :character="character" />
          {{ character.name }} - Level: {{ level(character.xp) }}
        </div>
      </router-link>
      <router-link to="/create" class="btn basicBtn link">
        <div class="basicBtnContents">
          <Bullet />
          Create or Import a new character
        </div>
      </router-link>
    </div>
    <h3>Your Campaigns</h3>
    <div>
      <router-link
        v-for="(campaign, index) in campaigns"
        v-bind:key="index"
        :to="{ name: 'Campaign', params: { campaignId: campaign.id } }"
        class="btn basicBtn link"
      >
        <div class="basicBtnContents">
          <Bullet />
          {{ campaign.name }}
        </div>
      </router-link>
    </div>
    <label for="campaign-input">Create a New Campaign</label>
    <div class="alignRow">
      <input
        placeholder="New Campaign Name"
        v-model="campaignName"
        v-on:keyup.enter="newCampaignButton()"
        id="campaign-input"
        class="input campaignInput"
      />
      <button
        v-on:click="newCampaignButton()"
        :disabled="newCampaignButtonDisabled"
        class="btn roundedButton campaignButton"
      >
        Make New Campaign
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Bullet from "../Common/Bullet.vue";

export default {
  name: "HomePageLoggedIn",
  components: {
    Bullet,
  },
  data() {
    return {
      campaignName: "",
    };
  },
  mounted() {
    this.$store.dispatch("listCharacters");
    this.$store.dispatch("listCampaigns");
    this.$store.dispatch("listCampaignInvites");
  },
  computed: {
    ...mapState(["characters", "campaigns", "campaignInvites"]),
    newCampaignButtonDisabled() {
      return this.campaignName === "";
    },
  },
  methods: {
    level(xp) {
      const level = Math.floor(xp / 1000);
      // if xp < 1000, still return level 1
      return level <= 0 ? 1 : level;
    },
    newCampaignButton() {
      if (!this.newCampaignButtonDisabled) {
        this.$store.dispatch("createCampaign", {
          name: this.campaignName,
          redirectToCampaign: true,
        });
      }
    },
  },
};
</script>

<style scoped>
.alignRow {
  margin-top: 8px;
}
.campaignInput {
  max-width: 500px;
}
.campaignButton {
  width: 300px;
  margin-left: 8px;
  flex-shrink: 0;
}

@media screen and (max-width: 600px) {
  .alignRow {
    flex-direction: column;
  }
  .campaignInput {
    max-width: 100%;
  }
  .campaignButton {
    margin-top: 8px;
    margin-left: 0px;
    width: calc(100% - 20px);
  }
}
</style>
