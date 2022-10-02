<template>
  <div>
    <level-up-modal v-if="showLevelUpModal" :character="character" />
    <attr-modal
      v-else-if="showAttrModal"
      :attr="attrToEdit"
      :character="character"
      :characterAttributes="characterAttributes"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AttrModal from "../Common/AttrModal.vue";
import LevelUpModal from "./LevelUpModal.vue";
import { attrIsEditable } from "../../api/apiUtil";
export default {
  components: { AttrModal, LevelUpModal },
  name: "CharacterModals",
  props: {
    character: Object,
    characterAttributes: Object,
  },
  computed: {
    ...mapState("character", ["levelsToProcess"]),
    showLevelUpModal() {
      return this.levelsToProcess > 0;
    },
    attrToEdit() {
      return this.$route.query.attr;
    },
    showAttrModal() {
      return (
        this.attrToEdit !== undefined && attrIsEditable(this.$route.query.attr)
      );
    },
  },
};
</script>
