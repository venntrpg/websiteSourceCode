<template>
  <div>
    <!--  --------------------- SUB NAV --------------------- -->
    <div class="subNav">
      <button
        v-on:click="createNavButton()"
        v-bind:class="getMobileSidebarClass"
        class="btn navButton subNavButton noSelect createNavButton"
      >
        CREATE CHARACTER
      </button>
      <button
        v-on:click="statsNavButton()"
        v-bind:class="getMobileSidebarClass"
        class="btn navButton subNavButton noSelect statsNavButton"
      >
        SHOW STATS
      </button>
    </div>
    <!--  --------------------- SIDE BAR --------------------- -->
    <div
      class="sideBar"
      v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]"
    >
      <CombatStats :character="createCharacter" :showItems="true" />
    </div>
    <!--  --------------------- START OF CHARACTER CREATION FLOW --------------------- -->
    <div
      class="page sideBarPage"
      v-bind:class="[getHiddenSidebarClass, getMobileSidebarClass]"
    >
      <div class="largePageWidth main" v-responsive="breakpoints">
        <h1 class="centeredText">CREATE NEW CHARACTER</h1>
        <p class="textBlock">
          Current version:
          <a
            href="https://vennt.fandom.com/wiki/Character_Creation?oldid=4426"
            target="_blank"
            class="link"
          >
            Revision as of 16:44, 15 March 2022
          </a>
        </p>
        <!-- ----- STEP 1 ----- -->
        <h2>Step 1: Choose a name</h2>
        <p class="textBlock">
          This follows the guide on the
          <a
            href="https://vennt.fandom.com/wiki/Character_Creation"
            target="_blank"
            class="link"
          >
            character creation wiki page</a
          >.
        </p>
        <label for="new-name">
          <p class="textBlock">
            Choose a name for your character. You can always come back to this
            step later. Or, press the button to generate a random name for now.
          </p>
        </label>
        <div class="alignRow mt-4 nameRow">
          <input
            type="text"
            name="charName"
            placeholder="Bilbo Baggins"
            class="input nameInput"
            id="new-name"
            v-model="create.name"
          />
          <button
            v-on:click="randomNameButton()"
            class="btn roundedButton randomNameButton"
            :disabled="randomNamesDisabled"
          >
            <div class="btnContents">
              <span class="material-icons">refresh</span> Random name
            </div>
          </button>
        </div>
        <!-- ----- STEP 2 ----- -->
        <h2>Step 2: Create your backstory</h2>
        <p class="textBlock">
          For now, this process must be completed in a seperate document. Follow
          <a
            href="https://vennt.fandom.com/wiki/Backstory"
            target="_blank"
            class="link"
          >
            this wiki page
          </a>
          for help with coming up a character concept and describing your
          backstory.
        </p>
        <!-- ----- STEP 3 ----- -->
        <h2>Step 3: Choose a Gift</h2>
        <p class="textBlock">
          <i>
            Most legends are born gifted in some way. Mozart was gifted in
            music, Achilles was gifted in combat, and Merlin was gifted in
            magic. There are nine gifts available to choose from as a hero of
            Amnis, each one providing unique boons to your character.
          </i>
        </p>
        <GiftSelection :gift="create.gift" @giftUpdated="giftUpdated" />
        <!-- ----- STEP 4 ----- -->
        <h2>Step 4: Attribute scores</h2>
        <p>In this step, you select your base attributes.</p>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">
            1. Select three attributes you used most as a child.
          </p>
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.childAttrs"
            :maxChoices="3"
            @selectedUpdated="childAttrsUpdated"
          />
        </div>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">
            2. Select three attributes you used most in the last six years.
          </p>
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.adultAttrs"
            :maxChoices="3"
            @selectedUpdated="adultAttrsUpdated"
          />
        </div>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">3. Choose one:</p>
          <RadioButtonSelection
            :options="getAdditionalAttrChoiceOptions"
            :selected="create.additionalAttrChoice"
            @selectedUpdated="additionalAttrChoiceUpdated"
          />
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.additionalAttrs"
            :maxChoices="maxAdditionalAttrsChoices"
            :disabledChoices="blockAdditionalAttrsChoices"
            @selectedUpdated="additionalAttrsUpdated"
          />
        </div>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">
            4. Subtract 1 from one Attribute that is currently at 0, if one
            exists. You may pick any Attribute from amongst those at 0, but if
            your character is...
          </p>
          <ul>
            <li>Inattentive... ...You might want to pick PER.</li>
            <li>A luddite... ...You might want to pick TEK.</li>
            <li>Clumsy... ...You might want to pick DEX.</li>
            <li>Ignorant... ...You might want to pick INT.</li>
            <li>Impatient... ...You might want to pick WIS.</li>
            <li>Sluggish... ...You might want to pick AGI.</li>
            <li>Apathetic... ...You might want to pick SPI.</li>
            <li>Weak... ...You might want to pick STR.</li>
            <li>Repulsive... ...You might want to pick CHA.</li>
          </ul>
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.badAttrs"
            :maxChoices="1"
            :disabledChoices="blockBadAttrsChoices"
            @selectedUpdated="badAttrsUpdated"
          />
        </div>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">
            5. Select an attribute that corresponds to your first grate. This
            will subtract 1 from the selected attribute. (Optional, requires the
            <a
              href="https://vennt.fandom.com/wiki/Course_of_Flux"
              target="_blank"
              class="link"
              >Course of Flux</a
            >)
          </p>
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.grate1"
            :maxChoices="1"
            @selectedUpdated="grate1Updated"
          />
          <div class="seperator mt-16 mb-16"></div>
          <p class="textBlock mt-0">
            Select an attribute that corresponds to your third grate. This will
            add 1 to the selected attribute. (Optional, requires the
            <a
              href="https://vennt.fandom.com/wiki/Course_of_Flux"
              target="_blank"
              class="link"
              >Course of Flux</a
            >)
          </p>
          <AttributeSelection
            :attributes="validAttributes"
            :selected="create.grate3"
            :maxChoices="1"
            @selectedUpdated="grate3Updated"
          />
        </div>
        <!-- ----- STEP 5 ----- -->
        <h2>Step 5: Decide your Quests</h2>
        <p class="textBlock">
          Set 1-3
          <a
            href="https://vennt.fandom.com/wiki/Quests"
            target="_blank"
            class="link"
          >
            Quests
          </a>
          for your character. For help inventing a character concept, see
          <a
            href="https://vennt.fandom.com/wiki/Character_Concept_Help"
            target="_blank"
            class="link"
          >
            this page</a
          >. Note: this data cannot be stored here, so you should keep this in
          your Google Sheet.
        </p>
        <!-- ----- STEP 6 ----- -->
        <h2>Step 6: Beginner Boons</h2>
        <p class="textBlock">
          This section helps you figure out what equipment you have on you.
        </p>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">1. What do you keep at your side?</p>
          <RadioButtonSelection
            :options="getSideEquipmentOptions"
            :selected="create.sideItem"
            @selectedUpdated="sideItemUpdated"
          />
          <div v-if="showRememberOptions">
            <p>Select "Something to Remember" benefit:</p>
            <RadioButtonSelection
              :options="getRememberOptions"
              :selected="create.rememberItem"
              @selectedUpdated="rememberItemUpdated"
            />
          </div>
        </div>
        <div class="card column padded mb-24">
          <p class="textBlock mt-0">2. Describe your outfit.</p>
          <p class="textBlock">
            This is your starting Item Container. If you buy another item
            container, it replaces this one.
          </p>
          <RadioButtonSelection
            :options="getOutfitOptions"
            :selected="create.outfit"
            @selectedUpdated="outfitUpdated"
          />
        </div>
        <div class="card column padded">
          <p class="textBlock mt-0">3. What did you bring with you?</p>
          <RadioButtonSelection
            :options="getItemSetOptions"
            :selected="create.itemSet"
            @selectedUpdated="itemSetUpdated"
          />
        </div>
        <!-- ----- STEP 7 ----- -->
        <h2>Step 7: XP and Abilities</h2>
        <div class="card column padded">
          <p class="textBlock mt-0">Are you new to adventuring?</p>
          <RadioButtonSelection
            :options="getInexperiencedOptions"
            :selected="getInexperiencedOption"
            @selectedUpdated="experienceUpdated"
          />
        </div>
        <p class="textBlock">
          For now, you need to go to the Character page to select abilities and
          buy / sell items
        </p>
        <!-- ----- STEP 8 ----- -->
        <h2>Step 8: Finish the character</h2>
        <p class="textBlock">
          Click the "Create Character" button to officially create the
          character.
        </p>
        <p class="textBlock">
          Click the "Clear Character" button to delete this character and start
          again.
        </p>
        <div class="alignRow gap wrap split mt-8 mb-128">
          <confirmation-modal
            :buttonText="'Create Character'"
            :confStr="'Create Character'"
            :details="'Are you sure you are done editing this character? Most fields will still be editable once you save this character to the server.'"
            @mainButton="createCharacterButton"
          />
          <confirmation-modal
            :buttonText="'Clear Character'"
            :buttonClass="'clear'"
            :confStr="'Delete Character'"
            :details="'Are you sure you want to delete your progress on this character? It will not be saved.'"
            @mainButton="clearCharacter"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ResponsiveDirective } from "vue-responsive-components";
import { mapState } from "vuex";
import AttributeSelection from "./AttributeSelection.vue";
import CombatStats from "../Common/CombatStats.vue";
import GiftSelection from "./GiftSelection.vue";
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import ConfirmationModal from "../Common/ConfirmationModal.vue";
import { keys2Items } from "../Common/Util/ItemUtils";
import { ATTRIBUTES, CHAR_LOCAL_STORAGE } from "../../utils/constants";

export default {
  name: "NewFlow",
  components: {
    AttributeSelection,
    CombatStats,
    GiftSelection,
    RadioButtonSelection,
    ConfirmationModal,
  },
  directives: {
    responsive: ResponsiveDirective,
  },
  data() {
    return {
      showingStats: false,
      breakpoints: {
        bp900: (el) => el.width < 900,
        bp600: (el) => el.width < 600,
      },
      // Stats used for CREATE flow
      create: {
        name: "",
        gift: "",
        childAttrs: [],
        adultAttrs: [],
        badAttrs: [],
        additionalAttrChoice: "",
        additionalAttrs: [],
        grate1: [],
        grate3: [],
        sideItem: "",
        rememberItem: "",
        outfit: "",
        itemSet: "",
        inexperienced: true,
      },
    };
  },
  beforeMount() {
    const rawChar = localStorage.getItem(CHAR_LOCAL_STORAGE);
    if (rawChar) {
      try {
        const char = JSON.parse(rawChar);
        // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
        this.create = char;
      } catch (e) {
        // stored json was malformed, so we delete it and restart fresh
        localStorage.removeItem(CHAR_LOCAL_STORAGE);
      }
    }
  },
  mounted() {
    // call silly api for getting random names
    this.$store.dispatch("other/getRandomNames");
  },
  computed: {
    ...mapState("other", ["randomNames", "randomNamesDisabled"]),
    getHiddenSidebarClass() {
      return this.create.name === "" ? "hidden" : "";
    },
    getMobileSidebarClass() {
      return this.showingStats ? "showStats" : "";
    },
    validAttributes() {
      return ATTRIBUTES;
    },
    // formulas come from https://vennt.fandom.com/wiki/Character_Creation
    calculateHP() {
      const levelHP = this.create.inexperienced ? 1 : 2;
      return 20 + levelHP + this.calculateAttribute("str") * 3;
    },
    calculateMP() {
      return 6 + this.calculateAttribute("wis") * 3;
    },
    calculateVim() {
      return this.calculateHP;
    },
    calculateInit() {
      return this.calculateAttribute("agi") + this.calculateAttribute("dex");
    },
    calculateSpeed() {
      return 3 + this.calculateAttribute("agi");
    },
    calculateXP() {
      let sum = 0;
      sum += this.create.inexperienced ? 1000 : 2500;
      if (this.create.sideItem === "read") {
        sum += 100;
      }
      return sum;
    },
    calculateSP() {
      let sum = 0;
      if (["useful", "eat"].includes(this.create.sideItem)) {
        sum += 50;
      }
      if (this.create.outfit === "fashionable") {
        sum += 100;
      }
      return sum;
    },
    calculateItems() {
      const items = [];
      if (this.create.outfit === "fashionable") {
        items.push("Fashionable Outfit");
      } else if (this.create.outfit === "functional") {
        items.push("Functional Outfit");
      }

      // all characters start with both of these weapons for free
      items.push("Melee Blade", "Ranged Sidearm");

      switch (this.create.itemSet) {
        case "chef":
          items.push(
            "Rations",
            "Rations",
            "Rations",
            "Tasty Water",
            "Tasty Water",
            "Tasty Water",
            "Frying Pan",
            "Cooking Kit"
          );
          break;
        case "dungeoneer":
          items.push(
            "Flare Rocket",
            "Lockpick set",
            "Flint and Steel",
            "Rope",
            "Sounding Stones",
            "Lux Ward",
            "Lantern"
          );
          break;
        case "merchant":
          items.push(
            "Elixir of Energy*",
            "Rope",
            "Writing Kit",
            "Lantern",
            // TODO: let user choose between coffee and alcohol
            "Coffee",
            "Coffee",
            "Coffee"
          );
          break;
        case "medic":
          items.push(
            "Bandages",
            "Bandages",
            "Bandages",
            "Healing Salve",
            "Healing Salve",
            "Godfire",
            "Sour Blessing",
            "Elixir of Life*"
          );
          break;
        case "scientist":
          items.push(
            "Lux Ward",
            "Elixir of Focus*",
            "Compass",
            "Writing Kit",
            "Lantern, Bullseye"
          );
          break;
        case "traveler":
          items.push(
            "Bedroll",
            "Lux Ward",
            "Spyglass",
            "Rations",
            "Rations",
            "Rations",
            "Rations",
            "Rations",
            "Rations"
          );
          break;
      }
      return keys2Items(items);
    },
    getGiftName() {
      const nameMap = {
        per: "Alertness",
        tek: "Craft",
        agi: "Alacrity",
        dex: "Finesse",
        int: "Mind",
        spi: "Magic",
        str: "Rage",
        wis: "Science",
        cha: "Charm",
        none: "None",
      };
      const name = nameMap[this.create.gift];
      if (name) {
        return name;
      }
      return "";
    },
    createCharacter() {
      return {
        name: this.create.name,
        gift: this.getGiftName,
        agi: this.calculateAttribute("agi"),
        cha: this.calculateAttribute("cha"),
        dex: this.calculateAttribute("dex"),
        int: this.calculateAttribute("int"),
        per: this.calculateAttribute("per"),
        spi: this.calculateAttribute("spi"),
        str: this.calculateAttribute("str"),
        tek: this.calculateAttribute("tek"),
        wis: this.calculateAttribute("wis"),
        hp: this.calculateHP,
        maxHp: this.calculateHP,
        mp: this.calculateMP,
        maxMp: this.calculateMP,
        vim: this.calculateVim,
        maxVim: this.calculateVim,
        hero: 3,
        maxHero: 9,
        armor: 0,
        init: this.calculateInit,
        speed: this.calculateSpeed,
        xp: this.calculateXP,
        sp: this.calculateSP,
        items: this.calculateItems,
      };
    },
    /*
    blockChildAttrsChoices() {
      return this.validAttributes.filter(
        (attr) =>
          (this.create.gift === attr &&
            this.create.adultAttrs.includes(attr)) ||
          this.create.badAttrs.includes(attr)
      );
    },
    blockAdultAttrsChoices() {
      return this.validAttributes.filter(
        (attr) =>
          (this.create.gift === attr &&
            this.create.childAttrs.includes(attr)) ||
          this.create.badAttrs.includes(attr)
      );
    },
    */
    blockAdditionalAttrsChoices() {
      switch (this.create.additionalAttrChoice) {
        case "one":
          return this.validAttributes.filter(
            // block if attribute has only been selected by one of the previous options
            (attr) =>
              this.create.gift === attr ||
              this.create.childAttrs.includes(attr) ===
                this.create.adultAttrs.includes(attr)
          );
        case "zero":
          // block if any attribute modifiers have already been selected
          return this.validAttributes.filter(
            (attr) =>
              this.create.gift === attr ||
              this.create.childAttrs.includes(attr) ||
              this.create.adultAttrs.includes(attr)
          );
      }
      // don't block any choices
      return [];
    },
    maxAdditionalAttrsChoices() {
      switch (this.create.additionalAttrChoice) {
        case "any":
          return 1;
        case "one":
          return 2;
        case "zero":
          return 3;
      }
      return 0;
    },
    blockBadAttrsChoices() {
      return this.validAttributes.filter(
        (attr) =>
          this.create.gift === attr ||
          this.create.childAttrs.includes(attr) ||
          this.create.adultAttrs.includes(attr) ||
          this.create.additionalAttrs.includes(attr)
      );
    },
    getAdditionalAttrChoiceOptions() {
      return {
        any: "Add 1 to one Attribute of your choice",
        one: "Add 1 to two Attributes at 1",
        zero: "Add 1 to three Attributes at 0",
      };
    },
    getSideEquipmentOptions() {
      return {
        sharp:
          "<b>Something sharp:</b> Gain +1 Dexterity and two more Blade weapons.",
        remember:
          "<b>Something to remember:</b> Gain +1 Spirit OR +1 Charisma.",
        useful:
          "<b>Something useful:</b> Gain +1 Wisdom and 50 sp to spend on Equipment.",
        eat: "<b>Something to eat:</b> Gain +1 Strength and 50 sp to spend on Consumables.",
        read: "<b>Something to read:</b> Gain +1 Intelligence and 100 XP.",
      };
    },
    showRememberOptions() {
      return this.create.sideItem === "remember";
    },
    getRememberOptions() {
      return {
        spi: "<b>Spirit:</b> Gain +1 Spirit.",
        cha: "<b>Charisma:</b> Gain +1 Charisma.",
      };
    },
    getOutfitOptions() {
      return {
        fashionable:
          "<b>Fashionable:</b> Gain +1 Charisma and 100sp. Your fashionable outfit has a carrying capacity of 5 Bulk.",
        functional:
          "<b>Functional:</b> Gain +1 Agility. Your functional outfit has a carrying capacity of 15 Bulk.",
      };
    },
    getItemSetOptions() {
      return {
        chef: "<b>Chef:</b> 3 Rations, 3 Tasty Waters, 1 Frying Pan, 1 Cooking Kit",
        dungeoneer:
          "<b>Dungeoneer:</b> 1 Flare Rocket, 1 Lockpick set, 1 Flint and Steel, 1 Rope, 1 bag of Sounding Stones, 1 Lux Ward, 1 Lantern",
        merchant:
          "<b>Merchant:</b> 1 Elixir of Energy, 1 Rope, 1 Writing Kit, 1 Lantern, 3 Coffee or Alcohol",
        medic:
          "<b>Medic:</b> 3 Bandages, 2 Healing Salves, 1 Godfire, 1 Sour Blessing, 1 Elixir of Life",
        scientist:
          "<b>Scientist:</b> 1 Lux Ward, 1 Elixir of Focus, 1 Compass, 1 Writing Kit, 1 Bullseye Lantern",
        traveler:
          "<b>Traveler:</b> 1 Bedroll, 1 Lux Ward, 1 Spyglass, 6 Rations",
      };
    },
    getInexperiencedOption() {
      return this.create.inexperienced ? "yes" : "no";
    },
    getInexperiencedOptions() {
      return {
        yes: `<b>Yes:</b> Gain 1000 XP. When you complete a Novice Path for the first time, gain 300 XP.
        When you complete a Journeyman Path for the first time, gain 700 XP.
        When you complete an Adept Path for the first time, gain 1000 XP.`,
        no: "<b>No:</b> Gain 2500 XP.",
      };
    },
  },
  methods: {
    createNavButton() {
      this.showingStats = false;
    },
    statsNavButton() {
      this.showingStats = true;
    },
    randomNameButton() {
      if (this.randomNames.length < 3) {
        // need to get more random names
        this.$store.dispatch("other/getRandomNames");
      }
      if (this.randomNames.length > 0) {
        // pop item off front of array
        this.create.name = this.randomNames[0];
        this.$store.commit("other/shiftRandomNames");
      }
    },
    giftUpdated(newGift) {
      this.create.gift = newGift;
      /*
      // These rules are no longer followed
      this.create.childAttrs = this.create.childAttrs.filter(
        (attr) => attr !== newGift
      );
      this.create.adultAttrs = this.create.adultAttrs.filter(
        (attr) => attr !== newGift
      );
      */
      this.create.badAttrs = this.create.badAttrs.filter(
        (attr) => attr !== newGift
      );
      this.backupCreate();
    },
    childAttrsUpdated(newList) {
      this.create.childAttrs = newList;
      this.create.additionalAttrs = this.create.additionalAttrs.filter(
        (attr) => !newList.includes(attr)
      );
      this.create.badAttrs = this.create.badAttrs.filter(
        (attr) => !newList.includes(attr)
      );
      this.backupCreate();
    },
    adultAttrsUpdated(newList) {
      this.create.adultAttrs = newList;
      this.create.additionalAttrs = this.create.additionalAttrs.filter(
        (attr) => !newList.includes(attr)
      );
      this.create.badAttrs = this.create.badAttrs.filter(
        (attr) => !newList.includes(attr)
      );
      this.backupCreate();
    },
    additionalAttrChoiceUpdated(newItem) {
      this.create.additionalAttrChoice = newItem;
      this.create.additionalAttrs = []; // reset selected options to prevent invalid choices
      this.backupCreate();
    },
    additionalAttrsUpdated(newList) {
      this.create.additionalAttrs = newList;
      this.create.badAttrs = this.create.badAttrs.filter(
        (attr) => !newList.includes(attr)
      );
      this.backupCreate();
    },
    badAttrsUpdated(newList) {
      this.create.badAttrs = newList;
      this.backupCreate();
    },
    grate1Updated(newList) {
      this.create.grate1 = newList;
      this.backupCreate();
    },
    grate3Updated(newList) {
      this.create.grate3 = newList;
      this.backupCreate();
    },
    sideItemUpdated(newItem) {
      this.create.sideItem = newItem;
      this.backupCreate();
    },
    rememberItemUpdated(newItem) {
      this.create.rememberItem = newItem;
      this.backupCreate();
    },
    outfitUpdated(newOutfit) {
      this.create.outfit = newOutfit;
      this.backupCreate();
    },
    itemSetUpdated(newItemSet) {
      this.create.itemSet = newItemSet;
      this.backupCreate();
    },
    experienceUpdated(inexperienced) {
      this.create.inexperienced = inexperienced === "yes";
      this.backupCreate();
    },
    isValidAttribute(attr) {
      return this.validAttributes.includes(attr);
    },
    calculateAttribute(attr) {
      if (!this.isValidAttribute(attr)) {
        return 0;
      }
      let sum = 0;
      // gift gets +2
      if (this.create.gift === attr) {
        sum += 2;
      }
      // child & adult attributes
      if (this.create.childAttrs.includes(attr)) {
        sum++;
      }
      if (this.create.adultAttrs.includes(attr)) {
        sum++;
      }
      if (this.create.additionalAttrs.includes(attr)) {
        sum++;
      }
      if (this.create.badAttrs.includes(attr)) {
        sum--;
      }
      if (this.create.grate1.includes(attr)) {
        sum--;
      }
      if (this.create.grate3.includes(attr)) {
        sum++;
      }
      // add attribute according to side item
      const sideItemMap = {
        painful: "str",
        sharp: "dex",
        quick: "per",
        useful: "wis",
        eat: "str",
        read: "int",
      };
      if (sideItemMap[this.create.sideItem] === attr) {
        sum++;
      }
      if (this.showRememberOptions && this.create.rememberItem === attr) {
        sum++;
      }
      // add attribute according to outfit
      const outfitMap = {
        fashionable: "cha",
        functional: "agi",
      };
      if (outfitMap[this.create.outfit] === attr) {
        sum++;
      }
      return sum;
    },
    backupCreate() {
      localStorage.setItem(CHAR_LOCAL_STORAGE, JSON.stringify(this.create));
    },
    createCharacterButton() {
      if (this.createCharacter.name === "") {
        // should probably print an error message on the page or something ¯\_(ツ)_/¯
        return;
      }
      const character = this.createCharacter;
      // console.log(character);
      this.$store.dispatch("character/createCharacter", {
        character: character,
        redirectToCharacter: true,
      });
    },
    clearCharacter() {
      localStorage.removeItem(CHAR_LOCAL_STORAGE);
      this.$router.push({ name: "Create" });
    },
  },
};
</script>

<style scoped>
.nameInput {
  max-width: 300px;
  margin-right: 10px;
}

.btnContents {
  display: flex;
  align-items: center;
}

.bottomMargin {
  margin-bottom: 20px;
}

/* subNav and sideBar Styles */
.subNav {
  display: none;
  justify-content: center;
}
.createNavButton:not(.showStats) {
  display: none;
}
.statsNavButton.showStats {
  display: none;
}

@media screen and (max-width: 760px) {
  .subNav {
    display: flex;
  }
  .page {
    margin-top: var(--total-nav-height);
  }
  .sideBar {
    top: var(--total-nav-height);
    height: var(--sub-nav-page-height);
    width: 100%;
  }
  .sideBar:not(.showStats) {
    display: none;
  }
  .sideBar.showStats {
    display: block;
  }
  .sideBarPage:not(.showStats) {
    display: flex;
    margin-left: 0px;
  }
  .sideBarPage.showStats {
    display: none;
  }
}

/* mobile styles */
.main.bp600 .nameRow {
  display: block;
}
.main.bp600 .nameInput {
  margin-right: 0px;
  max-width: 100%;
}
.main.bp600 .randomNameButton {
  margin-top: 8px;
  width: calc(100% - 20px);
}
</style>
