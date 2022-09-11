<template>
  <div class="largePageWidth">
    <h3>Your Characters</h3>
    <router-link
      v-for="(character, id) in filteredCharacters"
      v-bind:key="id"
      :to="{ name: 'Character', params: { id } }"
      class="btn basicBtn link"
    >
      <div class="basicBtnContents">
        <bullet :character="character" />
        {{ character.name }} - Level: {{ level(character.xp) }}
      </div>
    </router-link>
    <router-link to="/create" class="btn basicBtn link">
      <div class="basicBtnContents">
        <bullet />
        Create or Import a new character
      </div>
    </router-link>
    <h3>Your Campaigns</h3>
    <router-link
      v-for="(campaign, index) in campaigns"
      v-bind:key="index"
      :to="{ name: 'Campaign', params: { campaignId: campaign.id } }"
      class="btn basicBtn link"
    >
      <div class="basicBtnContents">
        <bullet />
        {{ campaign.name }}
      </div>
    </router-link>
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
    <h3>Your Cogs</h3>
    <router-link
      v-for="(enemy, id) in filteredEnemies"
      v-bind:key="id"
      :to="{ name: 'Character', params: { id } }"
      class="btn basicBtn link"
    >
      <div class="basicBtnContents">
        <bullet :character="enemy" />
        {{ enemy.name }} - Level:
        {{ enemy.level ? enemy.level : level(enemy.xp) }}
      </div>
    </router-link>
    <router-link to="/enemy" class="btn basicBtn link">
      <div class="basicBtnContents">
        <bullet />
        Create an enemy Cog
      </div>
    </router-link>
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
    this.$store.dispatch("character/listCharacters");
    this.$store.dispatch("campaign/listCampaigns");
    this.$store.dispatch("campaign/listCampaignInvites");
  },
  computed: {
    ...mapState("campaign", ["campaigns", "campaignInvites"]),
    ...mapState("character", ["characters"]),
    newCampaignButtonDisabled() {
      return this.campaignName === "";
    },
    filteredCharacters() {
      const chars = {};
      Object.entries(this.characters).forEach(([id, char]) => {
        if (!char.isEnemy) {
          chars[id] = char;
        }
      });
      return chars;
    },
    filteredEnemies() {
      const chars = {};
      Object.entries(this.characters).forEach(([id, char]) => {
        if (char.isEnemy) {
          chars[id] = char;
        }
      });
      return chars;
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
        this.$store.dispatch("campaign/createCampaign", {
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
