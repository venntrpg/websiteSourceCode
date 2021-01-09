<template>
  <div class="hello">
    <h1>{{ welcomeText }}</h1>
    <h2>Vennt RPG lives here :o</h2>
    <button v-on:click="todoButton">todo button: {{ counter }}</button>
    <p v-if="showTodoTitle">{{ todoTitle }}</p>
    <h3>Change the welcome text?</h3>
    <input v-model="welcomeTextField">
    <p>
      <button v-on:click="persistWelcomeMessage">Save welcome message</button>
    </p>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  data () {
    return {
      counter: 0,
      welcomeTextField: '',
      welcomeText: 'Welcome!'
    }
  },
  mounted () {
    if (localStorage.welcomeText) {
      this.welcomeText = localStorage.welcomeText
    }
  },
  computed: {
    ...mapState(['todoTitle']),
    showTodoTitle: function () {
      return this.counter !== 0 && this.todoTitle && this.todoTitle !== ''
    }
  },
  methods: {
    ...mapActions(['getTodoTitle']),
    todoButton: function () {
      this.getTodoTitle(this.counter)
      this.counter++
    },
    persistWelcomeMessage: function () {
      this.welcomeText = this.welcomeTextField
      localStorage.welcomeText = this.welcomeTextField
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin-top: 40px;
}
</style>
