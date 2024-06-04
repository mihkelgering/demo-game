<script>
    import {tweened} from "svelte/motion";
    import {quadInOut as easing} from "svelte/easing";

    export let hasWon = false;
    export let playerPosition = {column: 0, row: 0};

    const player = tweened(
        undefined,
        {easing, duration: 250}
    );

    $: player.set(playerPosition);

</script>

<g transform="translate({$player.column} {$player.row})">
    <g transform="translate(0.5 0.5)" stroke="#411001" stroke-width="0.04">
        <circle fill="#feb16b" r="0.3"/>
        {#if hasWon}
            <g fill="none" stroke-linecap="round">
                <path d="M -0.15 -0.07 l 0.06 -0.04 0.06 0.04"/>
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
                <path d="M -0.16 -0.08 l 0.06 0.03 0.06 -0.03"/>
                <path
                        transform="scale(-1 1)"
                        d="M -0.16 -0.08 l 0.06 0.03 0.06 -0.03"
                />
                <path stroke-linecap="round" d="M -0.09 0.12 h 0.18"/>
            </g>
        {/if}
    </g>
</g>