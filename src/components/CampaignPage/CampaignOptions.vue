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
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CampaignOptions",
  computed: {
    ...mapState(["username", "campaign"]),
    isGm() {
      return this.campaign.members[this.username] === "GM";
    },
    isOwner() {
      return this.campaign.owner === this.username;
    },
  },
};
</script>

<style scoped></style>
