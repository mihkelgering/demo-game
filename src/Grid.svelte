<script>
    export let grid = [];
</script>

<g>

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

    {#each grid  as { value, column: x, row: y }}
      <use {x} {y} href="#cell-{value}" />
    {/each}
</g>