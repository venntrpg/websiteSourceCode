<template>
  <div id="character-page" class="subNavPage">
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav scroll">
      <div class="alignRow">
        <router-link
          :to="{ name: 'Character', params: { id, section: stats } }"
          title="Character stats"
          class="btn navButton subNavButton statLink"
        >
          <span class="material-icons">bar_chart</span>
        </router-link>
        <router-link
          :to="{ name: 'Character', params: { id, section: abilities } }"
          title="Abilities (a)"
          class="btn navButton subNavButton"
        >
          <span class="material-icons">hiking</span>
        </router-link>
        <router-link
          :to="{ name: 'Character', params: { id, section: inventory } }"
          title="Inventory (i)"
          class="btn navButton subNavButton"
        >
          <span class="material-icons">shopping_bag</span>
        </router-link>
        <router-link
          :to="{ name: 'Character', params: { id, section: settings } }"
          title="Character Settings (h)"
          class="btn navButton subNavButton"
        >
          <span class="material-icons">settings</span>
        </router-link>
      </div>
      <div class="alignRow">
        <button
          v-on:click="toggleNotes()"
          title="Show Character notes (n)"
          class="btn navButton subNavButton"
        >
          <span class="material-icons">edit_note</span>
        </button>
        <div v-if="fullScreenAvailable" v-bind:key="fullscreenUpdateKey">
          <button
            v-if="isFullsceen()"
            v-on:click="tryFullscreen()"
            title="Enter fullscreen mode (f)"
            class="btn navButton subNavButton"
          >
            <span class="material-icons">fullscreen</span>
          </button>
          <button
            v-else
            v-on:click="tryFullscreen()"
            title="Exit fullscreen mode (f)"
            class="btn navButton subNavButton"
          >
            <span class="material-icons">fullscreen_exit</span>
          </button>
        </div>
      </div>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div class="sideBar">
      <combat-stats :character="character" :showItems="shopPage" />
    </div>
    <div v-bind:class="showRightSideBar" class="sideBar right">
      <right-side-bar />
    </div>
    <!--  --------------------- PAGE SUB ROUTER --------------------- -->
    <div v-bind:class="showRightSideBar" class="page sideBarPage">
      <div class="largePageWidth main mb-256" v-responsive="breakpoints">
        <inventory v-if="inventoryPage" />
        <item-shop v-else-if="shopPage" />
        <character-settings v-else-if="settingsPage" />
        <combat-stats v-else-if="statsPage" :character="character" />
        <abilities v-else />
      </div>
    </div>
    <notes v-if="showNotes" @toggleNotes="toggleNotes" />
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
import ItemShop from "../components/CharacterPage/ItemShop.vue";
import CharacterSettings from "../components/CharacterPage/CharacterSettings.vue";
import Notes from "../components/CharacterPage/Notes.vue";

const SECTION_STATS = "stats";
const SECTION_ABILITIES = "abilities";
const SECTION_INVENTORY = "inventory";
const SECTION_SETTINGS = "settings";
const SECTION_SHOP = "shop";

export default {
  name: "Character",
  components: {
    CombatStats,
    RightSideBar,
    Abilities,
    Inventory,
    ItemShop,
    CharacterSettings,
    Notes,
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
      showNotes: false,
      fullscreenUpdateKey: 0,
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
      this.$store.commit("character/setCharacter", this.characters[this.id]);
    } else {
      this.$store.dispatch("character/getCharacter", this.id);
    }
  },
  created() {
    window.addEventListener("keypress", this.keyMapper);
  },
  destroyed() {
    window.removeEventListener("keypress", this.keyMapper);
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    ...mapState("character", ["characters", "character"]),
    stats() {
      return SECTION_STATS;
    },
    abilities() {
      return SECTION_ABILITIES;
    },
    inventory() {
      return SECTION_INVENTORY;
    },
    settings() {
      return SECTION_SETTINGS;
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
    shopPage() {
      return this.$route.params.section === SECTION_SHOP;
    },
    settingsPage() {
      return this.$route.params.section === SECTION_SETTINGS;
    },
    showRightSideBar() {
      return (this.abilitiesPage || this.inventoryPage) &&
        this.$route.params.detail !== undefined
        ? "rightVisible"
        : "";
    },
    fullScreenAvailable() {
      return document.fullscreenEnabled;
    },
  },
  methods: {
    isFullsceen() {
      return document.fullscreenElement === null;
    },
    updateFullscreenKey() {
      this.fullscreenUpdateKey = this.fullscreenUpdateKey + 1;
    },
    keyMapper(e) {
      const src = e.srcElement.localName;
      if (["button", "input", "textarea"].includes(src)) {
        // do not override key inputs from regular text inputs
        return;
      }
      switch (e.code) {
        case "KeyF":
          this.tryFullscreen();
          break;
        case "KeyN":
          this.toggleNotes();
          break;
        case "KeyA":
          this.$router.push({
            name: "Character",
            params: { id: this.id, section: SECTION_ABILITIES },
          });
          break;
        case "KeyI":
          this.$router.push({
            name: "Character",
            params: { id: this.id, section: SECTION_INVENTORY },
          });
          break;
        case "KeyH":
          this.$router.push({
            name: "Character",
            params: { id: this.id, section: SECTION_SETTINGS },
          });
          break;
        case "KeyS":
          this.$router.push({
            name: "Character",
            params: { id: this.id, section: SECTION_SHOP },
          });
          break;
      }
    },
    tryFullscreen() {
      if (this.fullScreenAvailable) {
        if (this.isFullsceen()) {
          document
            .getElementById("character-page")
            .requestFullscreen()
            .then(() => this.updateFullscreenKey());
        } else {
          document.exitFullscreen().then(() => this.updateFullscreenKey());
        }
      }
    },
    toggleNotes() {
      this.showNotes = !this.showNotes;
    },
  },
};
</script>

<style scoped>
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
