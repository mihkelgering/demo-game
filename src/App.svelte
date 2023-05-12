<script lang="ts">
  import Player from "./Player.svelte";
  import Crate from "./Crate.svelte";
  import Grid from "./Grid.svelte";
  import Controls from "./Controls.svelte";
  import maps from "./maps";

  let level = 0;
  let hasWon = false;

  interface Tile {
    value: string;
    column: number;
    row: number;
  }

  $: grid = maps[level].split("\n").map((d, row) =>
    d
      .trim()
      .split("")
      .map((value, column) => ({
        value,
        column,
        row,
      }))
  )
  
  $: columns = grid[0].length;
  $: rows = grid.length; 

  $: tiles = grid.flat()
  $: staticMap = tiles.map(tile => (tile.value === "c" || tile.value === "p") ? {...tile, value: "e"} : tile)
  $: targets = tiles.filter(({ value }) => value === "t");
  $: crates = tiles.filter(({ value }) => value === "c").map((crate) => ({ ...crate}));
  $: player = tiles.find(({ value }) => value === "p");


  $: playerPosition = {
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
    
    if (hasWon) {
      level += 1;
      handleReset();
    }
  };
  
  const handleReset = async () => {
  
    playerPosition =
      {
        column: player.column,
        row: player.row,
      };

    crates = tiles.filter(({ value }) => value === "c").map((crate) => ({ ...crate}));
  
    hasWon = false;
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
