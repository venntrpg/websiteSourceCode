<template>
  <div>
    <check-box
      v-for="toggle in releventToggles"
      v-bind:key="toggle.name"
      :checked="toggle.toggled"
      :text="toggle.name"
      :highlight="true"
      :smallText="true"
      @toggled="optionToggled(toggle)"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CheckBox from "../CheckBox.vue";
export default {
  components: { CheckBox },
  name: "DiceOtherToggles",
  props: { attr: String },
  computed: {
    ...mapState("dice", ["defaultDiceSettings"]),
    ...mapGetters("character", ["diceToggles"]),
    releventToggles() {
      const toggles = [];
      Object.entries(this.diceToggles).forEach(([key, val]) => {
        if (!val.attr || val.attr === this.attr) {
          const toggle = { ...val, name: key };
          const toggled =
            this.defaultDiceSettings.otherToggles[key] || val.default;
          toggle.toggled = Boolean(toggled);
          toggles.push(toggle);
        }
      });
      return toggles;
    },
  },
  methods: {
    optionToggled(toggle) {
      const defaultOtherToggles = { ...this.defaultDiceSettings.otherToggles };
      defaultOtherToggles[toggle.name] = !toggle.toggled;
      this.$store.commit("dice/setDefaultDiceSetting", {
        setting: "otherToggles",
        val: defaultOtherToggles,
      });
    },
  },
};
</script>
