<template>
  <div>
    <div class="labelText mt-8 ml-8">Other common settings:</div>
    <check-box
      :checked="defaultDiceSettings.flow"
      :highlight="true"
      text="Flow"
      @toggled="toggleDiceSetting('flow')"
    />
    <check-box
      :checked="defaultDiceSettings.ebb"
      :highlight="true"
      text="Ebb"
      @toggled="toggleDiceSetting('ebb')"
    />
    <check-box
      :checked="defaultDiceSettings.rr1s"
      :highlight="true"
      text="Re-roll All 1s"
      @toggled="toggleDiceSetting('rr1s')"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import CheckBox from "../CheckBox.vue";
export default {
  components: { CheckBox },
  name: "CommonDiceSettings",
  computed: {
    ...mapState("dice", ["defaultDiceSettings"]),
  },
  methods: {
    toggleDiceSetting(setting) {
      this.$store.commit("dice/setDefaultDiceSetting", {
        setting,
        val: !this.defaultDiceSettings[setting],
      });
    },
  },
};
</script>
