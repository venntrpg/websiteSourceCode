export function canUseAbility(character, ability) {
  if (ability && ability.cost) {
    if (ability.cost.Passive) {
      return false;
    }
    if (ability.cost.M && ability.cost.M > character.mp) {
      return false;
    }
    if (ability.cost.V && ability.cost.V > character.vim) {
      return false;
    }
    if (ability.cost.P && ability.cost.P > character.hero) {
      return false;
    }
    return true;
  }
  return false;
}

const freeAbilities = ["Alchemist's Training"]; // Alchemist's Training is free with Tinker's Training

export function actualCost(character, ability) {
  if (
    !ability ||
    !ability.purchase ||
    ability.purchase.includes("sp") ||
    freeAbilities.includes(ability.name)
  ) {
    // do not include sp here
    return 0;
  }
  let cost = parseInt(ability.purchase);
  if (
    ability.expedited &&
    character.gift !== "None" &&
    ability.expedited.includes(character.gift)
  ) {
    cost = cost / 2;
  }
  return cost;
}
