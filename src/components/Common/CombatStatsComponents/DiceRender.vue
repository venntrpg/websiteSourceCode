<template>
  <!-- Procedurally render dice rolls so if they are in a more complicated format than 3d6 + constant we can handle it -->
  <div class="diceRow diceSum">
    <div v-for="(diceElement, i) in roll.rolls" v-bind:key="i" class="diceRow">
      <div v-if="renderDie(diceElement)" class="diceRow">
        <div
          v-for="(die, j) in getDiceElementRolls(diceElement)"
          v-bind:key="j"
          class="diceRow"
        >
          <div v-if="j !== 0" class="diceElement math">
            <div class="shiftDown">+</div>
          </div>
          <div class="diceElement dice">
            <div class="shiftDown">{{ die.value }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="renderMath(diceElement)" class="diceElement math">
        <div class="shiftDown">{{ diceElement }}</div>
      </div>
      <div
        v-else-if="renderConstant(diceElement)"
        class="diceElement constantContainer"
      >
        <div class="diceElement constant">{{ diceElement }}</div>
      </div>
    </div>
    <div class="diceRow">
      <div class="diceElement math shiftDown">=</div>
      <div class="total shiftDown">{{ roll.total }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "diceRender",
  props: {
    roll: Object,
  },
  methods: {
    getDiceElementRolls(diceElement) {
      // ignore dropped dice for now
      // TODO: Figure out a nice way to render it instead
      return diceElement.rolls.filter((result) => result.useInTotal);
    },
    renderDie(diceElement) {
      return (
        typeof diceElement === "object" &&
        diceElement.length > 0 &&
        typeof diceElement.value === "number"
      );
    },
    renderMath(diceElement) {
      return typeof diceElement === "string";
    },
    renderConstant(diceElement) {
      return typeof diceElement === "number";
    },
  },
};
</script>

<style scoped>
.diceSum {
  margin-bottom: 8px;
}

.diceRow {
  display: flex;
  flex-wrap: wrap;
}

.diceElement {
  font-family: var(--number-font);
  font-weight: 500;
  font-size: 22pt;
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.dice {
  background-color: var(--main-button);
  color: white;
}

.math {
  font-weight: 400;
  width: 30px;
}

/* Pile constant and border on top of each other, so the border doesn't affect the height for the number */
.constantContainer {
  position: relative;
  width: 34px;
  height: 34px;
  border: 3px solid var(--yellow-300);
}
.constant {
  margin-left: -3px; /* margin left instead of top because of 3px border in container */
}

.total {
  font-family: var(--number-font);
  font-weight: 500;
  font-size: 22pt;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.shiftDown {
  margin-top: 3px;
}
</style>
