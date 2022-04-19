<template>
  <div
    class="card border column notesCard"
    v-bind:style="{ height: boxHeight + 'px' }"
  >
    <div @mousedown="headerDragStart" class="alignRow split notesHeader">
      <label for="character-notes-field" class="labelText ml-8">Notes</label>
      <button v-on:click="toggleNotes()" class="btn basicBtn">
        <div class="basicBtnContents">
          <span class="material-icons">close</span>
        </div>
      </button>
    </div>
    <!-- v-on:input="typing" -->
    <textarea
      v-model="notes"
      placeholder="Character notes can live here"
      class="input textInput notesField"
      id="character-notes-field"
    ></textarea>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import debounce from "lodash.debounce";
export default {
  name: "Notes",
  data() {
    return {
      notes: "",
      boxHeight: 160,
      startMouseY: 0,
      startBoxHeight: 0,
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
    if (this.notes !== localStorage.getItem(this.localStorageId)) {
      localStorage.setItem(this.localStorageId, this.notes);
    }
    localStorage.setItem(this.localStorageHeightId, this.boxHeight);
  },
  computed: {
    ...mapState("character", ["character"]),
    localStorageId() {
      return this.character.id + "-notes";
    },
    localStorageHeightId() {
      return this.localStorageId + "-height";
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
      // TODO: Fix this so it works and can be used for saving updates to server
      // debounce(() => console.log("hi"));
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
  max-width: 560px;
  z-index: 10;
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

@media screen and (max-width: 800px) {
  /* Both Sidebars stops getting displayed */
  .notesCard {
    width: 100% !important;
  }
}
</style>
