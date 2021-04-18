<template>
  <div v-bind:style="{ 'background-color': charColor }" class="bullet"></div>
</template>

<script>
export default {
  name: 'Bullet',
  props: {
    character: Object
  },
  computed: {
    charColor () {
      if (!this.character) {
        return 'var(--red-600)'
      }
      const red = this.character.str + this.character.agi + this.character.cha
      const green = this.character.tek + this.character.int + this.character.dex
      const blue = this.character.wis + this.character.spi + this.character.per
      const sum = red + green + blue
      return '#' + this.hexColorComponent(red, sum) + this.hexColorComponent(green, sum) + this.hexColorComponent(blue, sum)
    }
  },
  methods: {
    hexColorComponent (component, sum) {
      if (sum <= 0) {
        sum = 1
      }
      if (component < 0) {
        component = 0
      }
      const numStr = Math.floor((component / sum) * 256).toString(16)
      if (numStr.length === 1) {
        return '0' + numStr
      } else if (numStr.length > 2) {
        return 'ff'
      }
      return numStr
    }
  }
}
</script>

<style scoped>
.bullet {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 8px;
}
</style>
