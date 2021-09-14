<template>
  <div>
    <button v-if="clickedOnce" v-on:click="firstClick()" class="btn basicBtn">
      <div class="basicBtnContents">
        {{ defaultText }}
      </div>
    </button>
    <button v-else v-on:click="secondClick()" class="btn basicBtn">
      <div class="basicBtnContents">
        Are you sure?
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ConfirmSelectionButton',
  props: {
    defaultText: String
  },
  data () {
    return {
      clickedOnce: true
    }
  },
  methods: {
    firstClick () {
      this.clickedOnce = false
    },
    secondClick () {
      this.$emit('secondClick')
    }
  }
}
</script>
