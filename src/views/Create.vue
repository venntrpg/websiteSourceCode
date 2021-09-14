<template>
  <div>
    <NewFlow v-if="isNewSection" />
    <ImportFlow v-else-if="isImportSection" />
    <div v-else class="page">
      <div class="mediumPageWidth selectFlowContainer">
        <div class="selectFlow">
          <h1>CHARACTER CREATION</h1>
          <p>You can create a totally new character or import a character which you have already created.</p>
          <router-link to="/create/new" class="btn roundedButton wide topMargin">Make a new character!</router-link>
          <router-link to="/create/import" class="btn roundedButton wide topMargin">Import an old character!</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import NewFlow from '../components/CreatePage/NewFlow.vue'
import ImportFlow from '../components/CreatePage/ImportFlow.vue'

// Constants
const NEW_SECTION = 'new'
const IMPORT_SECTION = 'import'

export default {
  name: 'Create',
  components: {
    NewFlow,
    ImportFlow
  },
  beforeMount () {
    if (!this.isLoggedIn) {
      // if not logged in, redirect to Home
      this.$router.push({ name: 'Home' })
    }
  },
  computed: {
    ...mapState(['isLoggedIn']),
    isNewSection () {
      return this.$route.params.section === NEW_SECTION
    },
    isImportSection () {
      return this.$route.params.section === IMPORT_SECTION
    }
  }
}
</script>

<style scoped>
.selectFlowContainer {
  display: flex;
  justify-content: center;
}

.selectFlow {
  width: 320px;
}

h1 {
  text-align: center;
}

.topMargin {
  margin-top: 12px;
}

</style>
