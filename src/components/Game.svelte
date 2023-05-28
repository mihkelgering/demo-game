<script lang="ts">
  import Player from "./Player.svelte";
  import Crate from "./Crate.svelte";
  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";
  import maps from "../maps";
  import {
    CRATE,
    WALL,
    PLAYER,
    PLAYER_ON_TARGET,
    CRATE_ON_TARGET,
    TARGET,
    EMPTY,
  } from "../symbols";
  import { game } from "../store";
  import api from "../api/api";
  import type { GameState } from "../types";
  import Timer from "./Timer.svelte";

  export let level;
  let hasWon = false;

  $: grid = maps[level].split("\n").map((d, row) =>
    d
      .trim()
      .split("")
      .map((value, column) => ({
        value,
        column,
        row,
      }))
  );

  $: columns = grid[0].length;
  $: rows = grid.length;

  $: tiles = grid.flat();
  $: staticMap = tiles.map((tile) => {
    if (tile.value === CRATE || tile.value === PLAYER)
      return { ...tile, value: EMPTY };
    if (tile.value === PLAYER_ON_TARGET || tile.value === CRATE_ON_TARGET)
      return { ...tile, value: TARGET };
    return tile;
  });
  $: targets = tiles.filter(
    ({ value }) =>
      value === TARGET ||
      value === PLAYER_ON_TARGET ||
      value === CRATE_ON_TARGET
  );
  $: crates = tiles
    .filter(({ value }) => value === CRATE || value === CRATE_ON_TARGET)
    .map((crate) => ({ ...crate }));
  $: player = tiles.find(
    ({ value }) => value === PLAYER || value === PLAYER_ON_TARGET
  );

  $: playerPosition = {
    column: player.column,
    row: player.row,
  };

  const updatePlayer = async (event) => {
    if (hasWon) return;
    let [columnDirection, rowDirection] = directions[event.detail.key];
    let { column, row } = getNewPosition(columnDirection, rowDirection);

    if (newPositionIsWall(row, column)) return;

    let canMoveCrate = moveCrate(row, column, columnDirection, rowDirection);

    if (canMoveCrate) movePlayer(row, column);

    if (playerWon()) {
      advanceLevel(false);
    }
  };

  const handleReset = async () => {
    if (hasWon) return;
    movePlayer(player.row, player.column);
    crates = tiles
      .filter(({ value }) => value === CRATE || value === CRATE_ON_TARGET)
      .map((crate) => ({ ...crate }));
  };

  const newPositionIsWall = (row: number, column: number) => {
    return grid[row][column].value === WALL;
  };

  const directions = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  };

  const getNewPosition = (dc: number, dr: number) => {
    const { column: pc, row: pr } = playerPosition;
    return { column: pc + dc, row: pr + dr };
  };

  const playerWon = () => {
    return crates.every(({ column: cc, row: cr }) =>
      targets.some(({ column: tc, row: tr }) => cc === tc && cr === tr)
    );
  };

  const movePlayer = (row: number, column: number) => {
    playerPosition = {
      column,
      row,
    };
  };

  const moveCrate = (row: number, column: number, dc: number, dr: number) => {
    const crateIndex = crates.findIndex(
      ({ column: cc, row: rc }) => cc === column && rc === row
    );

    if (crateIndex !== -1) {
      const nc = column + dc;
      const nr = row + dr;

      if (grid[nr][nc].value === WALL) return false;
      if (crates.find(({ column: cc, row: rc }) => cc === nc && rc === nr))
        return false;

      crates[crateIndex].column = column + dc;
      crates[crateIndex].row = row + dr;

      if (targets.some(({ column: tc, row: tr }) => tc === nc && tr === nr)) {
        crates = crates.map((crate, i) => {
          return i === crateIndex ? {...crate, value: CRATE_ON_TARGET} : crate
      });
      } else {
        crates = crates.map((crate, i) => 
          i === crateIndex ? {...crate, value: CRATE} : crate
        );
      }
    }

    return true;
  };

  const advanceLevel = async (skipped: boolean) => {
    let response: any = await endLevel(skipped);
    if (response) return;
    hasWon = true;
    await new Promise((r) => setTimeout(r, 2000));
    await newLevel();
    await new Promise((r) => setTimeout(r, 500));
    hasWon = false;
  };

  async function newLevel() {
    let next = selectRandomLevel(maps.length, $game.levels);
    console.log(next);
    game.update((current) => {
      return { ...current, levels: [next, ...current.levels] };
    });
    if (next === -1) return;
    await api.post<GameState>("newLevel", { idLevel: $game.levels[0] });
  }

  async function endLevel(skipped: boolean) {
    return await api.patch("endLevel", { skipped });
  }

  function selectRandomLevel(max: number, subsetArray: number[]) {
    let fullArray = Array.from({length: max}, (_, i) => i + 1);
    let differenceArray = fullArray.filter(num => !subsetArray.includes(num));
    if (differenceArray.length === 0) return -1;
    let randomIndex = Math.floor(Math.random() * differenceArray.length);
    return differenceArray[randomIndex];
  }
</script>

<div class="gameContainer">

  <Timer />
  
  <svg viewBox="0 0 {columns} {rows}">
    <Grid grid={staticMap} />

    {#each crates as crate}
      <Crate {crate} />
    {/each}

    <Player {playerPosition} {hasWon} />
  </svg>

  <button class="skipButton" on:click={() => advanceLevel(true)}>Skip</button>

  <Controls on:move={updatePlayer} on:reset={handleReset} />


</div>

<style>
  .gameContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 98vh;
    margin-bottom: 2vh;
  }

  @media only screen and (max-width: 500px) {
    .gameContainer {
      width: 90%;
    }
}

  .skipButton {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    width: 20%;
    color: white;
    background-color: #483628;
    font-size:1.5vh;
    font-weight: bold;
    cursor: pointer;
    align-self: flex-end;
  }

  .skipButton:hover {
    background-color: #5e4c3c;
  }
</style>
