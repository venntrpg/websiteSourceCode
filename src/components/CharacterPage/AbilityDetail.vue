<template>
  <div>
    <div v-if="ability !== undefined">
      <display-basic-ability-details :ability="ability" />
      <button
        v-if="showUseAbilityButton"
        :disabled="!canUseAbility"
        class="btn roundedButton wide mb-16"
      >
        Use ability
      </button>
      <h3>Additional Details</h3>
      <div class="mb-16">
        <b>Cost:</b> {{ ability.purchase }}
        <i v-if="actualCost">(Actual cost: {{ actualCost }} XP)</i>
      </div>
      <div v-if="ability.expedited" class="mt-16">
        <b>Expedited for:</b> {{ ability.expedited }}
      </div>
      <div v-if="ability.unlocks" class="mt-16">
        <b>Unlocks:</b> {{ ability.unlocks }}
      </div>
      <div v-if="ability.partial_unlocks" class="mt-16">
        <b>Partially Unlocked:</b> {{ ability.partial_unlocks }}
      </div>
      <div v-if="ability.prereq" class="mt-16">
        <b>Prerequisite:</b> {{ ability.prereq }}
      </div>
      <div v-if="ability.not_required" class="mt-16">
        This ability is not required for the Path Completion Bonus.
      </div>
      <div class="alignRow gap">
        <div><b>Comment:</b></div>
        <button
          v-on:click="commentButton()"
          title="Add a personal comment to this ability. Useful for tracking details, like how often you've used it during combat, or any special effects it may have."
          class="btn basicBtn"
        >
          <div class="basicBtnContents">
            <span class="material-icons">chat</span>
          </div>
        </button>
      </div>
      <div v-if="!editComment && ability.comment">
        <p class="textBlock mt-0">{{ ability.comment }}</p>
      </div>
      <div v-if="editComment">
        <textarea
          placeholder="Comment"
          v-model="ability.comment"
          class="input textInput"
        ></textarea>
        <button v-on:click="saveComment()" class="btn roundedButton">
          Save
        </button>
      </div>
      <div class="seperator mt-24 mb-24"></div>
      <button v-on:click="settingsButton()" class="btn basicBtn wide">
        <div class="basicBtnContents">
          <span class="material-icons space">settings</span>
          Ability Settings
        </div>
      </button>
      <div v-if="showSettings" class="card column padded">
        <div v-if="!ability.special_ability_type">
          <h3 class="mt-0">Refresh Ability</h3>
          <p class="textBlock mt-0">
            Is this ability outdated from the same ability in the wiki? This
            button will refresh the ability to match the wiki again. WARNING: if
            the ability does not exist on the wiki, this ability will be
            deleted!
          </p>
          <button v-on:click="refreshButton()" class="btn basicBtn wide">
            <div class="basicBtnContents">
              <span class="material-icons space">refresh</span>
              Refresh Ability
            </div>
          </button>
          <div class="seperator mt-24 mb-24"></div>
        </div>
        <h3 class="mt-0">Delete Ability</h3>
        <p class="textBlock mt-0">
          No longer want this ability? Delete it here.
        </p>
        <button v-on:click="deleteButton()" class="btn basicBtn wide">
          <div class="basicBtnContents">
            <span class="material-icons space">delete</span>
            Delete Ability
          </div>
        </button>
      </div>
      <div class="tall"></div>
    </div>
    <div v-else-if="character !== undefined">
      Could not find this ability ¯\_(ツ)_/¯
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DisplayBasicAbilityDetails from "../Common/Abilities/DisplayBasicAbilityDetails.vue";
import { actualCost, canUseAbility } from "../../utils/abilityUtils";

export default {
  name: "abilityDetail",
  components: { DisplayBasicAbilityDetails },
  data() {
    return {
      editComment: false,
      showSettings: false,
    };
  },
  computed: {
    ...mapState("character", ["character"]),
    ability() {
      if (this.character.abilities === undefined) {
        return undefined;
      }
      return this.character.abilities.find(
        (searchAbility) => searchAbility.name === this.$route.params.detail
      );
    },
    showUseAbilityButton() {
      return !(this.ability && this.ability.cost && this.ability.cost.Passive);
    },
    canUseAbility() {
      return canUseAbility(this.character, this.ability);
    },
    actualCost() {
      const cost = actualCost(this.character, this.ability);
      if (cost === parseInt(this.ability.purchase)) {
        return false;
      }
      return cost;
    },
  },
  methods: {
    commentButton() {
      this.editComment = !this.editComment;
    },
    saveComment() {
      this.$store.dispatch("character/updateAbilityComment", {
        id: this.character.id,
        name: this.ability.name,
        comment: this.ability.comment,
      });
      this.editComment = false;
    },
    settingsButton() {
      this.showSettings = !this.showSettings;
    },
    refreshButton() {
      this.$store.dispatch("character/refreshAbility", {
        id: this.character.id,
        name: this.ability.name,
      });
      this.showSettings = false;
    },
    deleteButton() {
      this.$store.dispatch("character/removeAbility", {
        id: this.character.id,
        name: this.ability.name,
      });
    },
  },
};
</script>
