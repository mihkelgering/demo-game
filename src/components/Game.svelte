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

  let level = 0;
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
    let [columnDirection, rowDirection] = directions[event.detail.key];
    let { column, row } = getNewPosition(columnDirection, rowDirection);

    if (newPositionIsWall(row, column)) return;

    let canMoveCrate = moveCrate(row, column, columnDirection, rowDirection);

    if (canMoveCrate) movePlayer(row, column);

    if (playerWon()) {
      advanceLevel();
    }
  };

  const handleReset = async () => {
    console.log(player);
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
        crates[crateIndex].value = CRATE_ON_TARGET;
      } else {
        crates[crateIndex].value = CRATE;
      }
    }

    return true;
  };

  const advanceLevel = async () => {
    hasWon = true;
    await new Promise((r) => setTimeout(r, 2000));
    level += 1;
    level >= maps.length ? (level = 0) : level;
    hasWon = false;
  };

  const skipLevel = async () => {
    // POST request to end level with status Skipped and return next level
    console.log("User want to skip level");
  };
</script>

<article>
  <svg viewBox="0 0 {columns} {rows}">
    <Grid grid={staticMap} />

    {#each crates as crate}
      <Crate {crate} />
    {/each}

    <Player {playerPosition} {hasWon} />
  </svg>
  <button on:click={skipLevel}>Skip</button>
  <Controls on:move={updatePlayer} on:reset={handleReset} />
</article>

<style>
  :global(body) {
    color: #483628;
    background: #f9d29b;
    overflow-y: hidden;
  }
  article {
    max-width: 30rem;
    margin: 1rem auto;
  }
</style>
