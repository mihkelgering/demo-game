<script>
  import { tweened } from "svelte/motion";
  import { quadInOut as easing } from "svelte/easing";

  export let position = { column: 0, row: 0, value: "" };

  const crate = tweened(
    undefined,
    { easing, duration: 250 }
  );

  $: crate.set(position);

</script>

<g transform="translate({$crate.column} {$crate.row})">
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