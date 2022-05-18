export function buildDice(count, sides, adjust = 0, settings = {}) {
  let adjustStr = "";
  if (adjust > 0) {
    adjustStr = `+${adjust}`;
  } else if (adjust < 0) {
    adjustStr = adjust;
  }

  const explodeFields = { discord: "", roll20: "", web: "" };
  if (settings.explodes) {
    explodeFields.discord = "e1";
    explodeFields.roll20 = "!";
    explodeFields.web = "!";
  }
  const rerollFields = { discord: "", roll20: "", web: "" };
  if (settings.rr1s) {
    rerollFields.discord = "rr1";
    rerollFields.roll20 = "r";
    rerollFields.web = "r";
  }
  const dropFields = { discord: "", roll20: "", web: "" };
  if ("drop" in settings) {
    dropFields.discord = `p${settings.drop}`;
    dropFields.roll20 = `d${settings.drop}`;
    dropFields.web = `dl${settings.drop}`;
  }
  let fatiguedStr = "";
  if (settings.fatigued) {
    fatiguedStr = "-1";
  }
  let endStr = "";
  if ("end" in settings) {
    endStr = settings.end;
  }
  if (settings.flow) {
    count++;
  }
  if (settings.ebb) {
    count--;
  }
  return {
    discord:
      count +
      "d" +
      sides +
      explodeFields.discord +
      rerollFields.discord +
      dropFields.discord +
      adjustStr +
      fatiguedStr +
      endStr,
    roll20:
      count +
      "d" +
      sides +
      explodeFields.roll20 +
      rerollFields.roll20 +
      dropFields.roll20 +
      adjustStr +
      fatiguedStr +
      endStr,
    web:
      count +
      "d" +
      sides +
      explodeFields.web +
      rerollFields.web +
      dropFields.web +
      adjustStr +
      fatiguedStr +
      endStr,
  };
}

export function defaultDice(character, attr, settings = {}) {
  return buildDice(3, 6, character[attr], settings);
}

export function heroPointBoost(character, attr, settings = {}) {
  settings.drop = 1;
  settings.end = "+9";
  return defaultDice(character, attr, settings);
}

export function flowDice(character, attr, settings = {}) {
  settings.flow = true;
  return defaultDice(character, attr, settings);
}
