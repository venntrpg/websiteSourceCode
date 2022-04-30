<template>
  <p v-html="attrHelpHTML" class="mt-0 mb-8"></p>
</template>

<script>
export default {
  name: "AttrHelp",
  props: {
    attr: String,
  },
  computed: {
    attrHelpHTML() {
      const helpMap = {
        hp: `Your maximum Health (HP) is 20 + Level + 3 times Strength.
        <a href="https://vennt.fandom.com/wiki/Health" target="_blank" class="link">Wiki entry</a>.`,
        mp: `Your maximum Mana (MP) is 6 + 3 times Wisdom.
        <a href="https://vennt.fandom.com/wiki/Mana" target="_blank" class="link">Wiki entry</a>.`,
        vim: `Your maximum Vim is equal to your maximum HP.
        <a href="https://vennt.fandom.com/wiki/Vim" target="_blank" class="link">Wiki entry</a>`,
        hero: `Hero Points are reserves of luck that can be spent to create moments of shining excellence.
        <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="link">Wiki entry</a>.
        Note: Hero Points require that the
        <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="link">Course of Heroism</a>
        has been introduced.`,
        init: `Your Initiative is your Agility + Dexterity.
        <a href="https://vennt.fandom.com/wiki/Initiative" target="_blank" class="link">Wiki entry</a>.`,
        speed: `Your Speed is 3 + Agility minus any Burden from your Armor.
        <a href="https://vennt.fandom.com/wiki/Movement" target="_blank" class="link">Wiki entry</a>.`,
        armor: `Your Armor serves as damage reduction from blows dealt to you.
        <a href="https://vennt.fandom.com/wiki/Armor" target="_blank" class="link">Wiki entry</a>.`,
        xp: `Experience Points, the resource gained by player characters during play and spent on Abilities.
        Your character's level is your xp&nbsp;/&nbsp;1000.
        <a href="https://vennt.fandom.com/wiki/XP" target="_blank" class="link">Wiki entry</a>`,
        sp: `Silver Pieces are Amnis's main currency.
        <a href="https://vennt.fandom.com/wiki/Money" target="_blank" class="link">Wiki entry</a>`,
        maxBulk: `Bulk is an abstract unit of measurement to represent the weight and size of one's inventory.
        You can carry an amount of Bulk up to your carrying capacity.`,
        level: `Level of the cog. See the
        <a href="https://vennt.fandom.com/wiki/Course_of_Tactics#The_L_stat" target="_blank" class="link">Wiki entry</a>.`,
        acc: `Attacks are generally made by comparing the target's Accuracy to the target's Vim.
        <a href="https://vennt.fandom.com/wiki/Accuracy" target="_blank" class="link">Wiki entry</a>.`,
        radius: `The Radius of a cog refers to how many hexes outside of it's central hex the cog takes up`,
        reach: `Reach is the distance from which a creature can make melee attacks and manipulate objects.
        This defaults to 1 hex/meter for human-sized creatures.
        <a href="https://vennt.fandom.com/wiki/Reach" target="_blank" class="link">Wiki entry</a>.`,
      };
      return helpMap[this.attr];
    },
  },
};
</script>
