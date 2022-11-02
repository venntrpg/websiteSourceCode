<template>
  <div class="largePageWidth main">
    <h1 class="centeredText">{{ campaign.name }}</h1>
    <div v-if="isGm">
      <p>You are the GM!</p>
    </div>
    <h3>Members:</h3>
    <div class="card column border mt-8 mb-16">
      <div
        v-for="(role, user) in campaign.members"
        v-bind:key="user + role"
        class="tableItems noHeader padded"
      >
        <div>
          <div class="alignRow split">
            <div>
              <span class="labelText">{{ user }}:</span> <i>{{ role }}</i>
            </div>
            <select
              v-if="isOwner"
              v-model="campaign.members[user]"
              v-on:change="roleChanged(user)"
              class="input shortenned"
            >
              <option>spectator</option>
              <option>player</option>
              <option>GM</option>
            </select>
          </div>
          <div v-if="entitesByOwner[user]">
            <ul>
              <li
                v-for="(entity, index) in entitesByOwner[user]"
                v-bind:key="index"
              >
                {{ entity.name }}
                <span v-if="entity.gm_only" class="mutedText"> (Hidden)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOwner" class="card column padded mt-16 mb-16">
      <label for="campaign-invite-name">
        <h3 class="mt-0 mb-8">Invite new people</h3>
      </label>
      <div class="alignRow gap">
        <input
          type="text"
          placeholder="Username"
          v-model="inviteName"
          v-on:keyup.enter="inviteButton"
          id="campaign-invite-name"
          class="input"
        />
        <button
          type="button"
          v-bind:disabled="inviteName === ''"
          v-on:click="inviteButton"
          class="btn basicBtn"
        >
          <div class="basicBtnContents nowrap">Send request</div>
        </button>
      </div>
    </div>
    <div v-if="isGm">
      <div class="tall"></div>
      <router-link
        :to="{ name: 'Enemy', query: { campaign: campaign.id } }"
        class="btn basicBtn link"
      >
        <div class="basicBtnContents">Create Enemy for this campaign</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CampaignOptions",
  data() {
    return {
      inviteName: "",
    };
  },
  computed: {
    ...mapState(["username"]),
    ...mapState("campaign", ["campaign"]),
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
    entitesByOwner() {
      const map = {};
      if (this.campaign && this.campaign.entities) {
        Object.values(this.campaign.entities).forEach((entity) => {
          if (map[entity.owner]) {
            map[entity.owner].push(entity);
          } else {
            map[entity.owner] = [entity];
          }
        });
      }
      console.log(map);
      return map;
    },
  },
  methods: {
    inviteButton() {
      this.$store.dispatch("campaign/sendCampaignInvite", {
        campaginId: this.campaign.id,
        username: this.inviteName,
      });
      this.inviteName = "";
    },
    roleChanged(username) {
      this.$store.dispatch("campaign/setCampaignRole", {
        campaginId: this.campaign.id,
        username,
        role: this.campaign.members[username],
      });
    },
  },
};
</script>

<style scoped></style>
