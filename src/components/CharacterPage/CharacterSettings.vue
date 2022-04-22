<template>
  <div>
    <h1>Settings</h1>
    <p>
      This page will have togglable switches for turning off/on different
      courses on <i>this</i> character sheet. Once campaigns are more
      implemented, we will default to the course settings defined there.
    </p>
    <div class="seperator mb-64 mt-64"></div>
    <copyable-character :character="character" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import CopyableCharacter from "../Common/CopyableCharacter.vue";
export default {
  components: { CopyableCharacter },
  name: "CharacterSettings",
  computed: {
    ...mapState("character", ["character"]),
  },
};
</script>
