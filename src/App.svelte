<script lang="ts">
  import { tweened } from "svelte/motion";
  import { quadInOut as easing } from "svelte/easing";
  import Player from "./Player.svelte";
  import maps from "./maps";
  import Crate from "./Crate.svelte";
  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";

  let level = 0;

  interface Tile {
    value: string;
    column: number;
    row: number;
  }

  const grid: Tile[][] = maps[level].split("\n").map((d, row) =>
    d
      .trim()
      .split("")
      .map((value, column) => ({
        value,
        column,
        row,
      }))
  )
  
  const columns = grid[0].length;
  const rows = grid.length; 

  const tiles = grid.flat()
  const staticMap = tiles.map(tile => (tile.value === "c" || tile.value === "p") ? {...tile, value: "e"} : tile)
  const targets = tiles.filter(({ value }) => value === "t");
  let crates = tiles.filter(({ value }) => value === "c");
  let player = tiles.find(({ value }) => value === "p");
  let hasWon = false;

  let playerPosition = {
    column: player.column,
    row: player.row,
  };

  const updatePlayer = (event) => {

    let dir = event.detail.key;
    let [dc, dr] = dirs[dir];

    let {column, row} = getNewPosition(dc, dr);

    if (newPositionIsWall(row, column)) return;

    let canMove = moveCrate(row, column, dc, dr);

    if (canMove) {
      playerPosition = {
        column,
        row,
      }
    }

    hasWon = checkWin();
  };

  const scale = tweened(1, { easing, duration: 300 });
  
  const handleReset = async () => {
  
    await scale.set(0);
  
    playerPosition =
      {
        column: player.column,
        row: player.row,
      };

    crates = grid
      .reduce((acc, curr) => [...acc, ...curr.map((cell) => ({ ...cell }))], [])
      .filter(({ value }) => value === "c" || value === "m");
  
    hasWon = false;
  
    await scale.set(1);
  };
  
  const newPositionIsWall = (row: number, column: number) => {
    return grid[row][column].value === "w";
  };

  const dirs = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  };

  const getNewPosition = (dc: number, dr: number) => {
    const { column: pc, row: pr } = playerPosition;
    return {column: pc + dc,  row: pr + dr};
  };

  const checkWin = () => {
    return crates.every(({ column: cc, row: cr }) =>
      targets.some(({ column: tc, row: tr }) => cc === tc && cr === tr)
    );
  };

  const moveCrate = (row: number, column: number, dc: number, dr: number) => {
    const crateIndex = crates.findIndex(
      ({ column: cc, row: rc }) => cc === column && rc === row
    );

    if (crateIndex !== -1) {
      const nc = column + dc;
      const nr = row + dr;

      if (grid[nr][nc].value === "w") return false;
      if (crates.find(({ column: cc, row: rc }) => cc === nc && rc === nr)) return false;

      crates[crateIndex].column = column + dc;
      crates[crateIndex].row = row + dr;
    }

    return true
  }

</script>

<article>
  <svg viewBox="0 0 {columns} {rows}">
   <Grid grid={staticMap}/>

    {#each crates as crate}
      <Crate position={crate} />
    {/each}

    <Player {playerPosition} {hasWon}/>
  </svg> 

  <Controls on:move={updatePlayer} on:reset={handleReset}/>
</article>

<style>
  :global(body) {
    color: #483628;
    background: #f9d29b;
  }
  article {
    max-width: 30rem;
    margin: 1rem auto;
  }
</style>
