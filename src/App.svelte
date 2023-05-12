<script >
  import { tweened } from "svelte/motion";
  import { quadInOut as easing } from "svelte/easing";
  import Player from "./Player.svelte";
  import maps from "./maps";
  import Crate from "./Crate.svelte";

  let level = 0;

  const grid = maps[level].map.split("\n").map((d, row) =>
    d
      .trim()
      .split("")
      .map((value, column) => ({
        value,
        column,
        row,
      }))
  );
  
  $: height = maps[level].height;
  $: width = maps[level].width; 

  const cells = grid.reduce(
    (acc, curr) => [...acc, ...curr.map((cell) => ({ ...cell }))],
    []
  );
  const targets = cells.filter(({ value }) => value === "t" || value === "m");
  let crates = cells
    .map((cell) => ({ ...cell }))
    .filter(({ value }) => value === "c" || value === "m");

  const { column: pc, row: pr } = cells.find(({ value }) => value === "p");

  let playerPosition = {
      column: pc,
      row: pr,
    }

  const dirs = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  };

  let isMoving = false;
  let isResetting = false;
  let hasWon = false;

  const updatePlayer = async (dir) => {
    if (isMoving || isResetting) return;

    const [dc, dr] = dirs[dir];
    const { column: pc, row: pr } = playerPosition;
    const column = pc + dc;
    const row = pr + dr;

    if (grid[row][column].value === "w") return;

    const crateIndex = crates.findIndex(
      ({ column: cc, row: rc }) => cc === column && rc === row
    );

    if (crateIndex !== -1) {
      const nc = column + dc;
      const nr = row + dr;

      if (grid[nr][nc].value === "w") return;
      if (crates.find(({ column: cc, row: rc }) => cc === nc && rc === nr))
        return;
    }

    isMoving = true;

    if (crateIndex !== -1) {
      playerPosition = 
        {
          column,
          row,
        }
      crates[crateIndex].column = column + dc;
      crates[crateIndex].row = row + dr;

      hasWon = crates.every(({ column: cc, row: cr }) =>
        targets.some(({ column: tc, row: tr }) => cc === tc && cr === tr)
      );
    } else {
      playerPosition = {
        column,
        row,
      }
    }

    isMoving = false;
  };

  const scale = tweened(1, { easing, duration: 300 });

  const handleReset = async () => {
    if (isMoving || isResetting) return;

    isResetting = true;

    await scale.set(0);

    playerPosition = 
      {
        column: pc,
        row: pr,
      }
    crates = grid
      .reduce((acc, curr) => [...acc, ...curr.map((cell) => ({ ...cell }))], [])
      .filter(({ value }) => value === "c" || value === "m");

    hasWon = false;

    await scale.set(1);
    isResetting = false;
  };
</script>

<article>
  <svg viewBox="0 0 {width} {height}">
    <defs>
      <radialGradient id="gradient-t">
        <stop stop-color="#f2f7fb" offset="0" />
        <stop stop-color="#85cde6" offset="1" />
      </radialGradient>

      <g id="cell-w">
        <g stroke="#251311" stroke-width="0.02">
          <rect fill="#6e523a" width="1" height="1" />
          <g fill="none">
            <rect width="0.5" height="0.25" />
            <rect x="0.5" width="0.5" height="0.25" />
            <rect x="0.25" y="0.25" width="0.5" height="0.25" />
            <rect y="0.5" width="0.5" height="0.25" />
            <rect x="0.5" y="0.5" width="0.5" height="0.25" />
            <rect x="0.25" y="0.75" width="0.5" height="0.25" />
          </g>
        </g>
      </g>

      <g id="cell-t">
        <g
          transform="translate(0.5 0.5)"
          fill="url(#gradient-t)"
          stroke="#4b6a99"
          stroke-width="0.05"
        >
          <circle r="0.18" />
        </g>
      </g>
    </defs>

    <g>
      {#each grid.reduce((acc, curr) => [...acc, ...curr], []) as { value, column: x, row: y }}
        <use {x} {y} href="#cell-{value}" />
      {/each}
    </g>

    <g>
      {#each crates as crate}
        <Crate position={crate} />
      {/each}
    </g>

    <Player {playerPosition} {hasWon}/>
  </svg>

  <div>
    <button
      style:grid-area="up"
      on:click={() => {
        updatePlayer("up");
      }}
    >
      <span class="visually-hidden">Move up</span>
      <svg viewBox="-5 -5 10 10">
        <g fill="none" stroke="#411001" stroke-width="1">
          <path transform="rotate(0)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
        </g>
      </svg>
    </button>
    <button
      style:grid-area="right"
      on:click={() => {
        updatePlayer("right");
      }}
    >
      <span class="visually-hidden">Move right</span>
      <svg viewBox="-5 -5 10 10">
        <g fill="none" stroke="#411001" stroke-width="1">
          <path transform="rotate(90)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
        </g>
      </svg>
    </button>
    <button
      style:grid-area="down"
      on:click={() => {
        updatePlayer("down");
      }}
    >
      <span class="visually-hidden">Move down</span>
      <svg viewBox="-5 -5 10 10">
        <g fill="none" stroke="#411001" stroke-width="1">
          <path transform="rotate(180)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
        </g>
      </svg>
    </button>
    <button
      style:grid-area="left"
      on:click={() => {
        updatePlayer("left");
      }}
    >
      <span class="visually-hidden">Move left</span>
      <svg viewBox="-5 -5 10 10">
        <g fill="none" stroke="#411001" stroke-width="1">
          <path transform="rotate(270)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
        </g>
      </svg>
    </button>
    <button style:grid-area="reset" on:click={handleReset}>
      <span class="visually-hidden">Reset level</span>
      <svg viewBox="-5 -5 10 10">
        <g fill="none" stroke="#411001" stroke-width="1">
          <circle r="4" />
        </g>
      </svg>
    </button>
  </div>
</article>

<style>
  :global(body) {
    color: #483628;
    background: #f9d29b;
  }

  :global(.visually-hidden:not(:focus):not(:active)) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
  }

  article {
    max-width: 30rem;
    margin: 1rem auto;
  }

  @media (min-width: 30rem) {
    article {
      max-width: 42rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0 1rem;
    }

    article > svg {
      max-width: 30rem;
    }
  }

  article > * + * {
    margin-top: 1rem;
  }

  div {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-areas: ". up ." "left reset right" ". down .";
    grid-auto-rows: auto;
    gap: 0.25rem;
    justify-content: center;
    justify-items: center;
  }

  button {
    margin: 0;
    padding: 0;
    display: block;
    padding: 0.5rem;
    background: #feb16b;
    border: 0.18rem solid #411001;
    max-width: 3rem;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
