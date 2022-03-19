/**
 * Formats a string referring to a cog's level
 * @param {*} lvl The cog's level, undefined or an empty string if unset
 * @param {*} def The default string if the cog's level is undefined. If not set, we return "L".
 * @param {*} fun Function used to modify the cog's level after turning it into a number. Takes in the level as an argument
 * @returns Formatted string with the cog's level.
 */
export function lvlStr(lvl, def, fun) {
  if (!lvl) {
    if (!def) {
      return "L";
    }
    return def;
  }
  if (!fun) {
    return "L (" + lvl + ")";
  }
  return def + " (" + fun(parseInt(lvl)) + ")";
}

/**
 * Very similar to `lvlStr` except that this always returns a number and not a string. The default value is 0
 * @param {*} lvl the cog's level, undefined or an empty string if unset
 * @param {*} fun Function used to modify the cog's level after turning it into a number. Takes in the level as an argument
 * @returns Number based on level and function
 */
export function lvlInt(lvl, fun) {
  const lvlDirect = parseInt(lvl);
  const lvlNum = isNaN(lvlDirect) ? 0 : lvlDirect;
  if (!fun) {
    return lvlNum;
  }
  return fun(lvlNum);
}

/**
 * Returns a string which acts as an HTML ID for the given ability.
 * @param {*} ability The ability we are linking to
 * @returns The unique HTML ID
export function getCogAbilityID(ability) {
  return "cog-ability-" + ability.name.replaceAll(/\s/g, "-");
}
*/
