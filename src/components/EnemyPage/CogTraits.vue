<template>
  <div>
    <div class="alignRow gap labelText">
      Remaining Traits
      <fraction :top="selected.length" :bottom="totalTraits" />
    </div>
    <cog-toggleable-effects
      :options="options"
      :selected="selected"
      :mutuallyExclusive="mutuallyExclusiveOptions"
      :progressiveOptions="progressiveOptions"
      :disabled="disabledOptions"
      :maxSelections="totalTraits"
      @newSelected="emitNewList"
    />
  </div>
</template>

<script>
import Fraction from "../Common/CombatStatsComponents/Fraction.vue";
import CogToggleableEffects from "./CogToggleableEffects.vue";
export default {
  components: { Fraction, CogToggleableEffects },
  name: "CogTraits",
  props: {
    cog: Object,
    totalTraits: Number,
    selected: Array,
  },
  computed: {
    options() {
      return {
        Adaptable: {
          text: "This Cog can spend 1 Action to gain the bonus of another template until the start of their next turn. This effect can occur 3/fight.",
          section: "Combat Meta",
        },
        "Great Initiative": {
          text: "This Cog gains +L to initiative.",
        },
        "Half Template": {
          text: "This Cog has half the bonus of another template.",
        },
        "Small I": {
          text: "This Cog is considered 1 Level lower for Strength, HP, damage, and Speed; they are considered 1 Level higher for Vim, Dexterity, and Agility, and gain 1 Alert at the start of each of their turns. This cannot be taken with Large I.",
        },
        "Small II": {
          text: "This Cog is considered 2 Levels lower for Strength, HP, damage, and Speed; they are considered 3 Levels higher for Vim, Dexterity, and Agility, and gain 2 Alerts at the start of each of their turns.",
        },
        "Large I": {
          text: "This Cog is considered 1 Level higher for Strength, HP, damage, and Speed; they are considered 1 Level lower for Vim, Dexterity, and Agility. They take up 3 adjacent hexes and have a Reach of 2 meters. This cannot be taken with Small I.",
        },
        "Large II": {
          text: "This Cog is considered 2 Levels higher for Strength, HP, damage, and Speed; they are considered 3 Levels lower for Vim, Dexterity, and Agility. They take up 7 hexes (1 hex and all surrounding hexes) and have a Reach of 3 meters.",
        },
        "Large III": {
          text: "This Cog is considered 3 Levels higher for Strength, HP, damage, and Speed; they are considered 5 Levels lower for Vim, Dexterity, and Agility. They have a radius of 2 and a Reach of 4 meters.",
        },
        "Second Phase": {
          text: "When this Cog is near-defeated, they may respond in a manner so shocking and situation-changing that it ends the current Encounter and begins a new one. When this Cog is created, specify the condition under which this response is triggered, such as 2L health remaining or the last one of its group alive.",
        },
        "Fast I": {
          text: "This Cog has doubled Speed.",
          section: "Movement",
        },
        "Fast II": {
          text: "This Cog has tripled Speed.",
        },
        "Flight I": {
          text: "This Cog has a Flight Speed equal to half its Speed.",
        },
        "Flight II": {
          text: "This Cog has a Flight Speed equal to its Speed.",
        },
        "Swim I": {
          text: "This Cog has a Swim Speed equal to its Speed.",
        },
        "Swim II": {
          text: "This Cog has a Swim Speed equal to twice its Speed.",
        },
        "Bonus Accuracy I": {
          text: "This Cog has +5 Accuracy.",
          section: "Offenses",
        },
        "Bonus Accuracy II": {
          text: "This Cog has +10 Accuracy.",
        },
        "Bonus Accuracy III": {
          text: "This Cog has +15 Accuracy.",
        },
        "Bonus AP I": {
          text: "This Cog gains 2 AP.",
        },
        "Bonus AP II": {
          text: "This Cog gains an additional 1 AP.",
        },
        "Bonus Damage I": {
          text: "Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +3.",
        },
        "Bonus Damage II": {
          text: "Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +9. Additionally, any attack that deals normal damage deals an additional +3 (or L/2, whichever is lower) damage. This ability replaces Bonus Damage I.",
        },
        "Bonus Damage III": {
          text: "Whenever this Cog deals 1d6 normal damage, they deal an extra +1 damage, up to +15. Additionally, any attack that deals normal damage deals an additional +6 (or L, whichever is lower) damage. This ability replaces Bonus Damage II.",
        },
        "Reach I": {
          text: "This Cog's Reach increases by 1 meter.",
        },
        "Reach II": {
          text: "This Cog's Reach increases by 2 meters.",
        },
        "Aimed Attacker": {
          text: "By spending 1 Action, this Cog can gain +20 Accuracy to their next attack. This effect can stack.",
          section: "Special Offenses",
        },
        Prey: {
          text: "This Cog always targets characters who are not Supported if one exists, and deals an additional 2d6 damage with damage-dealing abilities against targets who are not Supported.",
        },
        "Frenzy I": {
          text: "When this Cog has 3L health or less, they deal an additional 2d6 damage with damage-dealing abilities (excluding Traits).",
        },
        "Frenzy II": {
          text: "When this Cog is injured, they deal an additional 2d6 damage with damage-dealing abilities (excluding Traits).",
        },
        "Full Attack I": {
          text: "This Cog can spend 3 Actions to make three melee attacks with an Accuracy of 10L and dealing 2L damage each.",
        },
        "Full Attack II": {
          text: "This Cog can spend 3 Actions to make four melee attacks with an Accuracy of 5L and dealing 3L damage each.",
        },
        "Harsh Opener I": {
          text: "For the first Round of combat, this Cog has 5 Actions per turn instead of 3.",
        },
        "Harsh Opener II": {
          text: "For the first two Rounds of combat, this Cog has 5 Actions per turn instead of 3.",
        },
        Grappler: {
          /* (requires Course of Contenders) */
          text: "When this Cog attempts a grapple, they gain +L/2 to the STR check made to grapple.",
        },
        Powerful: {
          text: "This Cog can spend 2 Actions to charge an attack. Its next attack will deal double damage on all damage types. This effect cannot stack.",
        },
        "Thousand Cuts I": {
          text: "By spending 1 Action, this Cog can make a melee attack that deals L damage.",
        },
        "Thousand Cuts II": {
          text: "By spending 1 Action, this Cog can make two melee attacks that deal L damage.",
        },
        "Threatening Aura I": {
          text: "All enemies (to the Cog) are threatened when they come within 1 meter of this Cog and take a -2 penalty to damage while threatened by them.",
        },
        "Threatening Aura II": {
          text: "All enemies (to the Cog) are threatened when they come within 4 meters of this Cog and take a -4 penalty to damage while threatened by them.",
        },
        "Threatening Aura III": {
          text: "All enemies (to the Cog) are threatened when they come within 12 meters of this Cog and take a -8 penalty to damage while threatened by them.",
        },
        Volatile: {
          text: "When this Cog dies, they explode, dealing Ld6 damage to all creatures in a radius of L (or smaller, set during Cog creation).",
        },
        Wrestler: {
          /* (requires Course of Contenders) */
          text: "This Cog can use Shove (Wrestler), Pin (Wrestler), and Reverse Maneuver (Wrestler).",
        },
        "Alert I": {
          text: "This Cog can spend 1 Action to gain Alert. A Cog can hold only L Alerts at a time.",
          section: "Defenses",
        },
        "Alert II": {
          text: "This Cog can spend 1 Action to gain Alert, and passively gains 1 Alert at the start of each of their turns. A Cog can hold only L Alerts at a time.",
        },
        "Alert III": {
          text: "This Cog can spend 1 Action to gain 2 Alert, and passively gains 1 Alert at the start of each of their turns. A Cog can hold only L Alerts at a time.",
        },
        "Alert IV": {
          text: "This Cog can spend 1 Action to gain 2 Alert, and passively gains 2 Alert at the start of each of their turns. A Cog can hold only L Alerts at a time.",
        },
        "Armored I": {
          text: "This Cog gains L/2 Armor.",
        },
        "Armored II": {
          text: "This Cog gains L Armor.",
        },
        "Bonus Vim I": {
          text: "This Cog has +5 Vim.",
        },
        "Bonus Vim II": {
          text: "This Cog has +10 Vim.",
        },
        "Bonus Vim III": {
          text: "This Cog has +15 Vim.",
        },
        "Dark Dweller": {
          text: "At the start of each turn, this Cog gains Alert if they are in complete darkness. They lose all Alerts when exposed to bright light.",
        },
        "Blocker I": {
          text: "On receiving a glancing blow, this Cog can spend a Reaction to gain +L Armor until its next turn.",
        },
        "Blocker II": {
          text: "On receiving a glancing blow or by spending 10 Vim, this Cog can spend a Reaction to gain +2L Armor until its next turn. When this occurs, they may attempt an attack in response as a Free Action.",
        },
        "Dodger I": {
          text: "On receiving a glancing blow, this Cog can spend a Reaction to negate the attack.",
        },
        "Dodger II": {
          text: "This Cog can spend a Reaction to negate any attack. When this occurs they may attempt an attack in response as a Free Action.",
        },
        "Dodger III": {
          text: "This Cog can spend a Reaction or 5 Vim to negate any attack. When this occurs they may attempt an attack in response as a Free Action.",
        },
        "Extra Health I": {
          text: "This Cog gains 1L HP (for a total of 6L HP). This cannot be taken with any Reduced Health Weakness.",
        },
        "Extra Health II": {
          text: "This Cog gains 2L HP (for a total of 8L HP).",
        },
        "Extra Health III": {
          text: "This Cog gains 2L HP (for a total of 10L HP). This ability cannot be taken if there is more than 1 copy of this Cog.",
        },
        "Parrier I": {
          text: "When this Cog is targeted with a melee attack, if their Accuracy + 5L is greater than the attacker's Accuracy, the attack is negated and the Cog may attempt an attack in response as a Free Action.",
        },
        "Parrier II": {
          text: "When this Cog is targeted with a melee attack, if their Accuracy + 10L is greater than the attacker's Accuracy, the attack is negated and the Cog may attempt an attack in response as a Free Action.",
        },
        Weaselly: {
          /* (requires Course of Contenders) */
          text: "This Cog gains +L to checks made to escape grapples and can use Weasel (Slippery).",
        },
        "Alert Ally": {
          text: "Once per turn, this Cog can spend 1 MP to grant Alert to another Cog.",
          section: "Special Defenses",
        },
        "Heal I": {
          text: "By spending 2 Actions and 1 MP, this Cog can heal themselves for 2L HP.",
        },
        "Heal II": {
          text: "By spending 2 Actions and 1 MP, this Cog can heal themselves or an ally within 12 meters for 2L HP.",
        },
        "Heal III": {
          text: "By spending 1 Action and 1 MP, this Cog can heal themselves or an ally within 12 meters for 2L HP.",
        },
        "Stable I": {
          text: "When this Cog is forcibly moved a number of meters, they move only half that distance.",
        },
        "Stable II": {
          text: "This Cog is immune to being forcibly moved.",
        },
        Patient: {
          text: "This Cog is immune to threatening.",
        },
        "Perfect Senses": {
          text: "This Cog is immune to Accuracy debuffs.",
        },
        Sturdy: {
          text: "This Cog is immune to being knocked prone.",
        },
        "Thorns I": {
          text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 1 HP.",
        },
        "Thorns II": {
          text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 3 HP. This ability replaces Thorns I.",
        },
        "Thorns III": {
          text: "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker loses 6 HP. This ability replaces Thorns I.",
        },
        "Attribute Damage Resistance I": {
          text: "Takes half damage from attribute damage. Cannot be taken with respective Vulnerability.",
        },
        "Attribute Damage Resistance II": {
          text: "Immune to attribute damage.",
        },
        "Magic Resistance I": {
          text: "Takes half damage from magic attacks. Cannot be taken with respective Vulnerability.",
        },
        "Magic Resistance II": {
          text: "Immune to magic attacks.",
        },
        "Fire Resistance I": {
          text: "Takes half damage from fire or burn damage. Cannot be taken with respective Vulnerability.",
        },
        "Fire Resistance II": {
          text: "Immune to fire attacks and burn damage.",
        },
        "Electrical Resistance I": {
          text: "Takes half damage from electrical attacks. Cannot be taken with respective Vulnerability.",
        },
        "Electrical Resistance II": {
          text: "Immune to electrical attacks.",
        },
        "Slashing Resistance I": {
          text: "Takes half damage from slashing attacks and bleed damage. Cannot be taken with respective Vulnerability.",
        },
        "Slashing Resistance II": {
          text: "Immune to slashing attacks and bleed damage.",
        },
        "Bludgeoning Resistance I": {
          text: "Takes half damage from bludgeoning attacks. Cannot be taken with respective Vulnerability.",
        },
        "Bludgeoning Resistance II": {
          text: "Immune to bludgeoning attacks.",
        },
        "Piercing Resistance I": {
          text: "Takes half damage from piercing attacks and bleed damage. Cannot be taken with respective Vulnerability.",
        },
        "Piercing Resistance II": {
          text: "Immune to piercing attacks and bleed damage.",
        },
        "Paralysis Resistance I": {
          text: "Takes half damage from paralysis damage. Cannot be taken with respective Vulnerability.",
        },
        "Paralysis Resistance II": {
          text: "Immune to paralysis damage.",
        },
        "Stun Resistance I": {
          text: "Takes half damage from stun damage. Cannot be taken with respective Vulnerability.",
        },
        "Stun Resistance II": {
          text: "Immune to stun damage.",
        },
        "Vim Damage Resistance I": {
          text: "Takes half damage from Vim Damage. Cannot be taken with respective Vulnerability.",
        },
        "Vim Damage Resistance II": {
          text: "Immune to Vim Damage.",
        },
      };
    },
    mutuallyExclusiveOptions() {
      return [["Small I", "Large I"]];
    },
    progressiveOptions() {
      return [
        ["Small I", "Small II"],
        ["Large I", "Large II", "Large III"],
        ["Fast I", "Fast II"],
        ["Flight I", "Flight II"],
        ["Swim I", "Swim II"],
        ["Bonus Accuracy I", "Bonus Accuracy II", "Bonus Accuracy II"],
        ["Bonus AP I", "Bonus AP II"],
        ["Bonus Damage I", "Bonus Damage II", "Bonus Damage III"],
        ["Reach I", "Reach II"],
        ["Frenzy I", "Frenzy II"],
        ["Full Attack I", "Full Attack II"],
        ["Harsh Opener I", "Harsh Opener II"],
        ["Thousand Cuts I", "Thousand Cuts II"],
        ["Threatening Aura I", "Threatening Aura II", "Threatening Aura III"],
        ["Alert I", "Alert II", "Alert III", "Alert IV"],
        ["Armored I", "Armored II"],
        ["Bonus Vim I", "Bonus Vim II", "Bonus Vim III"],
        ["Blocker I", "Blocker II"],
        ["Dodger I", "Dodger II", "Dodger III"],
        ["Extra Health I", "Extra Health II", "Extra Health III"],
        ["Parrier I", "Parrier II"],
        ["Heal I", "Heal II", "Heal III"],
        ["Stable I", "Stable II"],
        ["Thorns I", "Thorns II", "Thorns III"],
        ["Attribute Damage Resistance I", "Attribute Damage Resistance II"],
        ["Magic Resistance I", "Magic Resistance II"],
        ["Fire Resistance I", "Fire Resistance II"],
        ["Electrical Resistance I", "Electrical Resistance II"],
        ["Slashing Resistance I", "Slashing Resistance II"],
        ["Bludgeoning Resistance I", "Bludgeoning Resistance II"],
        ["Piercing Resistance I", "Piercing Resistance II"],
        ["Paralysis Resistance I", "Paralysis Resistance II"],
        ["Stun Resistance I", "Stun Resistance II"],
        ["Vim Damage Resistance I", "Vim Damage Resistance II"],
      ];
    },
    disabledOptions() {
      // TODO: Block options if their corresponding weakness was selected
      return [];
    },
  },
  methods: {
    emitNewList(list) {
      this.$emit("newTraitsList", list);
    },
  },
};
</script>
