<template>
  <div>
    <p v-if="weapon.weaponType" class="mb-0">
      <b>Type:</b> {{ weapon.weaponType }}
    </p>
    <p v-if="weapon.range" class="mb-0"><b>Range:</b> {{ weapon.range }}</p>
    <p v-if="weapon.bulk" class="mb-0"><b>Bulk:</b> {{ weapon.bulk }}</p>
    <p v-if="weapon.attr" class="mb-0"><b>Attribute:</b> {{ weapon.attr }}</p>
    <p v-if="weapon.examples" class="mb-0">
      <b>Common Examples:</b> {{ weapon.examples }}
    </p>
    <p v-if="weapon.cost" class="mb-0"><b>Cost:</b> {{ weapon.cost }}</p>
    <p v-if="weapon.dmg" class="mb-0"><b>Damage:</b> {{ weapon.dmg }}</p>
    <p v-if="weapon.special" class="mb-0">
      <b>Special:</b> {{ weapon.special }}
    </p>
    <p class="mb-0">{{ weapon.desc }}</p>
  </div>
</template>

<script>
export default {
  name: "WeaponDetail",
  props: { weapon: Object },
};
</script>
