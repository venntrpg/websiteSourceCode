<template>
  <div>
    <h1>Combat</h1>
    <p class="mutedText">Note: These are currently just for show</p>
    <combat-time-buttons />
    <ability-table
      v-if="usableAbilities.length > 0"
      :abilities="usableAbilities"
      :id="character.id"
    />
    <h2>Usable weapons</h2>
    <item-table
      :hideCount="true"
      :id="character.id"
      :items="usableWeapons"
      :itemType="'Weapons'"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AbilityTable from "./AbilityTable.vue";
import ItemTable from "./ItemTable.vue";
import { canUseAbility } from "../../utils/abilityUtils";
import { defaultWeapons } from "../../utils/itemUtils";
import CombatTimeButtons from "./CombatSection/CombatTimeButtons.vue";

export default {
  components: { AbilityTable, ItemTable, CombatTimeButtons },
  name: "combat",
  computed: {
    ...mapState("character", ["character"]),
    ...mapGetters("character", ["consolidatedItems", "sortedAbilities"]),
    usableAbilities() {
      // TODO: append the 4 basic abilities at front here
      return this.sortedAbilities.filter(
        (ability) =>
          canUseAbility(this.character, ability) &&
          ability.activation !== "Respite"
      );
    },
    usableWeapons() {
      // TODO: append unarmed and improvised weapons to the end of this list
      return this.consolidatedItems
        .filter(
          (item) =>
            item.type === "weapon" &&
            (item.equipped || item.category === "Grenade")
        )
        .concat(defaultWeapons);
    },
  },
};
</script>
