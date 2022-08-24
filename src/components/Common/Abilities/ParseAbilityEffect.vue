<template>
  <div v-html="abilityEffectHtml"></div>
</template>

<script>
import { improveTextForDisplay } from "../../../utils/characterStringFormatting";
export default {
  name: "parseAbilityEffect",
  props: {
    ability: Object,
  },
  computed: {
    abilityEffectHtml() {
      if (!this.ability) {
        return "";
      }

      // pre-process special strings
      let effect = improveTextForDisplay(this.ability.effect);

      // do not allow line splits on triple digit collections used in things like spells.
      // E.g. "[ 3 / 5 / 7 ]"
      const tripleDigitRegex = /\[\s\+?-?\d+\s\/\s\+?-?\d+\s\/\s\+?-?\d+\s\]/g;
      effect = effect.replaceAll(tripleDigitRegex, (match) =>
        match.replaceAll(/\s/gi, "&nbsp;")
      );

      // TODO: Maybe also filter through this word by word and auto-generate links to the wiki for common words.
      let result = "";
      let inList = false;
      for (const line of effect.split("\n")) {
        if (line.length <= 0) {
          continue;
        }
        if (line.at(0) === "-" && line.length > 1) {
          if (!inList) {
            inList = true;
            result += "<ul>";
          }
          result += "<li>" + line.substring(2) + "</li>";
        } else {
          if (inList) {
            result += "</ul>";
            inList = false;
          }
          result += "<p>" + line + "</p>";
        }
      }
      return result;
    },
  },
};
</script>
