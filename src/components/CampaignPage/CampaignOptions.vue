<template>
  <div>
    <h1 class="centeredText">{{ campaign.name }}</h1>
    <div v-if="isGm">
      <p>You are the GM!</p>
    </div>
    <p>Members:</p>
    <div v-for="(role, user) in campaign.members" v-bind:key="user">
      {{ user }}: {{ role }}
    </div>
    <div v-if="isOwner">
      <p>Invite new people</p>
    </div>
    <div class="tall"></div>
    <router-link
      :to="{ name: 'Enemy', query: { campaign: campaign.id } }"
      class="btn basicBtn link"
    >
      <div class="basicBtnContents">Create Enemy for this campaign</div>
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CampaignOptions",
  computed: {
    ...mapState(["username", "campaign"]),
    isGm() {
      return (
        this.campaign &&
        this.campaign.members &&
        this.campaign.members[this.username] === "GM"
      );
    },
    isOwner() {
      return this.campaign && this.campaign.owner === this.username;
    },
  },
};
</script>

<style scoped></style>
