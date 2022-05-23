<template>
  <div
    class="card border column notesCard"
    v-bind:style="{ height: boxHeight + 'px' }"
  >
    <div @mousedown="headerDragStart" class="alignRow split notesHeader">
      <label for="character-notes-field" class="labelText ml-8">Notes</label>
      <div class="alignRow">
        <div class="mr-8">
          <span v-if="edited" class="material-icons defaultSize mutedText">
            sync
          </span>
          <span v-else class="material-icons defaultSize mutedText">check</span>
        </div>
        <button v-on:click="toggleNotes()" class="btn basicBtn">
          <div class="basicBtnContents">
            <span class="material-icons">close</span>
          </div>
        </button>
      </div>
    </div>
    <textarea
      v-model="notes"
      v-on:input="typing"
      placeholder="Character notes can live here"
      class="input textInput notesField"
      id="character-notes-field"
    ></textarea>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Notes",
  data() {
    return {
      notes: "",
      boxHeight: 200,
      startMouseY: 0,
      startBoxHeight: 0,
      timeout: undefined,
      edited: false,
    };
  },
  beforeMount() {
    const localNotes = localStorage.getItem(this.localStorageId);
    if (localNotes) {
      this.notes = localNotes;
    }
    const localHeight = parseInt(
      localStorage.getItem(this.localStorageHeightId)
    );
    if (localHeight && !isNaN(localHeight)) {
      this.boxHeight = localHeight;
    }
  },
  destroyed() {
    this.saveNotes();
    localStorage.setItem(this.localStorageHeightId, this.boxHeight);
  },
  computed: {
    ...mapState("character", ["character"]),
    localStorageId() {
      return this.character.id + "-n";
    },
    localStorageHeightId() {
      return this.localStorageId + "h";
    },
  },
  methods: {
    toggleNotes() {
      this.$emit("toggleNotes");
    },
    headerDragStart(e) {
      e.preventDefault();
      this.startMouseY = e.clientY;
      this.startBoxHeight = this.boxHeight;
      document.onmouseup = this.endDrag;
      document.onmousemove = this.dragHeader;
    },
    dragHeader(e) {
      e.preventDefault();
      const offset = this.startMouseY - e.clientY;
      this.boxHeight = Math.max(this.startBoxHeight + offset, 80);
    },
    endDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    typing() {
      if (!this.edited) {
        this.edited = true;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.saveNotes();
      }, 3000); // delay
    },
    saveNotes() {
      if (this.edited) {
        // TODO: save to server instead of here
        localStorage.setItem(this.localStorageId, this.notes);
        this.edited = false;
      }
    },
  },
};
</script>

<style scoped>
.notesCard {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  position: fixed;
  bottom: 0;
  width: calc(100% - var(--sidebar-width));
  right: 0;
  max-width: 640px;
  z-index: 10;
  background-color: var(--background-low-contrast);
}
.notesHeader {
  cursor: row-resize;
}
.notesField {
  resize: none;
  border: none;
  border-top: 1px solid var(--border);
  border-radius: 0px;
  padding: 8px;
  height: 100%;
  background-color: var(--background-low-contrast);
  line-height: 1.2;
}

.sideBarPage.rightVisible + .notesCard {
  right: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width) - var(--sidebar-width));
}

.notesCard:focus-within {
  border-color: var(--border-focus);
}

@media screen and (max-width: 1200px) {
  /* Right sidebar becomes main page */
  .sideBarPage.rightVisible + .notesCard {
    right: 0;
    width: calc(100% - var(--sidebar-width));
  }
}

@media screen and (max-width: 760px) {
  /* Both Sidebars stops getting displayed */
  .notesCard {
    width: 100% !important;
  }
}
</style>
