export function canUseAbility(character: Character, ability: Ability) {
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

export function actualCost(character: Character, ability: Ability) {
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

function sortedPaths(character: Character) {
  // sort by minimum purchased ability cost, at least for now - There are definetly better ways to do this sorting,
  // like using a predefined list from scraping the server or something. Maybe I should add that to the vennt-scripts
  // folder and automatically run and populate the resulting jsons into this repo when I deploy??
  if (character.abilities === undefined) {
    return [];
  }
  const pathCostMap: { [path: string]: number } = {};
  character.abilities.forEach((ability) => {
    let cost = 5000; // arbitrary amount that costs a lot
    if (ability.purchase) {
      const purchaseCost = parseInt(ability.purchase);
      if (isNaN(purchaseCost)) {
        cost = purchaseCost;
      }
    }
    if (
      ability === undefined ||
      ability.name === "NULL" ||
      ability.path === undefined
    ) {
      return;
    }
    if (ability.path in pathCostMap) {
      pathCostMap[ability.path] = Math.min(cost, pathCostMap[ability.path]);
    } else {
      pathCostMap[ability.path] = cost;
    }
  });
  const paths = Object.keys(pathCostMap);
  paths.sort((p1, p2) => pathCostMap[p1] - pathCostMap[p2]);
  return paths;
}

export function sortedAbilities(character: Character) {
  if (character.abilities === undefined) {
    return [];
  }
  const paths = sortedPaths(character);
  const abilitiesCopy = character.abilities.filter(
    (ability) => ability !== undefined && ability.name !== "NULL"
  );
  return abilitiesCopy.sort((a1, a2) => {
    // 1. put Passive abilities at the end of the list
    const a1Passive = a1.cost && "Passive" in a1.cost && a1.cost.Passive;
    const a2Passive = a2.cost && "Passive" in a2.cost && a2.cost.Passive;
    if (!a1Passive && a2Passive) {
      return -1;
    } else if (a1Passive && !a2Passive) {
      return 1;
    }
    // 2. put abilities which use SP instead of XP at the end of the list when passive
    if (a1Passive && a1.purchase && a2Passive && a2.purchase) {
      const a1SP = a1.purchase.includes("sp");
      const a2SP = a2.purchase.includes("sp");
      if (!a1SP && a2SP) {
        return -1;
      } else if (a1SP && !a2SP) {
        return 1;
      }
    }
    // 3. sort by path gathering
    if (a1.path && a2.path && a1.path !== a2.path) {
      const pathIdx = (given: string) =>
        paths.findIndex((path) => path === given);
      return pathIdx(a1.path) - pathIdx(a2.path);
    }
    // 4. sort by XP price otherwise (for now at least)
    const costInt = (purchase: string | undefined) => {
      if (purchase === undefined) {
        return 0;
      }
      const cost = parseInt(purchase);
      if (isNaN(cost)) {
        return 0;
      }
      return cost;
    };
    return costInt(a1.purchase) - costInt(a2.purchase);
  });
}
