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
  import Timer from "./Timer.svelte";

  export let level;
  let hasWon = false;
  let disableButtons = false;

  $: grid = maps[level].split("\n").map((d, row) =>
    d
      .split("")
      .map((value, column) => ({
        value,
        column,
        row,
      }))
  );

  $: columns = grid[0].length;
  $: rows = grid.length;

  $: tiles = [...grid.flat()];
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

  let previousCrates = [];
  let previousPlayerPosition = {};

  const updatePlayer =  async (event) => {
    if (hasWon) return;
    let [columnDirection, rowDirection] = directions[event.detail.key];
    let { column, row } = getNewPosition(columnDirection, rowDirection);

    if (newPositionIsWall(row, column)) return;
    if (crateBlocksMovement(row, column, columnDirection, rowDirection)) return

    previousCrates = JSON.parse(JSON.stringify(crates))
    previousPlayerPosition = {...playerPosition}

    moveCrate(row, column, columnDirection, rowDirection);
    movePlayer(row, column);

    if (playerWon()) {
      await advanceLevel(false);
    }
  };

  const handleReset = async () => {
    if (hasWon) return;
    movePlayer(player.row, player.column);
    crates = tiles
      .filter(({ value }) => value === CRATE || value === CRATE_ON_TARGET)
      .map((crate) => ({ ...crate }));
    previousCrates = JSON.parse(JSON.stringify(crates));
    previousPlayerPosition = {...playerPosition}
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

  function crateBlocksMovement(row: number, column: number, directionColumn: number, directionRow: number) {
        const crateIndex = getCrateIndex(row, column)
        if (crateIndex !== -1) {
            const newColumn = column + directionColumn;
            const newRow = row + directionRow;

            if (grid[newRow][newColumn].value === WALL) return true;
            if (crates.find(({column: crateColumn, row: crateRow}) => crateColumn === newColumn && crateRow === newRow)) return true;
        }
        return false
    }

  function getCrateIndex(row:number, column: number){
        return crates.findIndex(
            ({column: cc, row: rc}) => cc === column && rc === row
        );
    }

  const moveCrate = (row: number, column: number, dc: number, dr: number) => {
    const crateIndex = getCrateIndex(row, column)

    if (crateIndex !== -1) {
      const nc = column + dc;
      const nr = row + dr;

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
    disableButtons = true;
    let response: any = await endLevel(skipped);
    if (response) {
      disableButtons = false
      return;
    }
    hasWon = true;
    await new Promise((r) => setTimeout(r, 2000));
    await newLevel();
    await new Promise((r) => setTimeout(r, 500));
    hasWon = false;
    disableButtons = false;

  };

  async function newLevel() {
    let next = $game.levels[0] + 1;
    game.update((current) => {
      return { ...current, levels: [next, ...current.levels] };
    });
    if (next > maps.length - 1) {
      game.update((current) => {
        return { ...current, finished: true };
      });
      return;
    };
    await api.post("newLevel", { idLevel: $game.levels[0] });
  }

  async function endLevel(skipped: boolean) {
    return await api.patch("endLevel", { skipped });
  }

  const handleUndo = () => {
    crates = JSON.parse(JSON.stringify(previousCrates))
    playerPosition = {...previousPlayerPosition} as {column: number, row: number}
  }
</script>

<div class="gameContainer">
  <h1>Level {$game.levels[0]}</h1>
  <Timer />
  <svg viewBox="0 0 {columns} {rows}">
    <Grid grid={staticMap} />

    {#each crates as crate}
      <Crate {crate} />
    {/each}

    <Player {playerPosition} {hasWon} />
  </svg>

  <p>Move: Arrows|AWSD -- Reset: R -- Undo: U -- Skip: N</p>

  <Controls {disableButtons} on:move={updatePlayer} on:reset={handleReset} on:skip={() => advanceLevel(true)} on:undo={handleUndo} />
</div>

<style>

  h1 {
    margin: 0;
    color: rgb(228, 227, 227);
    margin-top: 2vh;
  }
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

  @media only screen and (max-width: 800px) {
    p {
     display: none;
    }
  }

  p {
    color: rgb(228, 227, 227);
    font-size: 0.7rem;
  }
</style>
