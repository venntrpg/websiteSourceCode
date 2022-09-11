export function buildDice(
  count: number,
  sides: number,
  adjust: number | string = 0,
  settings: DiceSettings = {}
) {
  let adjustStr = "";
  if (typeof adjust === "string") {
    adjustStr = adjust;
  } else {
    if (adjust > 0) {
      adjustStr = `+${adjust}`;
    } else if (adjust < 0) {
      adjustStr = adjust.toString();
    }
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
  if (settings.end) {
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
    settings: { ...settings, adjust, count, sides },
  };
}

export function defaultDice(
  character: Character,
  attr: keyof Character,
  settings: DiceSettings = {}
) {
  const adjust =
    typeof character[attr] === "number" ? (character[attr] as number) : 0;
  return buildDice(3, 6, adjust, settings);
}

export function heroPointBoost(
  character: Character,
  attr: keyof Character,
  settings: DiceSettings = {}
) {
  settings.drop = 1;
  settings.end = "+9";
  return defaultDice(character, attr, settings);
}

export function flowDice(
  character: Character,
  attr: keyof Character,
  settings: DiceSettings = {}
) {
  settings.flow = true;
  return defaultDice(character, attr, settings);
}

export function diceParseFromString(
  diceStr: string,
  settings: DiceSettings = {}
) {
  const match = diceStr.match(/(\d+)d(\d+)/);
  if (!match || match.length < 3) {
    return undefined;
  }
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  if (isNaN(count) || isNaN(sides)) {
    return undefined;
  }
  const adjust = diceStr.substring(match[0].length);
  return buildDice(count, sides, adjust, settings);
}
