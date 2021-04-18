<template>
  <div>
    <h1>Inventory page</h1>
    {{ character.name }}
  </div>
</template>

<script>
export default {
  name: 'Inventory',
  props: {
    character: Object
  }
}
</script>
