<template>
  <div class="page">
    <home-page-logged-out v-if="!isLoggedIn" />
    <home-page-logged-in v-else />
  </div>
</template>

<script>
import HomePageLoggedOut from "../components/HomePage/HomePageLoggedOut.vue";
import HomePageLoggedIn from "../components/HomePage/HomePageLoggedIn.vue";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    HomePageLoggedOut,
    HomePageLoggedIn,
  },
  computed: {
    ...mapState(["isLoggedIn"]),
  },
};
</script>
