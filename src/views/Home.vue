<template>
  <div class="page">
    <HomePageLoggedOut v-if="!isLoggedIn" />
    <HomePageLoggedIn v-else />
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
