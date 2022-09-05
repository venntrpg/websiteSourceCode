<template>
  <div>
    <div v-if="section === 'Adventuring Gear'">
      <p>
        All equipment pieces use 1 Action to use or activate and weigh 1 Bulk,
        unless otherwise specified. If multiple items come with the purchase,
        listed in parentheses, this number is how many can stack in a single
        Bulk.
      </p>
      <p>
        Equipping or unequipping a weapon counts as using that item, so it costs
        1 Action. You may unequip a weapon and equip a different one in the same
        Action.
      </p>
    </div>
    <p v-else-if="section === 'Unusual Devices'">
      Unusual devices are typically only purchaseable if you know a guy who
      knows a guy, but adventurers can often find what they need in the back
      alleys of any city.
    </p>
  </div>
</template>

<script>
// NOTE: I am not using this right now because it bulks up the page too much - might be a better way to add this back later

export default {
  props: { section: String },
};
</script>
