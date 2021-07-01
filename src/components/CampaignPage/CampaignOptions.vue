<template>
  <div>
    <h1 class="center">{{ campaignName }}</h1>
    <p>
      You should be able to invite users to your campaign here, give users different roles (if campaign owner) or select which character you would like to use.
      Doing that will take you to a new page like /campaign/:campaignId/:characterId or /campaign/:campaignId/gm if you are the GM.
      In this screen, you can see your character's possible actions on the left panel and the current turn order / a log of what has happenned
      so far in the battle on the main page.
      It would also be really cool if we could get some fancy images in there to spice things up / make the page more appealing to look at
      (the website is generally kind of boring to look at tbh).
    </p>
  </div>
</template>

<script>
export default {
  name: 'CampaignOptions',
  props: {
    campaignName: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.center {
  text-align: center;
}
</style>
