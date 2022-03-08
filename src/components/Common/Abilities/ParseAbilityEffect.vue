<template>
  <div v-html="abilityEffectHtml"></div>
</template>

<script>
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
      let result = "";
      let inList = false;

      // pre-process special strings

      // do not allow line splits on triple digit collections used in things like spells.
      // E.g. "[ 3 / 5 / 7 ]"
      const tripleDigitRegex = /\[\s\+?-?\d+\s\/\s\+?-?\d+\s\/\s\+?-?\d+\s\]/g;
      const effect = this.ability.effect.replaceAll(tripleDigitRegex, (match) =>
        match.replaceAll(/\s/gi, "&nbsp;")
      );

      // TODO: Maybe also filter through this word by word and auto-generate links to the wiki for common words.
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
