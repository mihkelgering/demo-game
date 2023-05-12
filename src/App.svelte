<script lang=ts>
  import { tweened } from "svelte/motion";
  import { quadInOut as easing } from "svelte/easing";
  import levels from "./levelString";
  import Level from "./level";
  import State from "./state";
  import type { Direction } from "./direction";

  let level = new Level(levels[0]);
  let state = new State(level);

  const move = (dir: Direction) => {
    state.move(dir);
  };

  const move = (dir: Direction) => {



      hasWon = crates.every(({ column: cc, row: cr }) =>
        targets.some(({ column: tc, row: tr }) => cc === tc && cr === tr)
      );
    
  };


  //const handleReset = async () => {

  //  isResetting = true;

  //  await scale.set(0);

  //  await player.set(
  //    {
  //      column: pc,
  //      row: pr,
  //    },
  //    { duration: 100 }
  //  );
  //  crates = grid
  //    .reduce((acc, curr) => [...acc, ...curr.map((cell) => ({ ...cell }))], [])
  //    .filter(({ value }) => value === "c" || value === "m");

  //  hasWon = false;

  //  await scale.set(1);
  //  isResetting = false;
  //};
</script>

<article>
  <svg viewBox="0 0 {level.height} {level.width}">
    <defs>
      <radialGradient id="gradient-t">
        <stop stop-color="#f2f7fb" offset="0" />
        <stop stop-color="#85cde6" offset="1" />
      </radialGradient>

      <pattern
        id="pattern-b"
        viewBox="0 0 1 1"
        width="1"
        height="1"
        patternUnits="userSpaceOnUse"
      >
        <rect fill="#f9d29b" width="1" height="1" />
        <g fill="#e2b281">
          <rect x="0.25" y="0.2" width="0.1" height="0.1" />
          <rect x="0.65" y="0.4" width="0.1" height="0.1" />
          <rect x="0.65" y="0.8" width="0.1" height="0.1" />
          <rect x="0.252" y="0.6" width="0.1" height="0.1" />
        </g>
      </pattern>

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

      <g id="cell-crate">
        <g transform="translate(0.1 0.1)" stroke="#411001" stroke-width="0.05">
          <rect width="0.8" height="0.8" />
          <g transform="translate(0.1 0.1)">
            <rect width="0.6" height="0.6" />
            <path
              transform="translate(0.6 0) scale(-1 1)"
              d="M 0.1 0 L 0.6 0.5 0.6 0.6 0.5 0.6 0 0.1 0 0z"
            />
            <path d="M 0.1 0 L 0.6 0.5 0.6 0.6 0.5 0.6 0 0.1 0 0z" />
          </g>
        </g>
      </g>

      <g id="cell-player">
        <g transform="translate(0.5 0.5)" stroke="#411001" stroke-width="0.04">
          <circle fill="#feb16b" r="0.3" />
          {#if hasWon}
            <g fill="none" stroke-linecap="round">
              <path d="M -0.15 -0.07 l 0.06 -0.04 0.06 0.04 0.06" />
              <path
                transform="scale(-1 1)"
                d="M -0.15 -0.07 l 0.06 -0.04 0.06 0.04"
              />
              <path
                stroke-linecap="round"
                d="M -0.12 0.09 l 0.12 0.05 0.12 -0.05"
              />
            </g>
          {:else}
            <g fill="none" stroke-linecap="round">
              <path d="M -0.16 -0.08 l 0.06 0.03 0.06 -0.03 0.06" />
              <path
                transform="scale(-1 1)"
                d="M -0.16 -0.08 l 0.06 0.03 0.06 -0.03"
              />
              <path stroke-linecap="round" d="M -0.09 0.12 h 0.18" />
            </g>
          {/if}
        </g>
      </g>
    </defs>

    <rect fill="url(#pattern-b)" width={columns} height={rows} />

    <g>
      {#each grid.reduce((acc, curr) => [...acc, ...curr], []) as { value, column: x, row: y }}
        <use {x} {y} href="#cell-{value}" />
      {/each}
    </g>

    <g>
      {#each crates as { column, row }}
        <g transform="translate({column} {row})">
          <g
            transform="translate(0.5 0.5) scale({$scale}) translate(-0.5 -0.5)"
          >
            <use
              fill={targets.some(
                ({ column: tc, row: tr }) => tc === column && tr === row
              )
                ? "#98453d"
                : "#ed8e30"}
              href="#cell-crate"
            />
          </g>
        </g>
      {/each}
    </g>

    <g transform="translate({$player.column} {$player.row})">
      <g transform="translate(0.5 0.5) scale({$scale}) translate(-0.5 -0.5)">
        <use href="#cell-player" />
      </g>
    </g>
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
