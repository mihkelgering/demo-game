<script lang='ts'>
  import { EMPTY, TARGET, WALL } from "../symbols";

  export let grid = [];
</script>

<g>

    <defs>
        <radialGradient id="gradient-t">
          <stop stop-color="#DCF900" offset="0" />
          <stop stop-color="#8F9910" offset="1" />
        </radialGradient>
  
        <g id={"cell-" + WALL}>
          <g stroke="#251311" stroke-width="0.02">
            <rect fill="#4C5057" width="1" height="1" />
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
  
        <g id={"cell-" + TARGET}>
          <g
            transform="translate(0.5 0.5)"
            fill="url(#gradient-t)"
            stroke="#8F9910"
            stroke-width="0.05"
          >
            <circle r="0.18" />
          </g>
        </g>
        <g id={"cell-" + EMPTY}>
          <g stroke="#251311" stroke-width="0.02">
            <rect fill="#101419" width="1" height="1" />
          </g>
        </g>
    </defs>

    {#each grid  as { value, column: x, row: y }}
      <use {x} {y} href="#cell-{value}" />
    {/each}
</g>