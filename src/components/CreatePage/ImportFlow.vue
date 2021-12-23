<template>
  <div class="page">
    <div class="mediumPageWidth">
      <h1>IMPORT CHARACTER</h1>
      <h2>Copy in details from your Character Stats</h2>
      Character name:
      <input
        type="text"
        name="name"
        placeholder="Bilbo Baggins"
        class="input inputMargin"
        v-model="character.name"
        v-on:blur="backupImport"
      />
      Select gift:
      <RadioButtonSelection
        :options="getGiftsSelection"
        :selected="character.gift"
        @selectedUpdated="giftUpdated"
        class="inputMargin"
      />
      Attributes:
      <div class="attributeInputContainer inputMargin">
        <div
          v-for="attr in validAttributes"
          v-bind:key="attr"
          class="attributeInput"
        >
          <div class="attributeName">{{ attr.toUpperCase() }}:</div>
          <input
            type="number"
            placeholder="0"
            class="input"
            v-model="character[attr]"
            v-on:blur="backupImport"
          />
        </div>
      </div>
      Max HP:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.maxHp"
        v-on:blur="backupImport"
      />
      Max MP:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.maxMp"
        v-on:blur="backupImport"
      />
      Max Vim:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.maxVim"
        v-on:blur="backupImport"
      />
      Current Hero Points:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.hero"
        v-on:blur="backupImport"
      />
      Max Hero Points:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.maxHero"
        v-on:blur="backupImport"
      />
      Initiative Bonus:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.init"
        v-on:blur="backupImport"
      />
      Speed:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.speed"
        v-on:blur="backupImport"
      />
      Armor:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.armor"
        v-on:blur="backupImport"
      />
      Total XP:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.xp"
        v-on:blur="backupImport"
      />
      SP:
      <input
        type="number"
        placeholder="0"
        class="input inputMargin"
        v-model="character.sp"
        v-on:blur="backupImport"
      />
      <p>You can import items and abilities after you create the character.</p>
      <h2>Import your Character</h2>
      <p>
        Click the "Create Character" button to officially create the character.
      </p>
      <p>
        Click the "Clear Character" button to delete this character and start
        again.
      </p>
      <div class="bottomButtons">
        <button v-on:click="createCharacterButton()" class="btn roundedButton">
          <div class="btnContents">Import Character</div>
        </button>
        <ConfirmSelectionButton
          :defaultText="'Clear Character'"
          @secondClick="clearCharacter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RadioButtonSelection from "../Common/RadioButtonSelection.vue";
import ConfirmSelectionButton from "../Common/ConfirmSelectionButton.vue";

const CHAR_LOCAL_STORAGE = "creation-import-wip";

export default {
  name: "ImportFlow",
  components: {
    RadioButtonSelection,
    ConfirmSelectionButton,
  },
  data() {
    return {
      character: {
        name: "",
        gift: "None",
        agi: "",
        cha: "",
        dex: "",
        int: "",
        per: "",
        spi: "",
        str: "",
        tek: "",
        wis: "",
        maxHp: "",
        maxMp: "",
        maxVim: "",
        hero: "",
        maxHero: "",
        armor: "",
        init: "",
        speed: "",
        xp: "",
        sp: "",
      },
    };
  },
  beforeMount() {
    const rawChar = localStorage.getItem(CHAR_LOCAL_STORAGE);
    if (rawChar) {
      try {
        const char = JSON.parse(rawChar);
        // TODO: Might want to do this row by row to ensure we don't get values imported incorrectly
        this.character = char;
      } catch (e) {
        // stored json was malformed, so we delete it and restart fresh
        localStorage.removeItem(CHAR_LOCAL_STORAGE);
      }
    }
  },
  computed: {
    getGiftsSelection() {
      return {
        Alertness: "Alertness, The Gift of Perception",
        Craft: "Craft, The Gift of Technology",
        Alacrity: "Alacrity, the Gift of Agility",
        Finesse: "Finesse, The Gift of Dexterity",
        Mind: "Mind, The Gift of Intelligence",
        Magic: "Magic, The Gift of Spirit",
        Rage: "Rage, The Gift of Strength",
        Science: "Science, The Gift of Wisdom",
        Charm: "Charm, The Gift of Charisma",
        None: "Normality, the Lack of a Gift",
      };
    },
    validAttributes() {
      return ["per", "tek", "agi", "dex", "int", "spi", "str", "wis", "cha"];
    },
  },
  methods: {
    parseNumber(num) {
      const result = parseInt(num);
      return !isNaN(result) ? result : 0;
    },
    backupImport() {
      localStorage.setItem(CHAR_LOCAL_STORAGE, JSON.stringify(this.character));
    },
    giftUpdated(newGift) {
      this.character.gift = newGift;
      this.backupImport();
    },
    clearCharacter() {
      localStorage.removeItem(CHAR_LOCAL_STORAGE);
      this.$router.push({ name: "Create" });
    },
    createCharacterButton() {
      if (this.character.name === "") {
        // should probably print an error message on the page or something ¯\_(ツ)_/¯
        return;
      }
      const createCharacter = {
        name: this.character.name,
        agi: this.parseNumber(this.character.agi),
        cha: this.parseNumber(this.character.cha),
        dex: this.parseNumber(this.character.dex),
        int: this.parseNumber(this.character.int),
        per: this.parseNumber(this.character.per),
        spi: this.parseNumber(this.character.spi),
        str: this.parseNumber(this.character.str),
        tek: this.parseNumber(this.character.tek),
        wis: this.parseNumber(this.character.wis),
        // automatically set some stats to max value
        hp: this.parseNumber(this.character.maxHp),
        maxHp: this.parseNumber(this.character.maxHp),
        mp: this.parseNumber(this.character.maxMp),
        maxMp: this.parseNumber(this.character.maxMp),
        vim: this.parseNumber(this.character.maxVim),
        maxVim: this.parseNumber(this.character.maxVim),
        hero: this.parseNumber(this.character.hero),
        maxHero: this.parseNumber(this.character.maxHero),
        armor: this.parseNumber(this.character.armor),
        init: this.parseNumber(this.character.init),
        speed: this.parseNumber(this.character.speed),
        xp: this.parseNumber(this.character.xp),
        sp: this.parseNumber(this.character.sp),
      };
      this.clearCharacter();
      console.log(createCharacter);
      // need to send this, then once confirmed, send weapon if they selected one, then once cofirmed, we should redirect to the character page
      this.$store.dispatch("createCharacter", {
        character: createCharacter,
        redirectToCharacter: true,
      });
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.inputMargin {
  margin-top: 2px;
  margin-bottom: 8px;
}

.attributeInputContainer {
  display: grid;
  grid-template-columns: repeat(3, 33% [col-start]);
  grid-gap: 8px;
  margin-right: 8px;
}
.attributeInput {
  font-size: 16pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.attributeName {
  width: 72px;
}

.bottomButtons {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 150px;
}
</style>
