<template>
  <div class="subNavPage">
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav scroll">
      <div class="subNavGroup">
        <router-link
          :to="{ name: 'Character', params: { id, section: stats } }"
          class="btn navButton subNavButton statLink"
        >
          STATS
        </router-link>
        <router-link
          :to="{ name: 'Character', params: { id, section: abilities } }"
          class="btn navButton subNavButton"
        >
          ABILITIES
        </router-link>
        <router-link
          :to="{ name: 'Character', params: { id, section: inventory } }"
          class="btn navButton subNavButton"
        >
          INVENTORY
        </router-link>
      </div>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar">
      <CombatStats :character="character" />
    </div>
    <div v-bind:class="showRightSideBar" class="sideBar right">
      <RightSideBar />
    </div>
    <!--  --------------------- PAGE SUB ROUTER --------------------- -->
    <div v-bind:class="showRightSideBar" class="page sideBarPage">
      <div class="largePageWidth main" v-responsive="breakpoints">
        <Inventory v-if="inventoryPage" />
        <CombatStats v-else-if="statsPage" :character="character" />
        <Abilities v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ResponsiveDirective } from "vue-responsive-components";
import isUUID from "is-uuid";
import CombatStats from "../components/Common/CombatStats.vue";
import RightSideBar from "../components/CharacterPage/RightSideBar.vue";
import Abilities from "../components/CharacterPage/Abilities.vue";
import Inventory from "../components/CharacterPage/Inventory.vue";

const SECTION_STATS = "stats";
const SECTION_ABILITIES = "abilities";
const SECTION_INVENTORY = "inventory";

export default {
  name: "Character",
  components: {
    CombatStats,
    RightSideBar,
    Abilities,
    Inventory,
  },
  directives: {
    responsive: ResponsiveDirective,
  },
  data() {
    return {
      breakpoints: {
        bp750: (el) => el.width < 750,
        bp500: (el) => el.width < 500,
      },
      id: "",
    };
  },
  beforeMount() {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      this.$router.push({ name: "Home" });
    }
    this.id = this.$route.params.id;
    if (
      !this.id ||
      !["C", "E"].includes(this.id.charAt(0)) ||
      !isUUID.v4(this.id.substring(1))
    ) {
      // id is not valid, redirect to Home
      this.$router.push({ name: "Home" });
    }
  },
  mounted() {
    if (this.characters !== {} && this.characters[this.id] !== undefined) {
      this.$store.commit("setCharacter", this.characters[this.id]);
    } else {
      this.$store.dispatch("getCharacter", this.id);
    }
  },
  computed: {
    ...mapState(["isLoggedIn", "characters", "character"]),
    stats() {
      return SECTION_STATS;
    },
    abilities() {
      return SECTION_ABILITIES;
    },
    inventory() {
      return SECTION_INVENTORY;
    },
    statsPage() {
      // really only makes sense for mobile
      return this.$route.params.section === SECTION_STATS;
    },
    abilitiesPage() {
      return this.$route.params.section === SECTION_ABILITIES;
    },
    inventoryPage() {
      return this.$route.params.section === SECTION_INVENTORY;
    },
    showRightSideBar() {
      return (this.abilitiesPage || this.inventoryPage) &&
        this.$route.params.detail !== undefined
        ? "rightVisible"
        : "";
    },
  },
};
</script>

<style scoped>
.subNav.scroll {
  overflow-x: auto;
}
.subNavGroup {
  display: flex;
  align-items: center;
}
.statLink {
  display: none;
}

@media screen and (max-width: 1200px) {
  .sideBarPage.rightVisible {
    display: none;
  }
  .sideBar.right.rightVisible {
    width: calc(100% - var(--sidebar-width));
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}

@media screen and (max-width: 800px) {
  .statLink {
    display: block;
  }
  .sideBar:not(.right) {
    display: none;
  }
  .sideBarPage {
    margin-left: 0px;
  }
  .sideBar.right.rightVisible {
    width: 100%;
  }
}
</style>
